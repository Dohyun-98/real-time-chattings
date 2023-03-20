import * as bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
import type { User } from '../../type/user.type';

const makeUser: (email:string,name:string,password:string) => Promise<Pick<User,"email"|"name"|"password"> > = async (email,name,password) => {
    const hashPassword = await bcrypt.hash(password,10);
    // const id = uuidv4();
    return {
        // id,
        email,
        name,
        password : hashPassword,
    }
}

const userMethods = {
    makeUser,
}

export default userMethods;