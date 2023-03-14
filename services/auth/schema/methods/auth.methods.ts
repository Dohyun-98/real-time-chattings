import jwt from "jsonwebtoken";
import type { User } from "../../../users/type/user.type";

const makeAccessToken : (user:User, secret:string, expire:string) => string = (user,secret,expire) => {
    const token = jwt.sign({id:user.id, name:user.name},secret,{expiresIn:expire});
    return token;
}


const authMethods = {
    makeAccessToken,
}

export default authMethods;