import type { ChatServiceThis } from "../../type/chat.service.type";

function chatServiceStopped(this:ChatServiceThis): void{
    this.logger.info("Chat service stopped");
}

export default chatServiceStopped;