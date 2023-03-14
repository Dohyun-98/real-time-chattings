import type { ActionSchema, Context } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserFindByEmailParams {
    email : string,
}

const userFindByEmailVaildator = {
    email : serviceConfig.paramsValidator.email,
}

const userFindByEmailAction : ActionSchema = {
    name : serviceConfig.user.actions.findByEmail.name,
    params : {
        email : userFindByEmailVaildator.email,
    },
    async handler(this:UsersServiceThis, ctx:Context<UserFindByEmailParams>){
        validateParams(ctx.params,userFindByEmailVaildator)
        const user = await this.adapter.findOne({email : ctx.params.email});
        if(!user){throw new Error("User not found");}
        return user;
    }
}

export default userFindByEmailAction;