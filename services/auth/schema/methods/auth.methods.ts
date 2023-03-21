import jwt from "jsonwebtoken";
import type { User } from "../../../users/type/user.type";

const makeAccessToken : (user:User, secret:string, expire:string) => string = (user,secret,expire) => {
    const role = user.role??"user";
    const token = jwt.sign({id:user._id, name:user.name,email:user.email,role},secret,{expiresIn:expire});
    return token;
}

const authMethods = {
    makeAccessToken,
}

export default authMethods;