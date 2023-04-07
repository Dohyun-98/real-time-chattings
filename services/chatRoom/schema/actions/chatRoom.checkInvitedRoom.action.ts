import type { ActionSchema } from "moleculer";

const checkInvitedRoom : ActionSchema = {
    name : 'checkInvitedRoom',
    // 내가 초대된 방이 있는 지 확인 존재하면 방 정보를 반환
    // 존재하지 않으면 null 반환
    // 클라이언트에서는 방 정보가 확인 될때, joinRooms 이벤트를 발생시켜서 방에 입장
    
}

export default checkInvitedRoom;