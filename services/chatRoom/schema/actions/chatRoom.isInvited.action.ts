import type { ActionSchema, Context } from "moleculer";
import serviceConfig from "../../../config/service.config";
import type { User } from "../../../users/type/user.type";
import type { ChatRoomServiceThis } from "../../type/chatRoom.service.type";

interface IsInvitedParams {
    userId: string;
    roomId: string;
}

const isInvitedVaildator = {
    userId: serviceConfig.paramsValidator.id,
    roomId: serviceConfig.paramsValidator.id,
};

const isInvited : ActionSchema = {
    name:serviceConfig.chatRoom.actions.isInvited.name,
    params: {
        userId: isInvitedVaildator.userId,
        roomId: isInvitedVaildator.roomId,
    },
    async handler(this:ChatRoomServiceThis,ctx: Context<IsInvitedParams>){
        const room : any = await this.adapter.findById(ctx.params.roomId);
        if(!room){
            throw new Error("Room not found");
        }
        // O(n)
        return room.participants.some((participant:Partial<User>) => participant._id === ctx.params.userId);
    },
};

export default isInvited;