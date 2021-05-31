import {
  OPEN_SOCKET,
  CLOSE_SOCKET,
  SOCKET_CONNECTED,
  SOCKET_LOGGED,
  JOIN_ROOM,
  LEAVE_ROOM,
} from '../actions/socket';

const initState = {
  connected: false, // Flag indicating socket connection is made
  connecting: false, // Flag indicating socket is connecting
  inRoom: false, // Flag indicating socket has joined a room (chat/challenge)
  ready: false, // Flag indicating socket is ready (has been logged)
  error: null, // Error that occurs during connection for socket
};

const socketReducer = (state = initState, action) => {
  switch (action.type) {
    case OPEN_SOCKET:
      return {
        ...state,
        connecting: true,
      };

    case CLOSE_SOCKET:
      return initState;

    case SOCKET_CONNECTED:
      return {
        ...state,
        connected: true,
        connecting: false,
      };

    case SOCKET_LOGGED:
      return {
        ...state,
        ready: true,
      };

    case JOIN_ROOM:
      return {
        ...state,
        inRoom: true,
      };

    case LEAVE_ROOM:
      return {
        ...state,
        inRoom: false,
      };

    default:
      return state;
  }
};

export default socketReducer;
