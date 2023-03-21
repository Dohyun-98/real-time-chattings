import type { ChatServiceThis } from "../../type/chat.service.type";

async function chatServiceStarted(this:ChatServiceThis): Promise<void>{
    this.logger.info("Chat service started");
    await this.adapter.connect();
    this.logger.info("Chat service database connected");
}

export default chatServiceStarted;