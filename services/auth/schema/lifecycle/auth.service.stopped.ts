import type { AuthServiceThis } from "../../type/auth.service.type";

function authServiceStopped (this: AuthServiceThis) : void {
    this.broker.logger.info("Auth service stopped");
}

export default authServiceStopped;