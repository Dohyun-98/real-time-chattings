import http from "http";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import serviceConfig from "../../../config/service.config";
import type { IoServiceThis } from "../../type/io.service.type";

function ioServiceStarted (this:IoServiceThis) : void {
    // this.io = new Server(this.broker.server, {
    //     cors: {
    //         origin: "*",
    //         methods: ["GET", "POST", "PUT", "DELETE"],
    //         },
    //     });
    // port 3001\\
    const server = http.createServer();
    this.io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            },
        });
    server.listen(serviceConfig.io.socket.port, () => {
        this.logger.info(`Socket server listening on port ${serviceConfig.io.socket.port}`);
    });
    this.logger.info("IO service started");
    this.io.of("/chat").on("connection", (socket:Socket) => {
        this.logger.info(`Socket connected: ${socket.id}`);
        socket.on("disconnect", () => {
            this.logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

}

export default ioServiceStarted;