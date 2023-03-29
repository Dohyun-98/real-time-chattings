import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import DbService from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
import serviceConfig from "../config/service.config";
import chatActions from "./schema/actions/chat.actions";
import chatServiceCreated from "./schema/lifecycle/chat.service.created";
import chatServiceStarted from "./schema/lifecycle/chat.service.started";
import chatServiceStopped from "./schema/lifecycle/chat.service.stopped";

// 내 채팅 방 조회
// 내 채팅방 내 채팅 내역 조회
// 채팅 내역 저장
// 채팅방 생성(DB 저장)
// 채팅방 수정(인원 변경)

export default class ChatService extends Service {
	constructor(broker: ServiceBroker) {
		super(broker);
        this.adapter = new MongoDbAdapter(serviceConfig.chat.database.mongo.uri,{
            useNewUrlParser: true,
        });
		this.parseServiceSchema({
			name: serviceConfig.chat.serviceName,
            mixins: [DbService],
            actions: chatActions,
            dependencies: ["users", "chatRoom"],
            adapter: this.chatAdapter,
            collection: serviceConfig.chat.database.mongo.collection,
            created: chatServiceCreated,
            started: chatServiceStarted,
            stopped: chatServiceStopped,
		});
	}
}
