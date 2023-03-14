import { Redis } from "ioredis";
import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import serviceConfig from "../config/service.config";
import UsersService from "../users/users.service";
import actions from "./schema/actions/auth.actions";
import authServiceCreated from "./schema/lifecycle/auth.service.created";
import authServiceStarted from "./schema/lifecycle/auth.service.started";
import authServiceStopped from "./schema/lifecycle/auth.service.stopped";
import methods from "./schema/methods/auth.methods";

export default class AuthService extends Service {
    redis;

    constructor(broker:ServiceBroker){
        super(broker);
        this.redis = new Redis({
            host: serviceConfig.auth.redis.host,
            port: serviceConfig.auth.redis.port,
        });
        this.parseServiceSchema({
            name: serviceConfig.auth.serviceName,
            redis: this.redis,
            mixins: [],
            actions,
            methods,
            dependencies: [UsersService],
            created : authServiceCreated,
            started : authServiceStarted,
            stopped : authServiceStopped,
        });
    }
}