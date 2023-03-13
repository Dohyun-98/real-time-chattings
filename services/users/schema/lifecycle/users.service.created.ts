import type { UsersServiceThis } from "../../type/service/users.service.type";

function usersServiceCreated (this:UsersServiceThis) : void {
    this.broker.logger.info("Users service created");
    this.adapter.init(this.broker,this);
    this.logger.info("Users service database initialized");
}

export default usersServiceCreated;