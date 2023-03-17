import type { ActionSchema,Context } from 'moleculer';
import validateParams from '../../../../utill/paramsVaildator/validator.params';
import serviceConfig from '../../../config/service.config';
import type { UsersServiceThis } from '../../type/users.service.type';

interface UserCreateParams {
    name : string,
    email : string,
    password : string,
}

const userCreateVaildator = {
    name: serviceConfig.paramsValidator.name,
    email : serviceConfig.paramsValidator.email,
    password : serviceConfig.paramsValidator.password,
}

 const userCreateActions : ActionSchema = {
    name: serviceConfig.user.actions.create.name,
    // rest: serviceConfig.user.actions.create.rest,
    params: {
        name : userCreateVaildator.name,
        email : userCreateVaildator.email,
        password : userCreateVaildator.password,
    },

    async handler(this:UsersServiceThis,ctx: Context<UserCreateParams>){
        // 유효하지 않은 파라미터 추가 시 에러 발생
        validateParams(ctx.params,userCreateVaildator);
        // email 인증 확인 비즈니스 로직 필요
        const isExistEmail = await this.adapter.findOne({email : ctx.params.email});
        if(isExistEmail){throw new Error("Email already exist");}
        const user = await this.makeUser(ctx.params.email,ctx.params.name,ctx.params.password);
        await this.adapter.insert(user).catch((err) => {throw new Error(err)});
        return {request : "success"}
    }

}


export default userCreateActions;