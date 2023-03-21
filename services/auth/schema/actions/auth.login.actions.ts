import * as bcrypt from "bcrypt";
import type { ActionSchema, Context } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { User } from "../../../users/type/user.type";
import type { AuthServiceThis } from "../../type/auth.service.type";

interface AuthLoginParams {
    email : string,
    password : string,
}

const authLoginVaildator = {
    email : serviceConfig.paramsValidator.email,
    password : serviceConfig.paramsValidator.password,
}

const authLoginAction : ActionSchema = {
    rest: serviceConfig.auth.actions.login.rest,
    name: serviceConfig.auth.actions.login.name,
    params: {
        email : authLoginVaildator.email,
        password : authLoginVaildator.password,
    },
    async handler(this:AuthServiceThis, ctx:Context<AuthLoginParams>){
        validateParams(ctx.params,authLoginVaildator);
        const user : User = await this.broker.call(`${serviceConfig.user.serviceName}.${serviceConfig.user.actions.findByEmail.name}`,{email:ctx.params.email});
        if(!bcrypt.compareSync(ctx.params.password,user.password)){throw new Error("Password is not correct");}
        const token = await this.makeAccessToken(user,serviceConfig.auth.jwt.access.secret,serviceConfig.auth.jwt.access.expire);
        return {token};
    }
}

export default authLoginAction;