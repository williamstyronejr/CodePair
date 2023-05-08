import {
  ADD_USER_TO_QUEUE,
  LEAVE_QUEUE,
  MATCH_FOUND,
  MATCH_TIMEOUT,
  ACCEPT_QUEUE,
  DECLINE_MATCH,
  ROOM_CREATED,
  CLEAR_QUEUE,
} from "../actions/queue";

const initState = {
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

const queueReducer = (state = initState, action: any) => {
  switch (action.type) {
    case ADD_USER_TO_QUEUE:
      return {
        ...state,
        inQueue: true,
        acceptedMatch: false,
        declinedMatch: false,
      };

    case LEAVE_QUEUE:
      return {
        ...state,
        leavingQueue: true,
        inQueue: false,
      };

    case MATCH_FOUND:
      return {
        ...state,
        matchFound: true,
        matchId: action.payload,
        acceptedMatch: false,
        declinedMatch: false,
        roomId: null,
      };

    case MATCH_TIMEOUT:
      return {
        ...state,
        inQueue: false,
        leavingQueue: true,
        matchFound: false,
        acceptedMatch: false,
        declinedMatch: false,
      };

    case ACCEPT_QUEUE:
      return {
        ...state,
        acceptedMatch: true,
        declinedMatch: false,
      };

    case DECLINE_MATCH:
      return {
        ...initState,
        inQueue: false,
        leavingQueue: true,
        matchFound: false,
        acceptedMatch: false,
        declinedMatch: true,
        queueTimer: 0,
      };

    case ROOM_CREATED:
      return {
        ...state,
        roomId: action.payload,
      };

    case CLEAR_QUEUE:
      return initState;

    default:
      return state;
  }
};

export default queueReducer;
