import type{ ChatRoomServiceThis } from "../../type/chatRoom.service.type";

async function chatRoomServiceStarted(this:ChatRoomServiceThis):Promise<void>{
    this.logger.info("Chat room service started")
    await this.adapter.connect();
    this.logger.info("Chat room service database connected");
}
export default chatRoomServiceStarted;