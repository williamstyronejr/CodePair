import io from 'socket.io-client';
import {
  saveCode,
  savedCode,
  setCode,
  testCode,
  testFinish,
  testingCode,
  updateCode,
} from '../reducers/challengeReducer';
import {
  addMessage,
  joinMessage,
  leaveMessage,
  messageIndicator,
  sendMessage,
  userTypingEnd,
  userTypingStart,
} from '../reducers/chatReducer';
import {
  joinRoom,
  openSocket,
  closeSocket,
  socketConnected,
  socketReady,
  leaveRoom,
} from '../reducers/socketReducer';
import {
  acceptQueue,
  joinQueue,
  leaveQueue,
  matchFound,
  roomCreated,
} from '../reducers/queueReducer';
import { StoreType } from '../store/store.prod';

const socket = io('', { autoConnect: false });

export const setupSocketHandlers = (store: StoreType) => {
  socket.on('connect', () => {
    // On connection, log user's socket with userId currently in store
    socket.emit('logUser', store.getState().user.id);
    store.dispatch(socketConnected());
  });

  // Reset socket state on disconnect
  socket.on('disconnect', () => {
    store.dispatch(closeSocket());
  });

  socket.on('userLogged', () => {
    store.dispatch(socketReady());
  });

  // Handle event for when a match is found
  socket.on('matchFound', (queueId: string) => {
    store.dispatch(matchFound(queueId));
  });

  // Handles event for room being created
  socket.on('roomCreated', (roomId: string) => {
    store.dispatch(roomCreated(roomId));
  });

  // Handles message when a user joins a room
  socket.on('joinMessage', (username: string) => {
    store.dispatch(joinMessage(username));
  });

  // Handles when a user leave message
  socket.on('leaveMsg', (username: string) => {
    store.dispatch(leaveMessage(username));
  });

  // Handles when client socket receives a chat message from server
  socket.on('receiveMessage', (msg: string, time: string, author: string) => {
    store.dispatch(addMessage({ msg, time, author }));
  });

  // Handling add user to typing list
  socket.on('chatTyping', (username: string) => {
    // Add user to typing list while avoiding duplicates
    if (!store.getState().chat.usersTyping.includes(username)) {
      store.dispatch(userTypingStart({ username }));
    }
  });

  // Handles removing user frrom typing list
  socket.on('chatTypingFinish', (username: string) => {
    store.dispatch(userTypingEnd({ username }));
  });

  // Handles receiving code updates
  socket.on('receiveCode', (code: string) => {
    store.dispatch(updateCode(code));
  });

  // Handles receiving flag that code was saved properly
  socket.on('codeSaved', () => {
    store.dispatch(savedCode());
  });

  socket.on('testingCode', () => {
    store.dispatch(testingCode());
  });

  // Handle receiving updates on code test run
  socket.on('testCompleted', (results: any, success: boolean, errors: any) => {
    store.dispatch(testFinish({ success, errors, results }));
  });
};

export const socketMiddlware = (params) => (next) => (action) => {
  const { dispatch, getState } = params;

  if (socket && socket.connected) {
    switch (action.type) {
      case closeSocket.type:
        socket.close();
        break;

      // Chat cases
      case joinRoom.type:
        socket.emit('joinRoom', action.payload.room, action.payload.username);
        break;

      case leaveRoom.type:
        socket.emit('leaveRoom', action.payload.room, action.payload.username);
        break;

      case sendMessage.type:
        socket.emit(
          'sendMessage',
          action.payload.roomId,
          action.payload.msg,
          Date.now(),
          action.payload.userId
        );
        return next(action);

      case messageIndicator.type:
        socket.emit(
          action.payload.typing ? 'userTyping' : 'userTypingEnd',
          action.payload.roomId,
          action.payload.username
        );
        return next(action);

      // Challenge cases
      case setCode.type:
        socket.emit('sendCode', action.payload.room, action.payload.code);
        return next(action);

      case saveCode.type:
        socket.emit('saveCode', action.payload.roomId, action.payload.code);
        return next(action);

      case testCode.typePrefix:
        socket.emit('testRequested', action.payload);
        return next(action);

      // Queue handlers
      case joinQueue.type:
        socket.emit('joinQueue', action.payload.cId, action.payload.size);
        return next(action);

      case leaveQueue.type:
        socket.emit('leaveQueue', action.payload);
        return next(action);

      case acceptQueue.type:
        socket.emit('acceptMatch', action.payload);
        return next(action);

      default:
        return next(action);
    }
  }

  // Handle connecting the socket to server
  if (action.type === openSocket.type) {
    socket.connect;
    socket.connect();
  }

  return next(action);
};
