import type { ServiceBroker } from "moleculer";
import { Service } from "moleculer";
import DbService from "moleculer-db";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
import serviceConfig from "../config/service.config";
import userActions from "./schema/actions/users.actions";
import usersServiceCreated from "./schema/lifecycle/users.service.created";
import usersServiceStarted  from "./schema/lifecycle/users.service.started";
import usersServiceStopped  from "./schema/lifecycle/users.service.stopped";
import userMethods from "./schema/methods/users.methods";

export default class UsersService extends Service{
    adapter;

    collection;

    constructor(broker: ServiceBroker) {
        super(broker);
        this.adapter = new MongoDbAdapter(serviceConfig.user.database.mongo.uri);
        this.collection = serviceConfig.user.database.mongo.collection;
        this.parseServiceSchema({
            name: serviceConfig.user.serviceName,
            mixins: [DbService],
            dependencies: [],
            adapter: this.adapter,
            collection: this.collection,
            actions: userActions,
            methods: userMethods,
            created: usersServiceCreated,
            started: usersServiceStarted,
            stopped: usersServiceStopped,
        });
    }  
}