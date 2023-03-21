import type { ActionSchema, Context } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { ChatRoomServiceThis } from "../../type/chatRoom.service.type";

interface ChatRoomCreateParams {
    participants : string[],
}

const chatRoomCreateVaildator = {
    participants : serviceConfig.paramsValidator.participants,
}

const chatRoomCreateAction : ActionSchema = {
    name: serviceConfig.chatRoom.actions.createChatRoom.name,
    rest: serviceConfig.chatRoom.actions.createChatRoom.rest,
    params: {
        participants : chatRoomCreateVaildator.participants,
    },
    async handler(this: ChatRoomServiceThis,ctx:Context<ChatRoomCreateParams>){
        // 유효하지 않은 파라미터 추가 시 에러 발생
        validateParams(ctx.params,chatRoomCreateVaildator);
        // email 인증 확인 비즈니스 로직 필요
        const isExistChatRoom = await this.adapter.findOne({participants : ctx.params.participants});
        if(isExistChatRoom){throw new Error("ChatRoom already exist");}
        const chatRoom = await this.makeChatRoom(ctx.params.participants);
        await this.adapter.insert(chatRoom).catch((err) => {throw new Error(err)});
        return {request : "success"}
    }
}

export default chatRoomCreateAction;