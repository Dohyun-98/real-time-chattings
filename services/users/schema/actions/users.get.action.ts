import type { ActionSchema, Context } from "moleculer";
import validateParams from "../../../../utill/paramsVaildator/validator.params";
import serviceConfig from "../../../config/service.config";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserGetParams {
    id : string,
}

const userGetVaildator = {
    id : {type : "string", min : 15, max : 20},
}


const userGetActions : ActionSchema = {
    name: serviceConfig.user.actions.get.name,
    rest: serviceConfig.user.actions.get.rest,
    params:{
        id : userGetVaildator.id,
    },
    async handler(this:UsersServiceThis, ctx: Context<UserGetParams>){
        // 인가 로직 필요
        // 유효하지 않은 파라미터 추가 시 에러 발생
        validateParams(ctx.params,userGetVaildator);
        const user = await this.adapter.findById(ctx.params.id);
        if(!user){throw new Error("User not found");}
        return user;
    }
}

export default userGetActions;