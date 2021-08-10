const socket = require('socket.io');
const {
  addUserToQueue,
  removeUserFromQueue,
  removePendingQueue,
  markUserAsAccepted,
} = require('./redis');
const { createRoom, saveCodeById, addMessageById } = require('./room');

/**
 * TODO: Better implementation of sockerId <-> userId
 */
const socketClients = {}; // List of userIds by socketId
const userClients = {}; // List of socketId by userId
let io;

/**
 * Logs sockets with id of user and emits a message back to the client. Will
 *  emit error if user id is invalid.
 * @param {String} userId Id of user to keep track of their socket
 */
function logSocket(userId) {
  if (userId && typeof userId === 'string') {
    socketClients[this.id] = userId;
    userClients[userId] = this.id;
    return this.emit('userLogged');
  }

  return this.emit('userLogError'); // Emit error if invalid user id
}

/**
 * Deletes the users from stored logs.
 */
function disconnecting() {
  const userId = socketClients[this.id];
  delete socketClients[this.id];
  delete userClients[userId];
}

/**
 * Adds a socket to a room and emits a message to all sockets in room
 *  that the user has joined.
 * @param {String} roomId Id of room to join
 * @param {String} username Username to use in join message to the room
 */
function joinRoom(roomId, username) {
  this.join(roomId);
  this.in(roomId).emit('joinMessage', username);
}

/**
 * Removes a socket from a room and emits a message to all sockets in the room
 *  that the user has left.
 * @param {String} roomId Id of room to leave
 * @param {String} username Username to user in leave message
 */
function leaveRoom(roomId, username) {
  this.in(roomId).emit('leaveMessage', username);
  this.leave(roomId);
}

/**
 * Emits a message to all sockets in a room, except the sender, and saves the
 *  messages to the room.
 * @param {String} roomId Id of room to send message to
 * @param {String} msg Content of message
 * @param {String} time Time message was sent
 * @param {String} author Id of user sending message
 */
function sendMessage(roomId, msg, time, author) {
  // Make sure the client is in the room to send messages
  if (this.rooms.has(roomId)) {
    addMessageById(roomId, { content: msg, time, author });
    this.in(roomId).emit('receiveMessage', msg, time, author);
  }
}

/**
 * Emits a message sending code to the room. Only works if the socket making
 *  the request is in the room.
 * @param {String} roomId Id of room to send code to
 * @param {String} code Code to send
 */
function sendCode(roomId, code) {
  // Make sure the client is in the room to send the code
  if (this.rooms.has(roomId)) this.in(roomId).emit('receiveCode', code);
}

/**
 * Saves code to room if only if the user is in the room. On successful save,
 *  the "codeSaved" event is sent to the room.
 * @param {String} roomId Id of room
 * @param {String} code Code to be save
 */
function saveCode(roomId, code) {
  if (this.rooms.has(roomId))
    saveCodeById(roomId, socketClients[this.id], code).then((room) => {
      if (room) io.to(roomId).emit('codeSaved');
    });
}

/**
 * Adds a user to a challenge queue.
 * @param {String} queueId Id of queue to join queue for
 * @param {String} maxSize Max size of the room
 */
function joinQueue(queueId, maxSize = 2) {
  addUserToQueue(queueId, socketClients[this.id], maxSize);
}

/**
 * Removes user from queue.
 * @param {String} queueId Id of queue to leave
 */
function leaveQueue(queueId) {
  removeUserFromQueue(queueId, socketClients[this.id]);
}

/**
 * Creates a room for the queue and sends all users in the room a message with
 *  the room id.
 * @param {String} pendingQueueId Id of queue the room is for
 * @param {Array<Object>} users Array of user objects
 */
async function prepareRoom(pendingQueueId, users) {
  const room = await createRoom(pendingQueueId, users, 'node');

  // Send all users in room a message with room Id
  users.forEach((user) => {
    io.to(userClients[user]).emit('roomCreated', room.id);
  });
}

/**
 * Sets user as accepted in their pending queue. If all users have accepted,
 *  empty pending queue and prepare room for users.
 * @param {String} pendingQueueId Id of pending queue to accept
 */
async function acceptQueue(pendingQueueId) {
  const userId = socketClients[this.id];
  const users = await markUserAsAccepted(pendingQueueId, userId);

  // If all players ready, prepare room for users
  if (users && users.length > 0) {
    removePendingQueue(pendingQueueId);
    prepareRoom(pendingQueueId, users);
  }
}

/**
 * Emits to all users in room that a test is being ran.
 * @param {String} roomId Id of room being tested
 */
function testingCode(roomId) {
  if (this.rooms.has(roomId)) {
    this.in(roomId).emit('testingCode');
  }
}

/**
 * Initialize event handlers for sockets.
 * @param {Object} server HTTP Server to attach socket to
 */
exports.setupSocket = (server) => {
  io = socket(server);

  io.on('connection', (client) => {
    client.on('logUser', logSocket);
    client.on('disconnecting', disconnecting);

    // Handlers for Challenge and chat room
    client.on('joinRoom', joinRoom);
    client.on('leaveRoom', leaveRoom);
    client.on('sendMessage', sendMessage);
    client.on('sendCode', sendCode);
    client.on('saveCode', saveCode);
    client.on('testRequested', testingCode);

    // Handlers for Challenge Queue
    client.on('joinQueue', joinQueue);
    client.on('leaveQueue', leaveQueue);
    client.on('acceptMatch', acceptQueue);
  });
};

/**
 * Closes the socket.io server.
 */
exports.closeSocket = () => {
  return io.close();
};

/**
 * Emits a message to all clients in the provided room.
 * @param {String} event Type of event to emit message on
 * @param {String} roomId Id of room to send message to
 * @param {Array} args Arguments to emit
 */
exports.emitMessageToRoom = (event, roomId, ...args) => {
  if (io && roomId) io.to(roomId).emit(event, ...args);
};

/**
 * Emits a message to a user by searching
 * @param {String} event Type of event to emit message on
 * @param {String} userId Id of user to send message to
 * @param {Array} args Other arguments to send the users
 */
exports.emitMessageToUserId = (event, userId, ...args) => {
  if (io) {
    io.to(userClients[userId]).emit(event, ...args);
  }
};
