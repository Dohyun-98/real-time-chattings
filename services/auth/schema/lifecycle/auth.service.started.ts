import type { AuthServiceThis } from "../../type/auth.service.type";

function authServiceStarted (this: AuthServiceThis) : void {
    this.broker.logger.info("Auth service started");
}

export default authServiceStarted;