import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import DbService from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
import serviceConfig from "../config/service.config";
import chatRoomServiceCreated from "./schema/lifecycle/chatRoom.service.created";
import chatRoomServiceStarted from "./schema/lifecycle/chatRoom.service.started";
import chatRoomServiceStopped from "./schema/lifecycle/chatRoom.service.stopped";

export default class ChatRommService extends Service {
    constructor(broker: ServiceBroker){
        super(broker);
        this.parseServiceSchema({
            name: "chatRoom",
            mixins: [DbService],
            dependencies: ["users"],
            adapter: new MongoDbAdapter(serviceConfig.chatRoom.database.mongo.uri),
            collection: serviceConfig.chatRoom.database.mongo.collection,
            created: chatRoomServiceCreated,
            started: chatRoomServiceStarted,
            stopped: chatRoomServiceStopped,
        });

    }
    
}