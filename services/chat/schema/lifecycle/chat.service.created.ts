import type { ChatServiceThis } from "../../type/users.service.type";

function chatServiceCreated(this:ChatServiceThis): void{
    this.logger.info("Chat service created");
    this.adapter.init(this.broker,this);
    this.logger.info("Chat service database initialized");
}

export default chatServiceCreated;