import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserDeleteParams {
    id : string,
}

const userDeleteVaildator = {
    id : serviceConfig.paramsValidator.id,
}

const userDeleteActions : ActionSchema = {
    name : serviceConfig.user.actions.delete.name,
    rest : serviceConfig.user.actions.delete.rest,
    params : {
        id : userDeleteVaildator.id,
    },
    async handler(this : UsersServiceThis, ctx : Context<UserDeleteParams>){
        // 인가 로직 필요
        // 유효하지 않은 파라미터 추가 시 에러 발생
        const user = await this.adapter.findById(ctx.params.id);
        if(!user){throw new Error("User not found");}
        await this.adapter.removeById(ctx.params.id);
        return {request : "success"};
    }
}

export default userDeleteActions;