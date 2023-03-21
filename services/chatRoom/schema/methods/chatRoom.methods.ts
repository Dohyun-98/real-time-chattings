import { v4 as uuidv4 } from 'uuid';

function makeChatRoom (participants: string[], name?: string) {
    if(!name){
        let count = 0;
        name = participants.filter((person)=>{
            return person !== this.name;
        }).join(", ");
    }
    return {
        roomID: uuidv4(),
        participants,
        roomName : 
    }
}

const chatRoomMethods = {
    
}

export default chatRoomMethods;