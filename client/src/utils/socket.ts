import { io } from 'socket.io-client';

const socket = io('', { autoConnect: false });

/**
 * Sends an event indicating a user is typing or has finished typing in chat.
 * @param typing Flag indicating if the user is typing or finished typing
 * @param username Name of user typing event was created by
 * @param roomId Id of room to emit event to
 */
export function emitChatTypingIndicator(
  typing: boolean,
  username: string,
  roomId: string
) {
  if (socket.connected) {
    socket.emit(typing ? 'userTyping' : 'userTypingEnd', roomId, username);
  }
}

export default socket;
