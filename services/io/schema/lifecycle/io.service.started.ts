/* eslint-disable no-param-reassign */
import http from "http";
import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import type { Room } from "../../../chatRoom/type/chatRoom.type";
import serviceConfig from "../../../config/service.config";
import type { IoServiceThis } from "../../type/io.service.type";

function ioServiceStarted (this:IoServiceThis) : void {
    const server = http.createServer();
    this.io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            },
        });
    server.listen(serviceConfig.io.socket.port, () => {
        this.logger.info(`Socket server listening on port ${serviceConfig.io.socket.port}`);
    });
    this.logger.info("IO service started");
    this.io.of('chat').use((socket:Socket, next) => {
        const accessToken = socket.handshake.query.token;
        jwt.verify(String(accessToken),serviceConfig.gateway.jwt.access.secret,(err,decoded)=>{
            if(err){next(new Error("Invalid token"));}
            socket.data.user = decoded;
            next();
        })
       
    });
    this.io.of("/chat").on("connection",async(socket:Socket) => {
        // access token으로 유저 정보 조회
        // redis에 socket.id 저장
        await this.redis.set(socket.data.user.id,socket.id);
        socket.on("disconnect",async() => {
            await this.redis.del(socket.data.user.id);
            this.logger.info(`Socket disconnected: ${socket.id}`);
        });
        // 방 참가
        socket.on("joinRoom",async(roomId:string) => {
            // db에서 방 정보 조회 후 방에 참가
            await socket.join(roomId);
            this.logger.info(`Socket ${socket.id} joined room ${roomId}`);
        });

        // 방 생성
        socket.on("createRoom",async(roomName:string,participants:string[]) => {
            const room : Room = await this.broker.call(`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.createChatRoom.name}`,{
                roomName,
                participants,
            })
            await socket.join(room._id);
            // 초대 로직   
            // event를 이용해서 다른 socket에게 초대 메시지 전달
            await this.broker.broadcast(serviceConfig.io.events.inviteRoom.name,{roomId : room._id,participants});
        });
        // 초대 이벤트 발생시, 
        // redis를 조회하여 socket.id를 조회한 후 해당 socket에게 초대 메시지 전달

        // 방 나가기
        socket.on("leaveRoom",async(roomId:string) => {
             // 방에 남은 사람이 없으면 방 삭제
            // 방에 남은 사람이 존재하면, 방 정보에서 나간 사람 삭제 및 방 알림
            await socket.leave(roomId);
            this.logger.info(`Socket ${socket.id} left room ${roomId}`);
        });
        // 채팅 메시지 보내기
        // RabbitMQ PuB
        socket.on("sendMessage", (roomName:string, message:string) => {
            this.logger.info(`Socket ${socket.id} sent message ${message} to room ${roomName}`);
            // RabbitMQ Publish
            
        });

        // 채팅 메시지 받기
        // RabbitMQ Sub
        socket.on("receiveMessage", (roomName:string, message:string) => {
            this.logger.info(`Socket ${socket.id} received message ${message} to room ${roomName}`);
            // RabbitMQ Subscribe
           // RabbitMQ로 부터 전달 받은 메시지 room으로 emit
        });
    });

}

export default ioServiceStarted;