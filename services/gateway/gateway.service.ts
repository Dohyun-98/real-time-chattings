import jwt from "jsonwebtoken";
import type { Context, ServiceSchema } from "moleculer";
import type { ApiSettingsSchema, IncomingRequest, Route } from "moleculer-web";
import ApiGateway from "moleculer-web";
import serviceConfig from "../config/service.config";


interface Meta {
	userAgent?: string | null | undefined;
	user?: object | null | undefined;
}

const GatewayService: ServiceSchema<ApiSettingsSchema> = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT != null ? Number(process.env.PORT) : 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
            {
                path: "/users",
                aliases: {
                    "POST /": `${serviceConfig.user.serviceName}.${serviceConfig.user.actions.create.name}`,
                    // "GET /": "users.getUsers",
                },
               authentication: false,
            },
            {
                path: "/users",
                aliases: {
                    "GET /:id": `${serviceConfig.user.serviceName}.${serviceConfig.user.actions.get.name}`,
                    "PUT /:id": `${serviceConfig.user.serviceName}.${serviceConfig.user.actions.update.name}`,
                    "DELETE /:id": `${serviceConfig.user.serviceName}.${serviceConfig.user.actions.delete.name}`,
                },
                authentication: true,
            },
            {
                path: "/api",
                aliases: {
                    // "POST /auth/login": `${serviceConfig.auth.serviceName}.${serviceConfig.auth.actions.login.name}`,
                    // "POST /auth/register": `${serviceConfig.auth.serviceName}.${serviceConfig.auth.actions.register.name}`,
                    // "POST /auth/logout": `${serviceConfig.auth.serviceName}.${serviceConfig.auth.actions.logout.name}`,
                    // "POST /auth/refresh": `${serviceConfig.auth.serviceName}.${serviceConfig.auth.actions.refresh.name}`,
                    // socket
                },
            },
			{
				path: "/api",

				whitelist: ["**"],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

               
				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,
                aliases: {
                    // "POST: /users": "users.userCreateActions",
                },
			

				/**
				 * Before call hook. You can check the request.
				 *
				onBeforeCall(
					ctx: Context<unknown, Meta>,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
				): void {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 *
				onAfterCall(
					ctx: Context,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
					data: unknown,
				): unknown {
					// Async function which return with Promise
					// return this.doSomething(ctx, res, data);
					return data;
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 */
		authenticate(
			ctx: Context,
			route: Route,
			req: IncomingRequest,
		): Record<string, unknown> | null {
			// Read the token from header
			const auth = req.headers.authorization;
            if(!auth||!auth.startsWith('Bearer')){throw new ApiGateway.Errors.UnAuthorizedError('INVALID_TOKEN', 'Invalid token');}
            const accessToken = auth.split(' ')[1];
            let user;
            jwt.verify(accessToken,serviceConfig.gateway.jwt.access.secret,(err,decoded)=>{
                if(err){throw new ApiGateway.Errors.UnAuthorizedError('INVALID_TOKEN', 'Invalid token');}
                user = decoded;
            })
            return { user };
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 */
		authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
			// Get the authenticated user.
			const { user } = ctx.meta;

			// It check the `auth` property in action schema.
			if (req.$action.auth === "required" && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
			}
		},
	},
};

export default GatewayService;
