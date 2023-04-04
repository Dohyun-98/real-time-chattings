import type { Context, EventSchema } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { IoServiceThis } from "../../type/io.service.type";

interface InviteRoomParams {
    roomId : string,
    participants : string[],
}

const inviteRoomEvent : EventSchema = {
    name : serviceConfig.io.events.inviteRoom.name,
    async handler(this:IoServiceThis,ctx:Context<InviteRoomParams>){
        const {roomId,participants} = ctx.params;
        if(!this.io){
            return;
        }
        const inviteSocketIds = await this.redis.mget(participants);
        // emit `inviteRoom` event to inviteSocketIds
        for(const socketId of inviteSocketIds){
            if(socketId){
                const isExistSocketId = this.io.of('/chat').sockets.has(socketId);
                console.log(`isExistSocketId : ${isExistSocketId}`);
                if(isExistSocketId){
                    this.io.of('chat').to(socketId).emit('invitedRoom',{roomId});
                }
            }
        }
    }
}

export default inviteRoomEvent;