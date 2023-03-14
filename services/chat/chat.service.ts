import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";

// 내 채팅 내역 조회
// 채팅 내역 저장 서비스 별칭 호출용
//

export default class ChatService extends Service {
	constructor(broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "chat",
		});
	}
}
