import type { Room } from '../../type/chatRoom.type';

function makeChatRoom (participants: string[], roomName: string) : Pick<Room,"participants"|"roomName"> {
    return {
        participants,
        roomName,
    }
    
}

const chatRoomMethods = {
    makeChatRoom,
}

export default chatRoomMethods;