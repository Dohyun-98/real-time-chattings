import type { Service } from "moleculer";
import type { Server } from "socket.io";

export type IoServiceThis = Service & { io: Server | undefined}
