import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { User } from "../../type/user.type";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserGetParams {
    id : string,
}

const userGetAction : ActionSchema = {
    name: serviceConfig.user.actions.get.name,
    // rest: serviceConfig.user.actions.get.rest,
    async handler(this:UsersServiceThis, ctx: Context<UserGetParams> & {meta : {user : {id : string}}}){
        const user : Partial<User> = await this.adapter.findOne({id : ctx.params.id});
        if(!user){throw new Error("User not found");}
        const userData = {
            id : user._id,
            email : user.email,
            name : user.name,
        }
        return userData;
    }
}

export default userGetAction;