import type { ActionSchema, Context } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserUpdateParams {
    id : string,
    name : string,
    email : string,
    password : string,
}

const userUpdateVaildator = {
    id : serviceConfig.paramsValidator.id,
    name : serviceConfig.paramsValidator.name,
    email : serviceConfig.paramsValidator.email,
    password : serviceConfig.paramsValidator.password,
}

const userUpdateActions: ActionSchema = {
    name: serviceConfig.user.actions.update.name,
    params : {
        id : userUpdateVaildator.id,
        name : userUpdateVaildator.name,
        email : userUpdateVaildator.email,
        password : userUpdateVaildator.password,
    },
    async handler(this:UsersServiceThis, ctx:Context<UserUpdateParams>){
        validateParams(ctx.params,userUpdateVaildator);
        // 인가 확인 로직 필요(JWT)
        const isExist = await this.adapter.findById(ctx.params.id);
        if(!isExist){throw new Error("User not found");}
        const user = await this.makeUser(ctx.params.email,ctx.params.name,ctx.params.password);
        await this.adapter.updateById(ctx.params.id,user).catch((err) => {throw new Error(err)});
        return {request : "success"}
    }
}

export default userUpdateActions;