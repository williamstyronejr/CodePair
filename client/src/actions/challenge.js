import { ajaxRequest } from '../utils/utils';
import { setInitialMessages } from './chat';

// Action types
export const SET_CHALLENGE_DATA = 'set_challenge_data';
export const SET_CHALLENGE_ERROR = 'set_challenge_error';
export const CLEAR_CHALLENGE_DATA = 'clear_challenge_data';
export const SET_CODE = 'set_code';
export const SAVE_CODE = 'save_code';
export const CODE_SAVED = 'code_saved';
export const ADD_INVITE_LINK = 'add_invite_link';
export const TEST_CODE = 'test_code';
export const TEST_FINISH = 'test_finish';
export const UPDATE_CODE = 'update_code';

/**
 * Redux action creator for setting challenge/room data.
 * @param {Object} data Challenge and room data
 * @returns {Object} Returns a redux action object.
 */
function setData(data) {
  return {
    type: SET_CHALLENGE_DATA,
    payload: data,
  };
}

/**
 * Redux action creator for setting error that occurred during data fetching of
 *  challenge/room data.
 * @param {String} error Error message
 * @return {Object} Returns a redux action object.
 */
function challengeError(error) {
  return {
    type: SET_CHALLENGE_ERROR,
    payload: error,
  };
}

/**
 * Redux action creator for saving code to server.
 * @param {String} roomId Id of room
 * @param {String} code Code to be saved
 * @returns {Object} Returns a redux action object.
 */
export function saveCode(roomId, code) {
  return {
    type: SAVE_CODE,
    payload: {
      roomId,
      code,
    },
  };
}

/**
 * Redux action creator for clearing challenge room data.
 * @returns {Object} Returns a redux action object.
 */
export function clearData() {
  return {
    type: CLEAR_CHALLENGE_DATA,
  };
}

/**
 * Redux action creator for setting code.
 * @param {String} room Id of room
 * @param {String} code Code to be set
 * @returns {Object} Returns a redux action object.
 */
export function setCode(room, code) {
  return {
    type: SET_CODE,
    payload: { room, code },
  };
}

/**
 * Redux action creator for setting the invite link.
 * @param {String} inviteLink Url to join room.
 * @returns {Object} Returns a redux action object
 */
export function addInvite(inviteLink) {
  return {
    type: ADD_INVITE_LINK,
    payload: inviteLink,
  };
}

/**
 * Redux action creator for setting challenge state to testing and resetting
 *  results and errors.
 * @returns {Object} Returns a redux action object.
 */
export function testingCode(roomId) {
  return {
    type: TEST_CODE,
    payload: roomId,
  };
}

/**
 * Sends a request to get data for a room and challenge and store it locally.
 *  If an error occurs, an error message is set.
 * @param {String} cId Id of challenge
 * @param {String} rId Id of room
 * @returns {Function} Returns a function to dispatch a redux action.
 */
export function getChallenge(cId, rId) {
  return (dispatch) => {
    ajaxRequest(`/challenge/${cId}/room/${rId}`)
      .then((res) => {
        dispatch(setData(res.data));
        if (res.data.room.messages.length > 0)
          dispatch(setInitialMessages(res.data.room.messages));
      })
      .catch((err) => {
        if (err.response && err.response.status === 404)
          return dispatch(challengeError('This room does not exist.'));

        dispatch(
          challengeError('An error occurred on the server, please try again.')
        );
      });
  };
}

/**
 * Sends a request to make a room public (joinable) and stores the results
 *  invite link.
 * @param {String} rId Id of room
 * @returns {Function} Returns a functino to dispatch a redux action object.
 */
export function convertRoomToPublic(rId) {
  return (dispatch) => {
    ajaxRequest(`/room/${rId}/public`, 'POST')
      .then((res) => {
        dispatch(addInvite(res.data.invite));
      })
      .catch((err) => {
        dispatch(challengeError(err.response.data));
      });
  };
}

/**
 * Sends a request for the code to be tested along with the current local
 *  parameters.
 * @param {String} cId Id of challenge
 * @param {String} rId Id of room
 * @param {String} code Code for the challenge
 * @param {String} language Programming language the challenge is in
 * @return {Function} Returns a function to dispatch a redux action.
 */
export function testCode(cId, rId, code, language) {
  return (dispatch) => {
    dispatch(testingCode(rId));
    ajaxRequest(`/challenge/${cId}/room/${rId}/test`, 'POST', {
      code,
      language,
    }).catch((err) => {
      dispatch(challengeError(err.response.data));
    });
  };
}
