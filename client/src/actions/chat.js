// Action types that involve socket actions
export const ADD_MESSAGE = 'add_message';
export const JOIN_MESSAGE = 'join_message';
export const LEAVE_MESSAGE = 'leave_message';

export const USER_TYPE_START = 'userTypeStart';
export const USER_TYPE_END = 'userTypeEnd';
export const MESSAGE_INDICATOR = 'messageIndicator';
export const SEND_MESSAGE = 'send_message';
export const SET_INITIAL_MESSAGES = 'setInitialMessages';
export const RESET_CHAT_DATA = 'resetChatData';
export const SET_MESSAGE = 'set_message';
export const TOGGLE_CHAT_VISIBILITY = 'chat_visibility';

/**
 * Redux action creator for setting chat's visibility.
 * @param {Boolean} visible Boolean indicating if chat is visible
 * @return {Object} Returns a redux action object.
 */
export function toggleChatVisibility() {
  return {
    type: TOGGLE_CHAT_VISIBILITY,
  };
}

/**
 * Redux action creator for adding a user's typing indicator.
 * @param {String} username Username of user typing
 * @returns {Object} Returns a redux action object.
 */
export function addUserTyping(username) {
  return {
    type: USER_TYPE_START,
    payload: username,
  };
}

/**
 * Redux action creator for removing a user's typing indicator.
 * @param {String} username Username of user who "finished" typing
 * @returns {Object} Returns a redux action object.
 */
export function removeUserTyping(username) {
  return {
    type: USER_TYPE_END,
    payload: username,
  };
}

/**
 * Redux action creator setting chat notification for typing events. This action
 *  is only handled by socket middleware.
 * @param {String} username Username of user sending indicator
 * @param {false} typing Flag indicating if user is typing
 * @returns {Object} Returns a redux action object.
 */
export function messageIndicator(roomId, username, typing = true) {
  return {
    type: MESSAGE_INDICATOR,
    payload: {
      type: typing ? 'userTyping' : 'userTypingEnd',
      username,
      roomId,
    },
  };
}

/**
 * Redux action creator for setting a chat message.
 * @param {String} text Message text
 * @returns {Object} Returns a redux action object.
 */
export function setMessage(text) {
  return {
    type: SET_MESSAGE,
    payload: text,
  };
}

/**
 * Redux action creator for a message being sent throguh the chat room.
 * @param {String} room Id of room
 * @param {String} msg Message to send
 * @param {String} userId Id of user sending message
 * @returns {Object} Returns a redux action object.
 */
export function sendMessage(room, msg, userId) {
  return {
    type: SEND_MESSAGE,
    payload: { room, msg, userId },
  };
}

/**
 * Redux action creator for resetting chat data to initial state.
 * @return {Object} Returns a redux action object.
 */
export function resetChatData() {
  return {
    type: RESET_CHAT_DATA,
  };
}

/**
 * Redux action creator for setting initial messages for a chat room.
 * @param {Array<Object>} messages Array of message objects.
 * @returns {Object} Returns a redux action object.
 */
export function setInitialMessages(messages) {
  return {
    type: SET_INITIAL_MESSAGES,
    payload: messages,
  };
}
