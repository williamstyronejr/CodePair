import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  inQueue: false, // Flag indicating user is in queue
  leavingQueue: false, // Flag for when user leaves queue (timeout/decline/leave)
  matchFound: false, // Flag to indicate if a match was found
  acceptedMatch: false, // Flag indicating a user accepted the match
  declinedMatch: false, // Flag indicating a user declined the match
  matchId: null, // Id of match from queue
  roomId: null, // Id of room when/if one is created
  queueTimer: 0, // Timer for how long user is in queue
  matchTimer: 10, // Countdown timer for when a match is found
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    joinQueue(state, action: PayloadAction<{ cId: string; size: number }>) {
      state.inQueue = true;
      state.acceptedMatch = false;
      state.declinedMatch = false;
    },
    leaveQueue(state, action: PayloadAction<string>) {
      state.leavingQueue = true;
      state.inQueue = false;
    },
    matchFound(state, action: PayloadAction<string>) {
      state.matchFound = true;
      state.matchId = action.payload;
      state.acceptedMatch = false;
      state.declinedMatch = false;
      state.roomId = null;
    },
    matchTimeout(state) {
      state.inQueue = false;
      (state.leavingQueue = true), (state.matchFound = false);
      state.acceptedMatch = false;
      state.declinedMatch = false;
    },
    acceptQueue(state, action: PayloadAction<string>) {
      state.acceptedMatch = true;
      state.declinedMatch = false;
    },
    declineQueue(state, action: PayloadAction<string>) {
      state = {
        ...initialState,
        inQueue: false,
        leavingQueue: true,
        matchFound: false,
        acceptedMatch: false,
        declinedMatch: true,
        queueTimer: 0,
      };
    },
    roomCreated(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    clearQueue(state) {
      state = initialState;
    },
  },
});

export const {
  roomCreated,
  declineQueue,
  acceptQueue,
  matchTimeout,
  matchFound,
  leaveQueue,
  joinQueue,
  clearQueue,
} = queueSlice.actions;

export default queueSlice.reducer;
