import type { UsersServiceThis } from "../../type/users.service.type";

async function usersServiceStopped(this: UsersServiceThis): Promise<void> {
    await this.adapter.disconnect();
    this.logger.info("Users service database disconnected");
    this.logger.info("Users service stopped");
}

export default usersServiceStopped;