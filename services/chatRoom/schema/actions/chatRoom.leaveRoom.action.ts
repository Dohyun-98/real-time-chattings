import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { ChatRoomServiceThis } from "../../type/chatRoom.service.type";

interface LeaveRoomParams {
    roomId : string,
    userId : string,
}

const leaveRoomVaildator = {
    roomId : serviceConfig.paramsValidator.id,
    userId : serviceConfig.paramsValidator.id,
}

const leaveRoom : ActionSchema = {
    name: serviceConfig.chatRoom.actions.leaveRoom.name,
    params: {
        roomId : leaveRoomVaildator.roomId,
        userId : leaveRoomVaildator.userId,
    },
    async handler(this:ChatRoomServiceThis ,ctx:Context<LeaveRoomParams>){
        // 방 정보 가져오기
        // 존재하지 않으면 예외처리
        // 존재하면 참가자를 배열에서 제거하는 업데이트 진행
        const room : any = await this.adapter.findById(ctx.params.roomId);
        if(!room){
            throw new Error("Room not found");
        }
        // const participantsWithoutMe = room.participants.filter((participant:Partial<User>) => participant._id !== ctx.params.userId);
        // $pull : 지정된 조건과 일치하는 값의 모든 인스턴스를 기존 배열에서 제거
        await this.adapter.updateById(ctx.params.roomId,{$pull : {participants : {_id : ctx.params.userId}}});
        
    }
}

export default leaveRoom;