import type { IoServiceThis } from "../../type/io.service.type";


function ioServiceCreated (this:IoServiceThis) : void {
    this.logger.info("IO service created");
}

export default ioServiceCreated;