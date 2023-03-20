import jwt from "jsonwebtoken";
import type { Context } from "moleculer";
import type { IncomingRequest, Route } from "moleculer-web";
import ApiGatewayService from "moleculer-web";
import serviceConfig from "../../services/config/service.config";

function authenticate(
    ctx: Context,
    route: Route,
    req: IncomingRequest,
): Record<string, unknown> | null {
    // Read the token from header
    const auth = req.headers.authorization;
    if(!auth||!auth.startsWith('Bearer')){throw new ApiGatewayService.Errors.UnAuthorizedError('INVALID_TOKEN', 'Invalid token');}
    const accessToken = auth.split(' ')[1];
    let user : any;
    jwt.verify(accessToken,serviceConfig.gateway.jwt.access.secret,(err,decoded)=>{
        if(err){throw new ApiGatewayService.Errors.UnAuthorizedError('INVALID_TOKEN', 'Invalid token');}
        user = decoded;
    })
    return { id: user._id, email: user.email };
}

export default authenticate;
