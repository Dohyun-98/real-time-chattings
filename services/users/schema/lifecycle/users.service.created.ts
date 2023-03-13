import { UsersServiceThis } from "../../type/service/users.service.type";

export default function UsersServiceCreated (this:UsersServiceThis) {
    this.broker.logger.info("Users service created");
}