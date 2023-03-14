import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import serviceConfig from "../config/service.config";
import ioServiceCreated from "./schema/lifecycle/io.service.created";
import ioServiceStarted from "./schema/lifecycle/io.service.started";
import ioServiceStopped from "./schema/lifecycle/io.service.stopped";

export default class IOService extends Service {
	constructor(broker: ServiceBroker) {
		super(broker);
		this.io = undefined;
		this.parseServiceSchema({
			name: serviceConfig.io.serviceName,
			io: this.io,
			mixins: [],
			dependencies: [],
			created: ioServiceCreated,
			started: ioServiceStarted,
			stopped: ioServiceStopped,
		});
	}
}
