import userCreateActions from "./users.create.action";
import userDeleteActions from "./users.delete.action";
import userFindByEmailAction from "./users.findByEmail.action";
import userGetActions from "./users.get.action";
import userUpdateActions from "./users.update.action";

const userActions = {
    userCreateActions,
    userUpdateActions,
    userGetActions,
    userDeleteActions,
    userFindByEmailAction,
}
export default userActions;