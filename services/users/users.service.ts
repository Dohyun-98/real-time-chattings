import { Service, ServiceBroker } from "moleculer";
import MongoDbAdapter from "moleculer-db-adapter-mongo";
import { MongoService } from "../../utill/mongo/interface/mongo.service.interface";
import * as actions from "./schema/actions/users.actions";
import UsersServiceCreated from "./schema/lifecycle/users.service.created";
import { UsersServiceStarted } from "./schema/lifecycle/users.service.started";
import { UsersServiceStopped } from "./schema/lifecycle/users.service.stoped";

export default class UsersService extends Service implements MongoService  {
    adapter;
    constructor(broker: ServiceBroker) {
        super(broker);
        this.adapter = new MongoDbAdapter(String(process.env.MONGO_URI));
        this.parseServiceSchema({
            name: "users",
            actions,
            created: UsersServiceCreated,
            started: UsersServiceStarted,
            stopped: UsersServiceStopped,
        });
    }   
}