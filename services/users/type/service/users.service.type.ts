import { Service } from "moleculer";
import { MongoService } from "../../../../utill/mongo/interface/mongo.service.interface";

export type UsersServiceThis =  Service & MongoService;
