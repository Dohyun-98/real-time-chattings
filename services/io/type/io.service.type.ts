import type { Redis } from "ioredis";
import type { Service } from "moleculer";
import type { Server } from "socket.io";

export type IoServiceThis = Service & { io: Server , redis:Redis}

export interface ChatMessage{
    roomId:string,
    message:string,
}