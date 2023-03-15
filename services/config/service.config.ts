const serviceConfig =  {
    gateway:{
        serviceName: "gateway",
        jwt:{
            access:{
                secret: String(process.env.JWT_ACCESS_SECRET),
                expire: String(process.env.JWT_ACCESS_EXPIRE),
            },
            refresh:{
                secret: String(process.env.JWT_REFRESH_SECRET),
                expire: String(process.env.JWT_REFRESH_EXPIRE),
            },
        }
    },
    user : {
        serviceName: "users",
        actions: {
            create: {
                name : 'createUser',
                rest : "POST /",
            },
            get: {
                name : 'getUser',
                rest : "GET /",
            },
            update: {
                name : 'updateUser',
                rest : "PUT /",
            },
            delete: {
                name : 'deleteUser',
                rest : "DELETE /",
            },
            findByEmail: {
                name : 'findByEmail',
            }
        },
        database:{
            mongo : {
                collection: String(process.env.MONGO_COLLECTION),
                uri: String(process.env.MONGO_URI),
            }
        }
    },
    auth : {
        serviceName: "auth",
        actions:{
            login: {
                name : 'login',
                rest : "POST /login",
            },
            register: {
                name : 'register',
                rest : "POST /register",
            },
            logout: {
                name : 'logout',
                rest : "POST /logout",
            },
            refresh: {
                name : 'refresh',
                rest : "POST /refresh",
            },
        },
        redis : {
            host: String(process.env.REDIS_HOST),
            port: Number(process.env.REDIS_PORT),
            // password: process.env.REDIS_PASSWORD,
        },
        jwt : {
            access:{
                secret: String(process.env.JWT_ACCESS_SECRET),
                expire: String(process.env.JWT_ACCESS_EXPIRE),
            },
            refresh:{
                secret: String(process.env.JWT_REFRESH_SECRET),
                expire: String(process.env.JWT_REFRESH_EXPIRE),
            },
        }
    },
    io:{
        serviceName: "io",
        socket:{
            port: Number(process.env.SOCKET_IO_PORT),
        }
    },
    paramsValidator: {
        id : { type: "string", min: 1, max: 24, pattern: /^[a-f\d]{24}$/i, },
        email : { type: "email", },
        password : { type: "string", min: 6, max: 20, pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,20}$/,},
        name : { type: "string", min: 1, max: 20, pattern: /^[a-zA-Z0-9가-힣]{1,20}$/i, },
    },
    chat:{
        serviceName: "chat",
        actions:{
            getChatList: {
                name : 'getChatList',
                rest : "GET /",
            },
            getChat: {
                name : 'getChat',
                rest : "GET /:id",
            },
            createChat: {
                name : 'createChat',
                rest : "POST /",
            },
            updateChat: {
                name : 'updateChat',
                rest : "PUT /:id",
            },
            deleteChat: {
                name : 'deleteChat',
                rest : "DELETE /:id",
            },
            createRoom: {
                name : 'createRoom',
                rest : "POST /room",
            },
            getRoom: {
                name : 'getRoom',
                rest : "GET /room/:id",
            },
            getRoomList: {
                name : 'getRoomList',
                rest : "GET /room",
            },
            updateRoom: {
                name : 'updateRoom',
                rest : "PUT /room/:id",
            },
            deleteRoom: {
                name : 'deleteRoom',
                rest : "DELETE /room/:id",
            },
        },
         database:{
            mongo : {
                collection: String(process.env.MONGO_COLLECTION),
                uri: String(process.env.MONGO_URI),
            }
        }
    }
}

export default serviceConfig;