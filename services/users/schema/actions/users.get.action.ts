import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { UsersServiceThis } from "../../type/users.service.type";

interface UserGetParams {
    id : string,
}

const userGetActions : ActionSchema = {
    name: serviceConfig.user.actions.get.name,
    // rest: serviceConfig.user.actions.get.rest,
    async handler(this:UsersServiceThis, ctx: Context<UserGetParams> & {meta : {user : {id : string}}}){
        // 인가 로직 필요
        // 유효하지 않은 파라미터 추가 시 에러 발생
        console.log(ctx.meta.user.id);
        const user = await this.adapter.findById(ctx.meta.user.id);
        if(!user){throw new Error("User not found");}
        return user;
    }
}

export default userGetActions;