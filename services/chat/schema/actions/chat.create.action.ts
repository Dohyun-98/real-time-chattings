import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { ChatServiceThis } from "../../type/chat.service.type";


interface ChatCreateParams {
    userId : string,
    userName : string,
    message : string,
    roomId : string,
}

const chatCreateVaildator = {
    userId : serviceConfig.paramsValidator.id,
    userName : serviceConfig.paramsValidator.name,
    message : serviceConfig.paramsValidator.message,
    roomId : serviceConfig.paramsValidator.id,
}

const chatCreateAction : ActionSchema = {
    name: serviceConfig.chat.actions.createChat.name,
    params: {
        userId : chatCreateVaildator.userId,
        userName : chatCreateVaildator.userName,
        message : chatCreateVaildator.message,
        roomId : chatCreateVaildator.roomId,
    },
    async handler(this: ChatServiceThis, ctx: Context<ChatCreateParams>){
        const {userId,userName,message,roomId} = ctx.params;
        const chat = await this.adapter.insert({
            userId,
            userName,
            message,
            roomId,
            createdAt : new Date(),
        });
        return chat;
    }
}

export default chatCreateAction;