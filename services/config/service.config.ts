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
                rest : "POST /new",
            },
            get: {
                name : 'getUser',
                rest : "GET /me",
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
            },
            findByIds: {
                name: 'findByIds',
            },
        },
        database:{
            mongo : {
                collection: String(process.env.MONGO_COLLECTION),
                uri: String(process.env.MONGO_URI),
            }
        },
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
        },
        redis:{
            host: String(process.env.REDIS_HOST),
            port: Number(process.env.REDIS_PORT),
        },
        events:{
            inviteRoom: {
                name: 'inviteRoom',
            }
        },
        rabbitmq:{
            host: String(process.env.RABBITMQ_HOST),
            port: Number(process.env.RABBITMQ_PORT),
            username: String(process.env.RABBITMQ_USERNAME),
            password: String(process.env.RABBITMQ_PASSWORD),
        }
    },
    paramsValidator: {
        // user id
        id : { type: "string", min: 20, max: 30, pattern:  /^[a-zA-Z0-9]{20,30}$/i, },
        ids : { type: "array", items: "string", min: 1, max: 20, },
        email : { type: "email", },
        password : { type: "string", min: 6, max: 20, pattern: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,20}$/,},
        name : { type: "string", min: 1, max: 20, pattern: /^[a-zA-Z0-9가-힣]{1,20}$/i, },
        participants : { type: "array", items: "string", min: 1, max: 20, },
        roomName : { type: "string", min: 1, max: 20, pattern: /^[a-zA-Z0-9가-힣]{1,20}$/i, },
        message: { type: "string", min: 1, max: 80, pattern: /^[a-zA-Z0-9가-힣]{1,100}$/i, },
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
        },
         database:{
            mongo : {
                collection: String(process.env.MONGO_COLLECTION),
                uri: String(process.env.MONGO_URI),
            }
        }
    },
    chatRoom:{
        serviceName: "chatRoom",
        actions:{
            getChatRoomList: {
                name : 'getChatRoomList',
                rest : "GET /",
            },
            getChatRoom: {
                name : 'getChatRoom',
                rest : "GET /:id",
            },
            createChatRoom: {
                name : 'createChatRoom',
                rest : "POST /new",
            },
            updateChatRoom: {
                name : 'updateChatRoom',
                rest : "PUT /:id",
            },
            deleteChatRoom: {
                name : 'deleteChatRoom',
            },
            isInvited: {
                name : 'isInvited',
            },
            leaveRoom : {
                name : 'leaveRoom',
            }
        },
        database:{
            mongo : {
                collection: String(process.env.MONGO_COLLECTION),
                uri: String(process.env.MONGO_URI),
            },
        },
    }
}

export default serviceConfig;