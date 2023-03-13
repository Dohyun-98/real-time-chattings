const serviceConfig =  {
    // Service name
    user : {
        serviceName: "users",
        path: {
            create: "POST /",
            get: "GET /",
            update: "PUT /",
            delete: "DELETE /",
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
            login: "POST /login",
            register: "POST /register",
            logout: "POST /logout",
            refresh: "POST /refresh",
        }
    }

}

export default serviceConfig;