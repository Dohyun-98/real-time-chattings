import type { Service } from "moleculer";
import type MongoDbAdapter from "moleculer-db-adapter-mongo";


export type ChatRoomServiceThis =  Service & {adapter : MongoDbAdapter, collections : string} 