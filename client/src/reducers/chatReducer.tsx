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
    ) {},
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
      state.chatInput = '';
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
