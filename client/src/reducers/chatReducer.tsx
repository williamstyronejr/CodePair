import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

type ChatMessage = {
  author: string;
  time: number;
  content: string;
};

const initState: {
  messages: ChatMessage[];
  chatInput: string;
  visible: boolean;
  usersTyping: string[];
} = {
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
function createMessage(
  author: string,
  content: string,
  time: number
): ChatMessage {
  return {
    author,
    content,
    time,
  };
}

// const ChatReducer = (state = initState, action: any) => {
//   switch (action.type) {
//     case JOIN_MESSAGE:
//       return {
//         ...state,
//         messages: insertItem(
//           state.messages,
//           createMessage(
//             'notification',
//             `${action.payload} has joined.`,
//             Date.now()
//           )
//         ),
//       };

//     case LEAVE_MESSAGE:
//       return {
//         ...state,
//         messages: insertItem(
//           state.messages,
//           createMessage(
//             'notification',
//             `${action.payload} has left.`,
//             Date.now()
//           )
//         ),
//       };

//     case ADD_MESSAGE:
//       return {
//         ...state,
//         messages: insertItem(
//           state.messages,
//           createMessage(
//             action.payload.author,
//             action.payload.msg,
//             action.payload.time
//           )
//         ),
//       };

//     case SET_MESSAGE: // Set message in chat input
//       return {
//         ...state,
//         messages: [...state.messages],
//         chatInput: action.payload,
//       };

//     case SEND_MESSAGE: // Store sent messages locally
//       return {
//         ...state,
//         messages: insertItem(
//           state.messages,
//           createMessage(action.payload.userId, action.payload.msg, Date.now())
//         ),
//         chatInput: '',
//       };

//     case TOGGLE_CHAT_VISIBILITY:
//       return {
//         ...state,
//         visible: !state.visible,
//       };

//     case SET_INITIAL_MESSAGES:
//       return {
//         ...state,
//         messages: action.payload,
//       };

//     case USER_TYPE_START:
//       return {
//         ...state,
//         usersTyping: [...state.usersTyping, action.payload],
//       };

//     case USER_TYPE_END:
//       return {
//         ...state,
//         usersTyping: state.usersTyping.filter((val) => val !== action.payload),
//       };

//     case RESET_CHAT_DATA:
//       return initState;

//     default:
//       return state;
//   }
// };

const chatSlice = createSlice({
  name: 'chat',
  initialState: initState,
  reducers: {
    messageIndicator(
      state,
      action: PayloadAction<{
        roomId: string;
        username: string;
        typing: boolean;
      }>
    ) {
      state.usersTyping = action.payload.typing
        ? [...state.usersTyping, action.payload.username]
        : state.usersTyping.filter((val) => val !== action.payload.username);
    },
    userTypingStart(state, action: PayloadAction<{ username: string }>) {
      state.usersTyping = [...state.usersTyping, action.payload.username];
    },

    userTypingEnd(state, action: PayloadAction<{ username: string }>) {
      state.usersTyping = state.usersTyping.filter(
        (val) => val !== action.payload.username
      );
    },
    sendMessage(
      state,
      action: PayloadAction<{ roomId: string; userId: string; msg: string }>
    ) {
      state.messages = [
        ...state.messages,
        createMessage(action.payload.userId, action.payload.msg, Date.now()),
      ];
    },
    toggleChatVisibility(state) {
      state.visible = !state.visible;
    },
    addMessage(
      state,
      action: PayloadAction<{ msg: string; author: string; time: number }>
    ) {
      state.messages = [
        ...state.messages,
        createMessage(
          action.payload.author,
          action.payload.msg,
          action.payload.time
        ),
      ];
    },
    leaveMessage(state, action: PayloadAction<string>) {
      state.messages = [
        ...state.messages,
        createMessage(
          'notification',
          `${action.payload} has left.`,
          Date.now()
        ),
      ];
    },
    joinMessage(state, action: PayloadAction<string>) {
      state.messages = [
        ...state.messages,
        createMessage(
          'notification',
          `${action.payload} has joined.`,
          Date.now()
        ),
      ];
    },
    setMessage(state, action: PayloadAction<string>) {
      state.chatInput = action.payload;
    },
    setInitialMessages(state, action: PayloadAction<any[]>) {
      state.messages = action.payload;
    },
    resetChatData(state) {
      state = initState;
    },
  },
});

export const {
  toggleChatVisibility,
  resetChatData,
  setInitialMessages,
  setMessage,
  sendMessage,
  addMessage,
  joinMessage,
  leaveMessage,
  userTypingEnd,
  userTypingStart,
  messageIndicator,
} = chatSlice.actions;

export default chatSlice.reducer;
