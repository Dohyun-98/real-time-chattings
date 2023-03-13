import type { ActionSchema,Context } from 'moleculer';
import { validate } from 'uuid';
import  serviceConfig  from '../../../../config/service.config';
import type { UsersServiceThis } from '../../type/service/users.service.type';

interface UserCreateParams {
    name : string,
    email : string,
    password : string,
}
const userVaildation = {
    name: {type : "string", min : 3, max : 20},
    email : {type : "email"},
    password : {type : "string", min : 6, max : 20},
}

 const userCreateActions : ActionSchema = {
    name: 'createUser',
    rest: serviceConfig.user.path.create,
    params: {
        name : userVaildation.name,
        email : userVaildation.email,
        password : userVaildation.password,
    },
    async handler(this:UsersServiceThis,ctx: Context<UserCreateParams>){
        const isExistEmail = await this.adapter.findOne({email : ctx.params.email});
        if(isExistEmail){throw new Error("Email already exist");}
        /**
         * 차 후 이메일 인증확인 로직 필요
         */
        const user = await this.makeUser(ctx.params.email,ctx.params.name,ctx.params.password);
        const result = await this.adapter.insert(user);
        if(!result){throw new Error("User not created");}
        return {request : "success"}
    }

}


export default userCreateActions;