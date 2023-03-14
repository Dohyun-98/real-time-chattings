import type { AuthServiceThis } from "../../type/auth.service.type";

function authServiceCreated (this: AuthServiceThis) : void {
    this.broker.logger.info("Auth service created");
}

export default authServiceCreated;