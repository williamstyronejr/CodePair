const http = require('http');
const io = require('socket.io-client');
const {
  setupSocket,
  closeSocket,
  emitMessageToRoom,
  emitMessageToUserId,
} = require('../socket');
const {
  setupRedis,
  closeRedis,
  getQueueSize,
  addUsersToPendingQueue,
  getPendingQueue,
} = require('../redis');
const { connectDatabase, disconnectDatabase } = require('../database');
const { createRandomString } = require('../../utils/utils');

const { DB_TEST_URI, IP, PORT } = process.env;

const server = http.createServer();
let redisClient;
let socket1; // Client socket to emulate a user
let socket2; // Client socket to emulate a user
let socket3; // Client socket used for attacking (breaking) system attempts
const socketUserId1 = 'user1';
const socketUserId2 = 'user2';
const attackUserId = 'user3'; // Id of user trying to force an action on system

// Set up fake server, redis, and socket.io, and mongoose
beforeAll((done) => {
  setupSocket(server);

  setupRedis().then((client) => {
    redisClient = client;

    connectDatabase(DB_TEST_URI).then(() => {
      server.listen(PORT, IP, () => {
        done();
      });
    });
  });
});

// Close connections
afterAll((done) => {
  closeSocket();
  closeRedis();
  disconnectDatabase().then(() => {
    server.close(done());
  });
});

// Connect client sockets to server
beforeEach((done) => {
  // Brackets need for IPv6
  socket1 = io.connect(`http://${IP}:${PORT}`, {
    transports: ['websocket'],
  });
  socket2 = io.connect(`http://${IP}:${PORT}`, {
    transports: ['websocket'],
  });

  // Connect sockets and emit message for logging user ids with sockets
  socket1.on('connect', () => {
    socket1.on('userLogged', () => {
      if (socket2.connected) done();
    });

    socket1.emit('logUser', socketUserId1);
  });

  socket2.on('connect', () => {
    socket2.on('userLogged', () => {
      if (socket1.connected) done();
    });

    socket2.emit('logUser', socketUserId2);
  });
});

// Disconnect all sockets and clear redis
afterEach((done) => {
  // Disconnect all client sockets
  redisClient.flushAll();
  if (socket1) socket1.disconnect();
  if (socket2) socket2.disconnect();
  if (socket3) socket3.disconnect();
  done();
});

describe('Connecting socket', () => {
  test('Successful conencted', () => {
    expect(socket1.connected).toBeTruthy();
    expect(socket2.connected).toBeTruthy();
  });
});

describe('Joining/Leaving queue through socket', () => {
  const queueId = 'queueId';
  const userId = 'user1';

  test('Successfully joining the queue should increase the queue size by 1', (done) => {
    socket1.emit('joinQueue', queueId, userId);

    // Allow time for socket to send message
    setTimeout(async () => {
      const count = await getQueueSize(queueId);
      expect(count).toBe(1);
      done();
    }, 300);
  });

  test('Successfully leaving the queue should decrease the queue size by 1', (done) => {
    socket2.emit('leaveQueue', queueId, userId);

    // Allow time for socket to send message
    setTimeout(async () => {
      const count = await getQueueSize(queueId);
      expect(count).toBe(0);
      done();
    }, 300);
  });
});

describe('Accepting/Declining pending queue', () => {
  let pendingQueue = createRandomString(8);
  let challengeId = createRandomString(8);

  beforeEach(async () => {
    pendingQueue = createRandomString(8);
    challengeId = createRandomString(8);

    await addUsersToPendingQueue(
      pendingQueue,
      [socketUserId1, socketUserId2],
      challengeId
    );
  }, 10000);

  test('Client not in pending queue attempting to accept should not change pending queue state', (done) => {
    socket3 = io.connect(`http://${IP}:${PORT}`, {
      transports: ['websocket'],
    });

    // Connect sockets and emit message for logging user ids with sockets
    socket3.on('connect', () => {
      socket3.on('userLogged', () => {
        // socket3.emit('logUser', attackUserId);
        // Attempting to accept pending queue that user is not in
        socket3.emit('acceptMatch', pendingQueue);

        setTimeout(async () => {
          const queue = await getPendingQueue(pendingQueue);

          expect(queue).not.toBe(null);
          expect(queue[attackUserId]).toBeUndefined();
          expect(queue[socketUserId1]).toBe('false');
          expect(queue[socketUserId2]).toBe('false');
          done();
        }, 200);
      });

      socket3.emit('logUser', attackUserId);
    });
  }, 10000);

  test('Accepting pending queue should set that client status to accepted', (done) => {
    socket1.emit('acceptMatch', pendingQueue);

    // Give time for socket to emit message
    setTimeout(async () => {
      const queue = await getPendingQueue(pendingQueue);

      expect(queue).not.toBe(null);
      expect(queue[socketUserId1]).toBe('true'); // Client marked as accepted
      expect(queue[socketUserId2]).toBe('false');

      done();
    }, 100);
  });

  test('All clients accepting queue should delete pending queue, creates room, and emits to clients', (done) => {
    socket1.on('roomCreated', async (roomId) => {
      const queue = await getPendingQueue(pendingQueue);

      expect(Object.keys(queue).length).toBe(0); // Queue no longer exists
      expect(roomId).toBeDefined(); // Room id was provided
      done();
    });

    socket1.emit('acceptMatch', pendingQueue);
    socket2.emit('acceptMatch', pendingQueue);
  }, 10000);
});

describe('Joining and leaving room', () => {
  const pendingQueue = createRandomString(8);
  const challengeId = createRandomString(9);
  let roomId;

  beforeEach((done) => {
    // Event handler for room creation
    socket1.on('roomCreated', (rId) => {
      roomId = rId;

      // Join room
      socket1.emit('joinRoom', roomId, socketUserId1);
      socket2.emit('joinRoom', roomId, socketUserId2);

      // Allow sockets to join room
      setTimeout(() => {
        done();
      }, 200);
    });

    // Add users to pending queue
    addUsersToPendingQueue(
      pendingQueue,
      [socketUserId1, socketUserId2],
      challengeId
    ).then(() => {
      // Users accept queue
      socket1.emit('acceptMatch', pendingQueue);
      socket2.emit('acceptMatch', pendingQueue);
    });
  }, 10000);

  test('Sending message to room should be received by both clients', (done) => {
    const event = 'event';
    const message = 'test';
    let messageCounter = 0;

    socket1.on(event, (msg) => {
      expect(msg).toBe(message);
      messageCounter += 1;
      if (messageCounter === 2) done();
    });

    socket2.on(event, (msg) => {
      expect(msg).toBe(message);
      messageCounter += 1;
      if (messageCounter === 2) done();
    });

    emitMessageToRoom(event, roomId, message);
  });

  test('Leaving the room should be seen by an event to other clients in the room', (done) => {
    socket2.on('leaveMessage', (msg) => {
      expect(msg).toBeDefined();
      expect(msg.includes(socketUserId1)).toBeTruthy();
      done();
    });

    socket1.emit('leaveRoom', roomId, socketUserId1);
  });
});

describe('Sending message in room', () => {
  const pendingQueue = createRandomString(8);
  const challengeId = createRandomString(8);
  let roomId;

  beforeEach((done) => {
    // Event handler for room creation
    socket1.on('roomCreated', (rId) => {
      roomId = rId;

      // Emit event to add users to room
      socket1.emit('joinRoom', roomId, socketUserId1);
      socket2.emit('joinRoom', roomId, socketUserId2);

      // Allow time for sockets to join room
      setTimeout(() => {
        done();
      }, 500);
    });

    // Add users to pending queue
    addUsersToPendingQueue(
      pendingQueue,
      [socketUserId1, socketUserId2],
      challengeId
    ).then(() => {
      // Users accept queue
      socket1.emit('acceptMatch', pendingQueue);
      socket2.emit('acceptMatch', pendingQueue);
    });
  });

  test('Client sending message to room should be received by other client in the room', (done) => {
    const message = 'test';
    const timestamp = Date.now();

    socket2.on('receiveMessage', (msg, time) => {
      expect(msg).toBe(message);
      expect(time).toBe(time);

      done();
    });

    socket1.emit('sendMessage', roomId, message, timestamp);
  });

  test('Client sending code to room should be received by other clients in the room', (done) => {
    const codeSent = 'this is code to be sent';

    socket2.on('receiveCode', (codeReceived) => {
      expect(codeSent).toBe(codeReceived);
      done();
    });

    socket1.emit('sendCode', roomId, codeSent);
  });
});

describe('Emitting messages', () => {
  test('Emitting message to user should fire event', (done) => {
    const message = 'Message being sent';
    const event = 'test';

    socket2.on(event, (msg) => {
      expect(msg).toBe(message);
      done();
    });

    emitMessageToUserId(event, socketUserId2, message);
  });

  test('Emitting multi-argument messages to user should fire event with all agruments received', (done) => {
    const arg1 = 123;
    const arg2 = 'testing';
    const event = 'event';

    socket2.on(event, (d1, d2) => {
      expect(d1).toBe(arg1);
      expect(d2).toBe(arg2);

      done();
    });

    emitMessageToUserId(event, socketUserId2, arg1, arg2);
  }, 15000);

  test('Emitting a message to a room should fire event to user in the room', (done) => {
    const message = 'Message to be sent';
    const roomId = 'roomId';
    const event = 'test';
    const username = 'username';

    // Join room
    socket1.emit('joinRoom', roomId, username);

    socket1.on(event, (msg) => {
      expect(msg).toBe(message);
      done();
    });

    // Give time for socket to handshake
    setTimeout(() => {
      emitMessageToRoom(event, roomId, message);
    }, 100);
  });

  test('Emitting multi-arguments messages to room should fire event with all arguments', (done) => {
    const arg1 = 123;
    const arg2 = 'test';
    const roomId = 'roomId';
    const event = 'test';
    const username = 'username';

    // Join room
    socket1.emit('joinRoom', roomId, username);

    socket1.on(event, (d1, d2) => {
      expect(arg1).toBe(d1);
      expect(arg2).toBe(d2);
      done();
    });

    // Give time for socket to handshake
    setTimeout(() => {
      emitMessageToRoom(event, roomId, arg1, arg2);
    }, 100);
  });
});
