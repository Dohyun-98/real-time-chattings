import type{ ChatRoomServiceThis } from "../../type/chatRoom.service.type";

async function chatRoomServiceStopped(this:ChatRoomServiceThis):Promise<void>{
    this.logger.info("Chat room service stopped")
    await this.adapter.disconnect();
}
export default chatRoomServiceStopped;