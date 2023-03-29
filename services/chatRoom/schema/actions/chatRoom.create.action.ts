import type { ActionSchema, Context } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { ChatRoomServiceThis } from "../../type/chatRoom.service.type";

interface ChatRoomCreateParams {
    participants : string[],
    roomName : string,
}

const chatRoomCreateVaildator = {
    roomName : serviceConfig.paramsValidator.roomName,
    participants : serviceConfig.paramsValidator.participants,
}

const chatRoomCreateAction : ActionSchema = {
    name: serviceConfig.chatRoom.actions.createChatRoom.name,
    rest: serviceConfig.chatRoom.actions.createChatRoom.rest,
    params: {
        roomName : chatRoomCreateVaildator.roomName,
        participants : chatRoomCreateVaildator.participants,
    },
    async handler(this: ChatRoomServiceThis,ctx:Context<ChatRoomCreateParams>){
        // 유효하지 않은 파라미터 추가 시 에러 발생
        validateParams(ctx.params,chatRoomCreateVaildator);
        const users = await this.broker.call(`${serviceConfig.user.serviceName}.${serviceConfig.user.actions.findByIds.name}`,{ids : ctx.params.participants});
        const chatRoom = await this.makeChatRoom(users,ctx.params.roomName);
        const room = await this.adapter.insert(chatRoom).catch((err) => {throw new Error(err)});
        return room;
    }
}

export default chatRoomCreateAction;