import type { ChatServiceThis } from "../../type/chat.service.type";

async function chatServiceStopped(this:ChatServiceThis): Promise<void>{
    await this.adapter.disconnect();
    this.logger.info("Chat service database disconnected");
    this.logger.info("Chat service stopped");
}

export default chatServiceStopped;