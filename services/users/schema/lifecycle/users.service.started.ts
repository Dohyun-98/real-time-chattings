import { UsersServiceThis } from "../../type/service/users.service.type";

export async function  UsersServiceStarted (this : UsersServiceThis){
   this.logger.info("Users service started");
    //  this.adapter.init(this.broker,this)
    await this.adapter.connect();
    this.logger.info('Users service database connected')
}