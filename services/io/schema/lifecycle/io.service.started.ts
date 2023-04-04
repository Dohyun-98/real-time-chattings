import http from "http";
import amqp from "amqplib";
import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import type { Room } from "../../../chatRoom/type/chatRoom.type";
import serviceConfig from "../../../config/service.config";
import type { ChatMessage, IoServiceThis } from "../../type/io.service.type";

function ioServiceStarted(this: IoServiceThis): void {
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
	this.io.of("chat").use((socket: Socket, next) => {
		const accessToken = socket.handshake.query.token as string;
		jwt.verify(String(accessToken), serviceConfig.gateway.jwt.access.secret, (err, decoded) => {
			if (err) {
			    next(new Error("Authentication error"));
			}
			// eslint-disable-next-line no-param-reassign
			socket.data.user = decoded;
			next();
		});
	});
	this.io.of("/chat").on("connection", async (socket: Socket) => {
        // 같은 pod 내에서는 socket.id가 고유하지만 다른 pod에서는 같은 값이 나올 수 있음
        // 고유한 값으로 socket.id를 저장할 필요는! 없지... 왜 why 검사하면 나오니깐..
		// access token으로 유저 정보 조회
		// redis에 socket.id 저장
		await this.redis.set(socket.data.user.id, socket.id);
		socket.on("disconnect", async () => {
			await this.redis.del(socket.data.user.id);
			this.logger.info(`Socket disconnected: ${socket.id}`);
		});
		// 방 참가
		socket.on("joinRoom", async (roomId: string) => {
			// db에서 방 정보 조회 후 방에 참가
            const isInvited = await this.broker.call(`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.isInvited.name}`, {
                userId: socket.data.user.id,
                roomId,
            });
            if(isInvited){
                // console.log(`${socket.data.user.id} is invited to ${roomId}`);
                await socket.join(roomId);
                this.logger.info(`Socket ${socket.id} joined room ${roomId}`);
            }else{
                socket.emit('error', "You are not invited to this room");
            }
		});
		// 방 생성
		socket.on("createRoom", async (roomName: string, participants: string[]) => {
            const participantsWithMe = [...participants, socket.data.user.id];
			const room: Room = await this.broker.call(
				`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.createChatRoom.name}`,
				{
					roomName,
					participants: participantsWithMe,
				},
			);
			await socket.join(room._id);
			// 초대 로직
			// event를 이용해서 다른 socket에게 초대 메시지 전달
            // 나를 제외한 
			await this.broker.broadcast(serviceConfig.io.events.inviteRoom.name, {
				roomId: room._id,
				participants,
			});
			// Rabbit room_id queue 생성
			const exchangeName = "chat";
			const exchangeType = "topic";
			const rabbitmq = await amqp
				.connect({
					hostname: serviceConfig.io.rabbitmq.host,
					port: serviceConfig.io.rabbitmq.port,
					username: serviceConfig.io.rabbitmq.username,
					password: serviceConfig.io.rabbitmq.password,
				})
				.then((conn) => conn.createChannel());
			/**
			 * 1. create channel : 채널 생성
			 * 2. assertExchange : exchange 생성
			 * 3. assertQueue : queue 생성
			 * 4. bindQueue : queue와 exchange를 binding
			 */
			await rabbitmq.assertExchange(exchangeName, exchangeType, { durable: true });
			await rabbitmq
				.assertQueue(room._id)
				.then((q) => rabbitmq.bindQueue(q.queue, exchangeName, room._id));
			await rabbitmq.consume(
				room._id,
				(msg) => {
					if (msg !== null) {
						const {userId,name,message} = JSON.parse(msg.content.toString());
						this.io.of("/chat").to(room._id).emit("chattingMessage", {userId,name,message},{});
						rabbitmq.ack(msg);
					}
				},
			); 
		});
		// 초대 이벤트 발생시,
		// redis를 조회하여 socket.id를 조회한 후 해당 socket에게 초대 메시지 전달

		// 방 나가기
		socket.on("leaveRoom", async (roomId: string) => {
			// 방에 남은 사람이 없으면 방 삭제
            const {user} = socket.data;
            if (this.io.of("/chat").adapter.rooms.get(roomId)?.size === 0) {
                // 방 삭제 이벤트 발생
                await this.broker.call(`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.deleteChatRoom.name}`, {
                    roomId,
                });
            }else{
                // 방에 남은 사람이 존재하면, 방 정보에서 나간 사람 삭제 및 방 알림 이벤트 발생
                await this.broker.call(`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.leaveRoom.name}`, {
                    roomId,
                    userId:user.id,
                });
            }
			await socket.leave(roomId);
			this.logger.info(`Socket ${socket.id} left room ${roomId}`);
		});
		// 채팅 메시지 보내기
		// RabbitMQ PuB
		socket.on("sendMessage",async (content:ChatMessage) => {
			// chat 서비스에 채팅 내역 저장 (chatRoomId, userId,name, message)
           try {
                const {roomId, message} = content;
                const {user} = socket.data;
                // RabbitMQ Publish
                const isInsert = await this.broker.call(`${serviceConfig.chat.serviceName}.${serviceConfig.chat.actions.createChat.name}`,{roomId,userId:user.id,userName:user.name,message});
                if(!isInsert){
                    throw new Error("database insert error");
                }
                const exchangeName = "chat";
                const exchangeType = "topic";
                const rabbitmq = await amqp
                    .connect({
                        hostname: serviceConfig.io.rabbitmq.host,
                        port: serviceConfig.io.rabbitmq.port,
                        username: serviceConfig.io.rabbitmq.username,
                        password: serviceConfig.io.rabbitmq.password,
                    })
                    .then((conn) => conn.createChannel());
                await rabbitmq.assertExchange(exchangeName, exchangeType, { durable: true });
                await rabbitmq
                    .assertQueue(roomId)
                    .then((q) => rabbitmq.bindQueue(q.queue, exchangeName, roomId));
                rabbitmq.publish(exchangeName, roomId, Buffer.from(JSON.stringify({
                    userId: user.id,
                    name: user.name,
                    message
            })));
            await rabbitmq.close();
           } catch (error) {
                this.logger.error(error);
                socket.emit("error",error);
           }
		});
	});
}

export default ioServiceStarted;
