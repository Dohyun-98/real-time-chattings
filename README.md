# real-time-chatting

### websocket 란?

- 양방향 소통을 위한 프로토콜
- 서버와 클라이언트 간에 connection을 유지하여 실시간 양방향 소통이 가능하도록 하는 기술
- header가 상당히 작아 overhead가 적은 특징이 있다.

## socket io 란

- 브라우저 와 서버간의 런타임 양방향 및 이벤트 기반 통신을 가능하게 하는 웹소켓을 활용하는 라이브러리
- 소켓 연결 실패시, fallback을 통해 다른 방식으로 해당 클라이언트와 연결을 시도
- 방 개념을 이용해 일부 클라이언트에게만 브로드 캐스팅이 가능하다.
- 네임 스페이스 개념이 존재하며 이를 이용해 socket을 분리할 수 있다.

### 이벤트

서버측 소켓객체의 예약 이벤트

- connect
- message
- disconnect
- reconnect
- ping
- join
- leave

클라이언트측 소켓객체의 예약 이벤트

- connect
- connect_err
- connect_timeout
- reconnect

이벤트 **예제**

```tsx
io.on('connection',(socket) => {
	// 클라이언트가 socket으로 접속시, 이벤트 발생
	console.log(`${socket.id} user is connected`)
	// 클라이언트의 hello 이벤트를 호출
	socket.emit('hello',socket.id);
})
```

### 방

- Room은 namespace안에 존재하는 소켓들을 room으로 쪼개어 나눈 것 이다.
- 이를 이용해 room에 join 되어 있는 클라이언트 끼리의 데이터 송수신이 가능하다.
- socket.join(), socket.leave() 메서드를 이용하여 입장, 퇴장을 한다.
- [socket.to](http://socket.to)() 메서드를 시용하여 특정 room에 이벤트를 emit 할 수 있다.

### 예제 코드

- 채팅 서버를 클라우드 환경에서 구현하기 위한 서버 코드
- 메시지 브로커는 RabbitMQ를 사용하여 구현하였다.
- [socket.io](http://socket.io) 접속시, middleware를 거쳐 인증을 하게 된다.

**시스템 구성도**
![](https://velog.velcdn.com/images/ehgusrlaeh/post/111e2538-b265-4757-b057-45920feea2f7/image.png)

**전체 코드**

```tsx
const server = http.createServer();
	this.io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
		},
	});
	server.listen(serviceConfig.io.socket.port, () => {
		this.logger.info(`Socket server listening on port ${serviceConfig.io.socket.port}`);
	});
	this.logger.info("IO service started");
	this.io.of("chat").use((socket: Socket, next) => {
		const accessToken = socket.handshake.query.token as string;
		jwt.verify(String(accessToken), serviceConfig.gateway.jwt.access.secret, (err, decoded) => {
			if (err) {
				next(new Error("Authentication error"));
			}
			// eslint-disable-next-line no-param-reassign
			socket.data.user = decoded;
			next();
		});
	});
	this.io.of("/chat").on("connection", async (socket: Socket) => {
		// 같은 pod 내에서는 socket.id가 고유하지만 다른 pod에서는 같은 값이 나올 수 있음
		// 고유한 값으로 socket.id를 저장할 필요는! 없지... 왜 why 검사하면 나오니깐..
		// access token으로 유저 정보 조회
		// redis에 socket.id 저장
		await this.redis.set(socket.data.user.id, socket.id);
		socket.on("disconnect", async () => {
			await this.redis.del(socket.data.user.id);
			this.logger.info(`Socket disconnected: ${socket.id}`);
		});
		// 방 참가
		socket.on("joinRoom", async (roomId: string) => {
			// db에서 방 정보 조회 후 방에 참가
			const isInvited = await this.broker.call(
				`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.isInvited.name}`,
				{
					userId: socket.data.user.id,
					roomId,
				},
			);
			if (isInvited) {
				// console.log(`${socket.data.user.id} is invited to ${roomId}`);
				await socket.join(roomId);
				this.logger.info(`Socket ${socket.id} joined room ${roomId}`);
			} else {
				socket.emit("error", "You are not invited to this room");
			}
		});
		// 방 생성
		socket.on("createRoom", async (roomName: string, participants: string[]) => {
			const participantsWithMe = [...participants, socket.data.user.id];
			try {
				const room: Room = await this.broker.call(
					`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.createChatRoom.name}`,
					{
						roomName,
						participants: participantsWithMe,
					},
				);
				await socket.join(room._id);
				// 초대 로직
				// event를 이용해서 다른 socket에게 초대 메시지 전달
				// 나를 제외한
				await this.broker.broadcast(serviceConfig.io.events.inviteRoom.name, {
					roomId: room._id,
					participants,
				});
				// Rabbit room_id queue 생성
				const exchangeName = "chat";
				const exchangeType = "topic";
				const rabbitmq = await amqp
					.connect({
						hostname: serviceConfig.io.rabbitmq.host,
						port: serviceConfig.io.rabbitmq.port,
						username: serviceConfig.io.rabbitmq.username,
						password: serviceConfig.io.rabbitmq.password,
					})
					.then((conn) => conn.createChannel());
				await rabbitmq.assertExchange(exchangeName, exchangeType, { durable: true });
				await rabbitmq
					.assertQueue(room._id)
					.then((q) => rabbitmq.bindQueue(q.queue, exchangeName, room._id));
				await rabbitmq.consume(room._id, (msg) => {
					if (msg !== null) {
						const { userId, name, message } = JSON.parse(msg.content.toString());
						this.io
							.of("/chat")
							.to(room._id)
							.emit("chattingMessage", { userId, name, message }, {});
						rabbitmq.ack(msg);
					}
				});
			} catch (error) {
                this.logger.error(`Socket ${socket.id} failed to create room ${roomName}`);
				socket.emit("error", error);
			}
		});
		// 초대 이벤트 발생시,
		// redis를 조회하여 socket.id를 조회한 후 해당 socket에게 초대 메시지 전달

		// 방 나가기
		socket.on("leaveRoom", async (roomId: string) => {
			// 방에 남은 사람이 없으면 방 삭제
			const { user } = socket.data;
			if (this.io.of("/chat").adapter.rooms.get(roomId)?.size === 0) {
				// 방 삭제 이벤트 발생
				await this.broker.call(
					`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.deleteChatRoom.name}`,
					{
						roomId,
					},
				);
			} else {
				// 방에 남은 사람이 존재하면, 방 정보에서 나간 사람 삭제 및 방 알림 이벤트 발생
				await this.broker.call(
					`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.leaveRoom.name}`,
					{
						roomId,
						userId: user.id,
					},
				);
			}
			await socket.leave(roomId);
			this.logger.info(`Socket ${socket.id} left room ${roomId}`);
		});
		// 채팅 메시지 보내기
		// RabbitMQ PuB
		socket.on("sendMessage", async (content: ChatMessage) => {
			// chat 서비스에 채팅 내역 저장 (chatRoomId, userId,name, message)
			try {
				const { roomId, message } = content;
				const { user } = socket.data;
                // roomId 유효성 검사
                const isInvitedRoom = await this.broker.call(
                    `${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.isInvited.name}`,
                    {
                        userId: socket.data.user.id,
                        roomId,
                    },
                );
                if (!isInvitedRoom) {
                    socket.emit("error", "You are not invited to this room or room is not exist");
                    return;
                }
				// RabbitMQ Publish
				await this.broker.call(
					`${serviceConfig.chat.serviceName}.${serviceConfig.chat.actions.createChat.name}`,
					{ roomId, userId: user.id, userName: user.name, message },
				);
			
				const exchangeName = "chat";
				const exchangeType = "topic";
				const rabbitmq = await amqp
					.connect({
						hostname: serviceConfig.io.rabbitmq.host,
						port: serviceConfig.io.rabbitmq.port,
						username: serviceConfig.io.rabbitmq.username,
						password: serviceConfig.io.rabbitmq.password,
					})
					.then((conn) => conn.createChannel());
				await rabbitmq.assertExchange(exchangeName, exchangeType, { durable: true });
				await rabbitmq
					.assertQueue(roomId)
					.then((q) => rabbitmq.bindQueue(q.queue, exchangeName, roomId));
				rabbitmq.publish(
					exchangeName,
					roomId,
					Buffer.from(
						JSON.stringify({
							userId: user.id,
							name: user.name,
							message,
						}),

                        
					),
				);
				await rabbitmq.close();
			} catch (error) {
				this.logger.error(error);
				socket.emit("error", error);
			}
		});
	});
```

**서버 listen**

```tsx
const server = http.createServer();
	this.io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
		},
	});
	server.listen(3000, () => {
		this.logger.info(`Socket server listening on port ${serviceConfig.io.socket.port}`);
	});
```

- 서버를 생성하여 3000번 포트로 listen하는 코드이다.
- cors 설정을 추가하였다.

인증 미들웨어

```tsx
this.io.of("chat").use((socket: Socket, next) => {
		const accessToken = socket.handshake.query.token as string;
		jwt.verify(String(accessToken), serviceConfig.gateway.jwt.access.secret, (err, decoded) => {
			if (err) {
				next(new Error("Authentication error"));
			}
			// eslint-disable-next-line no-param-reassign
			socket.data.user = decoded;
			next();
		});
	});
```

- of 메서드는 특정 namespace를 가리키는 메서드이다.
- 위 코드에서는 chat 이라는 namespace에 접속을 할때 거쳐가는 midleware를 작성한 것이다.
- 접속시, 클라이언트에게서 전달된 JWT 토큰이 유효한지 확인한다.

**접속 이벤트**

```tsx
this.io.of("/chat").on("connection", async (socket: Socket) => {
		await this.redis.set(socket.data.user.id, socket.id);
		socket.on("disconnect", async () => {
			await this.redis.del(socket.data.user.id);
			this.logger.info(`Socket disconnected: ${socket.id}`);
		});
...  여러 이벤트 
}
```

- 유효한 [socket.id](http://socket.id)를 저장하기 위해 redis에 key,value로 값을 저장한다,  쿠버네티스 환경에서 Deployment로 서버를 생성할 경우 여러 서버가 생기는데, socket.id를동기화하기 위해 저장하였다.

**방 참가 이벤트**

```tsx
socket.on("joinRoom", async (roomId: string) => {
			// db에서 방 정보 조회 후 방에 참가
			const isInvitedUser = await this.broker.call(
				`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.isInvited.name}`,
				{
					userId: socket.data.user.id,
					roomId,
				},
			);
			if (isInvitedUser) {
				// console.log(`${socket.data.user.id} is invited to ${roomId}`);
				await socket.join(roomId);
				this.logger.info(`Socket ${socket.id} joined room ${roomId}`);
			} else {
				socket.emit("error", "You are not invited to this room");
			}
		});
```

- isInvitedUser 변수는 데이터베이스에서 해당 방이 유효한 방인지 확인 후 값을 가져온다.
- 만약 해당 방이 유효하지 않거나, 초대되지 않은 유저라면 에러 이벤트를 호출하고 그렇지 않다면 해당 방에 socket.id를 join 한다.

방 생성 및 rabbitmq 메시지 sub

```tsx
socket.on("createRoom", async (roomName: string, participants: string[]) => {
			const participantsWithMe = [...participants, socket.data.user.id];
			try {
				// 데이터베이스에 해당 방을 생성
				const room: Room = await this.broker.call(
					`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.createChatRoom.name}`,
					{
						roomName,
						participants: participantsWithMe,
					},
				);
				await socket.join(room._id);
				// 초대 로직
				// event를 이용해서 다른 socket에게 초대 메시지 전달
				// 나를 제외한
				await this.broker.broadcast(serviceConfig.io.events.inviteRoom.name, {
					roomId: room._id,
					participants,
				});
				// Rabbit room_id queue 생성
				const exchangeName = "chat";
				const exchangeType = "topic";
				const rabbitmq = await amqp
					.connect({
						hostname: serviceConfig.io.rabbitmq.host,
						port: serviceConfig.io.rabbitmq.port,
						username: serviceConfig.io.rabbitmq.username,
						password: serviceConfig.io.rabbitmq.password,
					})
					.then((conn) => conn.createChannel());
				await rabbitmq.assertExchange(exchangeName, exchangeType, { durable: true });
				await rabbitmq
					.assertQueue(room._id)
					.then((q) => rabbitmq.bindQueue(q.queue, exchangeName, room._id));
				await rabbitmq.consume(room._id, (msg) => {
					if (msg !== null) {
						const { userId, name, message } = JSON.parse(msg.content.toString());
						this.io
							.of("/chat")
							.to(room._id)
							.emit("chattingMessage", { userId, name, message }, {});
						rabbitmq.ack(msg);
					}
				});
			} catch (error) {
                this.logger.error(`Socket ${socket.id} failed to create room ${roomName}`);
				socket.emit("error", error);
			}
		});
```

- 데이터베이스에 방을 생성한 후 방 생성요청을 한 socket을 join 시킨다.
- 프레임워크 내부적으로 모든 socket서버에서 방생성시, 해당하는 인원에 대한 socket.id를 확인 후 방에 초대를 보내는 이벤트를생성시켜 놓고, 해당 이벤트를 호출한다.
- 그 후 rabbitmq의 방에 해당하는 queue를 subscribe한다.
- subscribe중 메시지가 발견되면 해당 메시지를 해당 방에 broadcast한다.

**방 나가기**

```tsx
socket.on("leaveRoom", async (roomId: string) => {
			// 방에 남은 사람이 없으면 방 삭제
			const { user } = socket.data;
			if (this.io.of("/chat").adapter.rooms.get(roomId)?.size === 1) {
				// 방 삭제 이벤트 발생
				await this.broker.call(
					`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.deleteChatRoom.name}`,
					{
						roomId,
					},
				);
			} else {
				// 방에 남은 사람이 존재하면, 방 정보에서 나간 사람 삭제 및 방 알림 이벤트 발생
				await this.broker.call(
					`${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.leaveRoom.name}`,
					{
						roomId,
						userId: user.id,
					},
				);
			}
			await socket.leave(roomId);
			this.logger.info(`Socket ${socket.id} left room ${roomId}`);
		});
```

- 방 나가기 이벤트가 수신될 경우,  해당 방의 크기를 조회 후 1명이라면 그 해당하는 방인원이 본인지 조회 후 방을 삭제하는 메서드를 불러온다.
- 방 크기가 1이 아니라면, 데이터베이스의 방정보에서 user정보를 제거 후 방을 나간다.

**메시지 송신**

```tsx
socket.on("sendMessage", async (content: ChatMessage) => {
			// chat 서비스에 채팅 내역 저장 (chatRoomId, userId,name, message)
			try {
				const { roomId, message } = content;
				const { user } = socket.data;
                // roomId 유효성 검사
                const isInvitedRoom = await this.broker.call(
                    `${serviceConfig.chatRoom.serviceName}.${serviceConfig.chatRoom.actions.isInvited.name}`,
                    {
                        userId: socket.data.user.id,
                        roomId,
                    },
                );
                if (!isInvitedRoom) {
                    socket.emit("error", "You are not invited to this room or room is not exist");
                    return;
                }
				// RabbitMQ Publish
				await this.broker.call(
					`${serviceConfig.chat.serviceName}.${serviceConfig.chat.actions.createChat.name}`,
					{ roomId, userId: user.id, userName: user.name, message },
				);
			
				const exchangeName = "chat";
				const exchangeType = "topic";
				const rabbitmq = await amqp
					.connect({
						hostname: serviceConfig.io.rabbitmq.host,
						port: serviceConfig.io.rabbitmq.port,
						username: serviceConfig.io.rabbitmq.username,
						password: serviceConfig.io.rabbitmq.password,
					})
					.then((conn) => conn.createChannel());
				await rabbitmq.assertExchange(exchangeName, exchangeType, { durable: true });
				await rabbitmq
					.assertQueue(roomId)
					.then((q) => rabbitmq.bindQueue(q.queue, exchangeName, roomId));
				rabbitmq.publish(
					exchangeName,
					roomId,
					Buffer.from(
						JSON.stringify({
							userId: user.id,
							name: user.name,
							message,
						}),
					),
				);
				await rabbitmq.close();
			} catch (error) {
				this.logger.error(error);
				socket.emit("error", error);
			}
		});
```

- roomID에 대한 검증 로직을 수행 후 해당 유저가 방에 존재하는 지 다시 한번 검증하는 로직을 수행한다.
- 모든 유효성 검사가 끝난다면, 데이터베이스에 메시지를 저장 후 rabbmq에서 방에 해당하는 routekey로 publish를 하게 된다.

### 쿠버네티스에서의 문제점

- 쿠버네티스의 컨테이너 환경으로 [socket.io](http://socket.io) 시스템 구축시,  각 파드의  ip:port가 같기 때문에 포드에 다발적으로 접속하게 되어 서비스가 돌아가지 않는다.
- 폴링 방식으로 접속하게 되어, 이러한 문제가 나타난다.

폴링 방식이란?

- 실시간 웹을 위한 기법
- 일정한 주기를 가지고 서버와 응답을 주고 받는 형식
- `폴링이란 하나의 장치가 충돌 회피 또는 동기화 처리 등을 목적으로 다른 장치의 상태를 주기적으로 검사하여 일정한 조건을 만족할 때 송수신 등의 자료처리를 하는 방식`
- Loop 문 내에서 반복적을 외부 입력을 감시하는 문법으로 구현
- 즉 IP:PORT로 지속적으로 통신을 하는 것을 의미

### 해결방법

- 서버에 [socket.io](http://socket.io) 접속을 websocket으로 고정시켜놓는다.
