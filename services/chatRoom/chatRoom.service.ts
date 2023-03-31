import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import DbService from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
import serviceConfig from "../config/service.config";
import chatRoomActions from "./schema/actions/chatRoom.actions";
import chatRoomServiceCreated from "./schema/lifecycle/chatRoom.service.created";
import chatRoomServiceStarted from "./schema/lifecycle/chatRoom.service.started";
import chatRoomServiceStopped from "./schema/lifecycle/chatRoom.service.stopped";
import chatRoomMethods from "./schema/methods/chatRoom.methods";

export default class ChatRoomService extends Service {
    constructor(broker: ServiceBroker){
        super(broker);
        this.parseServiceSchema({
            name: serviceConfig.chatRoom.serviceName,
            mixins: [DbService],
            dependencies: ["users"],
            actions: chatRoomActions,
            methods: chatRoomMethods,
            adapter: new MongoDbAdapter(serviceConfig.chatRoom.database.mongo.uri),
            collection: serviceConfig.chatRoom.database.mongo.collection,
            created: chatRoomServiceCreated,
            started: chatRoomServiceStarted,
            stopped: chatRoomServiceStopped,
        });

    }
    
}