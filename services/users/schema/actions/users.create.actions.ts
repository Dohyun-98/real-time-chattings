import { ActionSchema,Context } from 'moleculer';
import { ServiceConfig } from '../../../../config/service.config';

import { UserParams } from '../../type/params/user.params.type';

interface UserCreateParams {
    id : string,
    name : string,
    email : string,
    password : string,
}


export const UserCreateActions : ActionSchema = {
    rest: ServiceConfig.user.path.create,
    params: {
        id : UserParams.id,
        name : UserParams.name,
        email : UserParams.email,
        password : UserParams.password,
    },
    async handler(ctx: Context<UserCreateParams>){
        
    }

}