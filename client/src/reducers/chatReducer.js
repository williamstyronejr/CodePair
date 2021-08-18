import {
  JOIN_MESSAGE,
  LEAVE_MESSAGE,
  ADD_MESSAGE,
  SEND_MESSAGE,
  SET_MESSAGE,
  TOGGLE_CHAT_VISIBILITY,
  RESET_CHAT_DATA,
  SET_INITIAL_MESSAGES,
  USER_TYPE_START,
  USER_TYPE_END,
} from '../actions/chat';

const initState = {
  messages: [],
  chatInput: '',
  visible: false,
  usersTyping: [],
};

/**
 * Creates an object to represent a chat message.
 * Message in format: { author, text, time }
 * @param {String} author Id of user sending the message
 * @param {String} content Message content
 * @param {Number} time Timestamp of when message was sent
 * @return {Object} Returns the message object
 */
function createMessage(author, content, time) {
  return {
    author,
    content,
    time,
  };
}

/**
 * Creates a new array with 'item' inserted appended.
 * @param {Array} array Array to copy.
 * @param {*} item Item to be inserted into array.
 * @returns {Array} Returns a new array with item inserted.
 */
function insertItem(array, item) {
  return [...array, item];
}

const ChatReducer = (state = initState, action) => {
  switch (action.type) {
    case JOIN_MESSAGE:
      return {
        ...state,
        messages: insertItem(
          state.messages,
          createMessage(
            'notification',
            `${action.payload} has joined.`,
            Date.now()
          )
        ),
      };

    case LEAVE_MESSAGE:
      return {
        ...state,
        messages: insertItem(
          state.messages,
          createMessage(
            'notification',
            `${action.payload} has left.`,
            Date.now()
          )
        ),
      };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: insertItem(
          state.messages,
          createMessage(
            action.payload.author,
            action.payload.msg,
            action.payload.time
          )
        ),
      };

    case SET_MESSAGE: // Set message in chat input
      return {
        ...state,
        messages: [...state.messages],
        chatInput: action.payload,
      };

    case SEND_MESSAGE: // Store sent messages locally
      return {
        ...state,
        messages: insertItem(
          state.messages,
          createMessage(action.payload.userId, action.payload.msg, Date.now())
        ),
        chatInput: '',
      };

    case TOGGLE_CHAT_VISIBILITY:
      return {
        ...state,
        visible: !state.visible,
      };

    case SET_INITIAL_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };

    case USER_TYPE_START:
      return {
        ...state,
        usersTyping: [...state.usersTyping, action.payload],
      };

    case USER_TYPE_END:
      return {
        ...state,
        usersTyping: state.usersTyping.filter((val) => val !== action.payload),
      };

    case RESET_CHAT_DATA:
      return initState;

    default:
      return state;
  }
};

export default ChatReducer;
