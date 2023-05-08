import io from "socket.io-client";
import {
  CODE_SAVED,
  SAVE_CODE,
  SET_CODE,
  TEST_CODE,
  TEST_FINISH,
  UPDATE_CODE,
} from "../actions/challenge";
import {
  SEND_MESSAGE,
  ADD_MESSAGE,
  JOIN_MESSAGE,
  LEAVE_MESSAGE,
  USER_TYPE_START,
  USER_TYPE_END,
  MESSAGE_INDICATOR,
} from "../actions/chat";
import {
  OPEN_SOCKET,
  CLOSE_SOCKET,
  JOIN_ROOM,
  LEAVE_ROOM,
  socketLogged,
  socketConnected,
  closeSocket,
} from "../actions/socket";
import {
  ADD_USER_TO_QUEUE,
  LEAVE_QUEUE,
  ACCEPT_QUEUE,
  roomCreated,
  matchFound,
} from "../actions/queue";

const socket = io("", { autoConnect: false });

export function socketMiddlware() {
  return (next: any) => (action: any) => {
    if (socket && socket.connected) {
      switch (action.type) {
        case CLOSE_SOCKET:
          socket.close();
          break;

        // Chat cases
        case JOIN_ROOM:
          socket.emit("joinRoom", action.payload.room, action.payload.username);
          break;

        case LEAVE_ROOM:
          socket.emit(
            "leaveRoom",
            action.payload.room,
            action.payload.username
          );
          break;

        case SEND_MESSAGE:
          socket.emit(
            "sendMessage",
            action.payload.room,
            action.payload.msg,
            Date.now(),
            action.payload.userId
          );
          return next(action);
        case MESSAGE_INDICATOR:
          socket.emit(
            action.payload.type,
            action.payload.roomId,
            action.payload.username
          );
          return next(action);

        // Challenge cases
        case SET_CODE:
          socket.emit("sendCode", action.payload.room, action.payload.code);
          return next(action);

        case SAVE_CODE:
          socket.emit("saveCode", action.payload.roomId, action.payload.code);
          return next(action);

        case TEST_CODE:
          socket.emit("testRequested", action.payload);
          return next(action);

        // Queue handlers
        case ADD_USER_TO_QUEUE:
          socket.emit("joinQueue", action.payload.cId, action.payload.size);
          return next(action);

        case LEAVE_QUEUE:
          socket.emit("leaveQueue", action.payload);
          return next(action);

        case ACCEPT_QUEUE:
          socket.emit("acceptMatch", action.payload);
          return next(action);

        default:
          return next(action);
      }
    }

    // Handle connecting the socket to server
    if (action.type === OPEN_SOCKET) {
      socket.open();
    }

    return next(action);
  };
}

export default (store: any) => {
  socket.on("connect", () => {
    // On connection, log user's socket with userId currently in store
    socket.emit("logUser", store.getState().user.id);
    store.dispatch(socketConnected());
  });

  // Reset socket state on disconnect
  socket.on("disconnect", () => {
    store.dispatch(closeSocket());
  });

  socket.on("userLogged", () => {
    store.dispatch(socketLogged());
  });

  // Handle event for when a match is found
  socket.on("matchFound", (queueId: string) => {
    store.dispatch(matchFound(queueId));
  });

  // Handles event for room being created
  socket.on("roomCreated", (roomId: string) => {
    store.dispatch(roomCreated(roomId));
  });

  // Handles message when a user joins a room
  socket.on("joinMessage", (username: string) => {
    store.dispatch({
      type: JOIN_MESSAGE,
      payload: username,
    });
  });

  // Handles when a user leave message
  socket.on("leaveMsg", (username: string) => {
    store.dispatch({
      type: LEAVE_MESSAGE,
      payload: username,
    });
  });

  // Handles when client socket receives a chat message from server
  socket.on("receiveMessage", (msg: string, time: string, author: string) => {
    store.dispatch({
      type: ADD_MESSAGE,
      payload: { msg, time, author },
    });
  });

  // Handling add user to typing list
  socket.on("chatTyping", (username: string) => {
    // Add user to typing list while avoiding duplicates
    if (!store.getState().chat.usersTyping.includes(username)) {
      store.dispatch({
        type: USER_TYPE_START,
        payload: username,
      });
    }
  });

  // Handles removing user frrom typing list
  socket.on("chatTypingFinish", (username: string) => {
    store.dispatch({
      type: USER_TYPE_END,
      payload: username,
    });
  });

  // Handles receiving code updates
  socket.on("receiveCode", (code: string) => {
    store.dispatch({
      type: UPDATE_CODE,
      payload: code,
    });
  });

  // Handles receiving flag that code was saved properly
  socket.on("codeSaved", () => {
    store.dispatch({
      type: CODE_SAVED,
    });
  });

  socket.on("testingCode", () => {
    store.dispatch({
      type: TEST_CODE,
    });
  });

  // Handle receiving updates on code test run
  socket.on("testCompleted", (results: any, success: boolean, errors: any) => {
    store.dispatch({
      type: TEST_FINISH,
      payload: {
        results,
        success,
        errors,
      },
    });
  });
};
