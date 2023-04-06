import type { ActionSchema, Context} from "moleculer";
import { Errors } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { User } from "../../type/user.type";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserFindByIdsParams {
    ids : string[],
}

const userFindByIdsVaildator = {
    ids : serviceConfig.paramsValidator.ids,
}

const userFindByIdsAction : ActionSchema = {
    name : serviceConfig.user.actions.findByIds.name,
    params : {
       ids : userFindByIdsVaildator.ids,
    },
    async handler(this:UsersServiceThis, ctx:Context<UserFindByIdsParams>){
        validateParams(ctx.params,userFindByIdsVaildator)
        const result = await this.adapter.findByIds(ctx.params.ids);
        const users = result.map((user:Partial<User>) => ({
                _id : user._id,
                name : user.name,
                email : user.email,
            }));
        if(users.length!==ctx.params.ids.length) {
            throw new Errors.MoleculerClientError("user not found", 404, "USER_NOT_FOUND", {ctx});
        }
        return users;
    }
}

export default userFindByIdsAction;