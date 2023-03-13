import type { User } from "../../../../utill/mongo/model/user";

interface UserMethods {
    makeUser: (email:string,name:string,password:string) => Promise<User>;
}

export default UserMethods;