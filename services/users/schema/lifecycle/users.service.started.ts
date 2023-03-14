import type { UsersServiceThis } from "../../type/users.service.type";

async function usersServiceStarted(this: UsersServiceThis) : Promise<void> {
        await this.adapter.connect();
        this.logger.info("Users service database connected");
        this.logger.info("Users service started");
}
export default usersServiceStarted;