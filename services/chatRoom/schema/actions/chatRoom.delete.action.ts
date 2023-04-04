import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";

interface ChatRoomDeleteParams {
    roomId: string;
}

const chatRoomDeleteVaildator = {
    roomId: serviceConfig.paramsValidator.id,
};

const chatRoomDeleteAction : ActionSchema = {
    name: serviceConfig.chatRoom.actions.deleteChatRoom.name,
    params: {
        roomId: chatRoomDeleteVaildator.roomId,
    },
    async handler(ctx: Context<ChatRoomDeleteParams>){
        const room = await this.adapter.findById(ctx.params.roomId);
        if(!room){
            throw new Error("Room not found");
        }
        await this.adapter.removeById(ctx.params.roomId);
    },

}

export default chatRoomDeleteAction;