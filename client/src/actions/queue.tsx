// Action types
export const ADD_USER_TO_QUEUE = "join_queue";
export const LEAVE_QUEUE = "leave_queue";
export const ACCEPT_QUEUE = "accept_match";
export const DECLINE_MATCH = "decline_match";
export const MATCH_FOUND = "match_found";
export const MATCH_TIMEOUT = "match_timeout";
export const MATCH_CREATED = "match_created";
export const ROOM_CREATED = "room_created";
export const CLEAR_QUEUE = "clear_queue";

/**
 * Redux action creator for adding current user to a challenge queue of a
 *  specific size.
 * @param {String} cId Id of challenge the user is trying to complete
 * @param {Number} size Max number of users to match with
 * @return {Object} Returns a redux action object.
 */
export function joinQueue(cId: string, size = 2) {
  return {
    type: ADD_USER_TO_QUEUE,
    payload: {
      cId,
      size,
    },
  };
}

/**
 * Redux action creator for handling user leaving queue.
 * @param {String} queueId Id of queue the user is leaving
 * @return {Object} Returns a redux action object.
 */
export function leaveQueue(queueId: string) {
  return {
    type: LEAVE_QUEUE,
    payload: queueId,
  };
}

/**
 * Redux action creator for when a match is found for a user.
 * @param {String} queueId Id of queue
 * @return {Object} Returns a redux action object.
 */
export function matchFound(queueId: string) {
  return {
    type: MATCH_FOUND,
    payload: queueId,
  };
}

/**
 * Redux action creator for timing out a match. Used when a user did not,
 *  accept or decline match before given time.
 * @return {Object} Returns a redux action object.
 */
export function matchTimeout() {
  return {
    type: MATCH_TIMEOUT,
  };
}

/**
 * Redux action creator for accepting a match.
 * @param {String} queueId Id of queue the user is accepting.
 * @return {Object} Returns a redux action object.
 */
export function acceptMatch(queueId: string) {
  return {
    type: ACCEPT_QUEUE,
    payload: queueId,
  };
}

/**
 * Redux action creator for declining a match.
 * @param {String} queueId Id of queue the user is declining.
 * @return {Object} Returns a redux action object.
 */
export function declineMatch(queueId: string) {
  return {
    type: DECLINE_MATCH,
    payload: queueId,
  };
}

/**
 * Redux action creator for when a room is created.
 * @param {String} roomId Id of room that was created
 * @return {Object} Returns a redux action object.
 */
export function roomCreated(roomId: string) {
  return {
    type: ROOM_CREATED,
    payload: roomId,
  };
}

/**
 * Redux action creator for resetting queue data and will clear timer
 *  if active.
 * @return {Object} Returns a redux action object.
 */
export function clearQueue() {
  return {
    type: CLEAR_QUEUE,
  };
}
