import type { IoServiceThis } from "../../type/io.service.type";


function ioServiceStopped (this:IoServiceThis) : void {
    this.logger.info("IO service stopped");
}

export default ioServiceStopped;