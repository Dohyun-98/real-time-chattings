import type { ChatServiceThis } from "../../type/users.service.type";

function chatServiceStopped(this:ChatServiceThis): void{
    this.logger.info("Chat service stopped");
}

export default chatServiceStopped;