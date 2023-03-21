import type{ ChatRoomServiceThis } from "../../type/chatRoom.service.type";

function chatRoomServiceCreated(this:ChatRoomServiceThis):void{
    this.logger.info("Chat room service created")
    this.adapter.init(this.broker,this);
    this.logger.info("Chat room service database initialized");

}
export default chatRoomServiceCreated;