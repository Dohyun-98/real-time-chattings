import { UsersServiceThis } from "../../type/service/users.service.type";

export async function UsersServiceStopped(this: UsersServiceThis) {
    await this.adapter.disconnect();
    this.logger.info("Users service database disconnected");
    this.logger.info("Users service stopped");
}