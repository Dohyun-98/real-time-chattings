export const ServiceConfig =  {
    // Service name
    user : {
        path: {
            create: "POST /users",
            get: "GET /users",
            update: "PUT /users",
            delete: "DELETE /users",
            // patch: "PATCH /users",
        },
        database:{
            mongo : {
                collection: process.env.MONGO_COLLECTION,
                uri: process.env.MONGO_URI,
            }
        }
    },
    auth : {
        path:{
            login: "POST /auth/login",
            register: "POST /auth/register",
            logout: "POST /auth/logout",
            refresh: "POST /auth/refresh",
        }
    }

}