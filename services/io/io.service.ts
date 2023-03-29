import { Redis } from "ioredis";
import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import serviceConfig from "../config/service.config";
import ioServiceCreated from "./schema/lifecycle/io.service.created";
import ioServiceStarted from "./schema/lifecycle/io.service.started";
import ioServiceStopped from "./schema/lifecycle/io.service.stopped";

export default class IOService extends Service {

    redis = new Redis(serviceConfig.io.redis);

	constructor(broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: serviceConfig.io.serviceName,
            redis : this.redis,
			io: undefined,
			mixins: [],
			dependencies: [],
			created: ioServiceCreated,
			started: ioServiceStarted,
			stopped: ioServiceStopped,
		});
	}
}
