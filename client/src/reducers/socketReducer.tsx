import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  connected: false, // Flag indicating socket connection is made
  connecting: false, // Flag indicating socket is connecting
  inRoom: false, // Flag indicating socket has joined a room (chat/challenge)
  ready: false, // Flag indicating socket is ready (has been logged)
  error: null, // Error that occurs during connection for socket
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    openSocket(state) {
      state.connecting = true;
    },
    closeSocket(state) {
      state = initialState;
    },
    socketReady(state) {
      state.ready = true;
    },
    joinRoom(state, action: PayloadAction<{ room: string; username: string }>) {
      state.inRoom = true;
    },
    leaveRoom(state) {
      state.inRoom = false;
    },
    socketConnected(state) {
      state.connected = true;
      state.connecting = false;
    },
  },
});

export const {
  openSocket,
  closeSocket,
  socketReady,
  joinRoom,
  leaveRoom,
  socketConnected,
} = socketSlice.actions;

export default socketSlice.reducer;
