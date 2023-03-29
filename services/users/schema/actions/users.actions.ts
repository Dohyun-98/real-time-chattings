import userCreateAction from "./users.create.action";
import userDeleteAction from "./users.delete.action";
import userFindByEmailAction from "./users.findByEmail.action";
import userFindByIdsAction from "./users.findByIds.action";
import userGetAction from "./users.get.action";
import userUpdateAction from "./users.update.action";

const userActions = {
    userCreateAction,
    userUpdateAction,
    userGetAction,
    userDeleteAction,
    userFindByEmailAction,
    userFindByIdsAction,
}
export default userActions;