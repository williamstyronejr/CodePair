import { useRef, useEffect, useState, useCallback, KeyboardEvent } from 'react';
import socket, { emitChatTypingIndicator } from '../../utils/socket';
import './styles/chatRoom.css';

type ChatMessage = {
  authorId: string;
  authorName: string;
  content: string;
  time: number;
};

/**
 * Creates an object to represent a chat message.
 * Message in format: { author, text, time }
 * @param {String} authorId Id of user sending the message
 * @param {String} authorName Nmae of user sending the message
 * @param {String} content Message content
 * @param {Number} time Timestamp of when message was sent
 * @return {Object} Returns the message object
 */
function createMessage(
  authorId: string,
  authorName: string,
  content: string,
  time: number
): ChatMessage {
  return {
    authorId,
    authorName,
    content,
    time,
  };
}

export default function ChatRoom({
  userId,
  username,
  roomId,
  privateRoom,
  initMessages,
}: {
  userId: string;
  username: string;
  roomId: string;
  privateRoom: boolean;
  initMessages: ChatMessage[];
}) {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initMessages);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLUListElement>(null);

  const addMessage = useCallback(
    ({ content, time, authorId, authorName }: ChatMessage) => {
      setMessages((old) => [
        ...old,
        createMessage(authorId, authorName, content, time),
      ]);
    },
    []
  );

  const onKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === 'Enter' && !evt.shiftKey) {
        evt.preventDefault();

        if (input.trim() === '') return;

        socket.emit('sendMessage', roomId, userId, username, input, Date.now());
        setMessages((old) => [
          ...old,
          createMessage(userId, username, input, Date.now()),
        ]);
        setInput('');
      }
    },
    [input, userId, roomId, username]
  );

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on('joinMessage', (username): void => {
      addMessage({
        authorId: 'notification',
        authorName: 'notification',
        time: Date.now(),
        content: `${username} has joined.`,
      });
    });

    socket.on('leaveMessage', (username): void => {
      addMessage({
        authorId: 'notification',
        authorName: 'notification',
        time: Date.now(),
        content: `${username} has left.`,
      });
    });

    socket.on('receiveMessage', (authorId, authorName, content, time): void => {
      addMessage({ authorId, authorName, time, content });
    });

    socket.on('chatTyping', (username: string) => {
      setUsersTyping((old) =>
        old.includes(username) ? old : [...old, username]
      );
    });

    socket.on('chatTypingFinish', (username: string) => {
      setUsersTyping((old) => old.filter((val) => val !== username));
    });

    return () => {
      socket.off('chatTyping');
      socket.off('chatTypingFinish');
      socket.off('joinMessage');
      socket.off('leaveMessage');
      socket.off('receiveMessage');
    };
  }, [privateRoom, addMessage]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | null = null;

    if (input !== '') {
      emitChatTypingIndicator(true, username, roomId);

      typingTimeout = setTimeout(() => {
        if (input !== '') emitChatTypingIndicator(false, username, roomId);
      }, 5000);
    } else {
      emitChatTypingIndicator(false, username, roomId);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [input, username, roomId]);

  if (privateRoom) return null;

  if (!active)
    return (
      <div className="chat chat--hidden" data-cy="chatToggle">
        <button
          className="btn"
          type="button"
          onClick={() => setActive((old) => !old)}
        >
          <i className="fas fa-comment chat__icon" />
        </button>
      </div>
    );

  return (
    <div className="chat chat--active" data-cy="chat">
      <header className="chat__header">
        <h4 className="chat__heading">
          <button
            type="button"
            className="btn btn--chat"
            onClick={() => {
              setActive((old) => !old);
            }}
          >
            Chat
          </button>
        </h4>
      </header>

      <ul className="chat__messages" ref={chatRef}>
        {messages.map((msg, index) => {
          let msgType = msg.authorId === userId ? 'client' : 'server';
          if (msg.authorId === 'notification') msgType = 'notification';

          return (
            <li
              className={`message message-${msgType}`}
              key={`message-${msg.authorId}-${msg.time}-${index}`}
              data-cy="message"
            >
              <div className={`message-${msgType}__content`}>
                <p className="content__text">{msg.content}</p>
              </div>
            </li>
          );
        })}

        {usersTyping.map((user, index) => (
          <li
            key={`typing-${username}-${index}`}
            className="message message--typing"
          >
            <div className="chat__content--typing">
              <div className="chat__dots">
                <div className="chat__dot chat__dot--first" />
                <div className="chat__dot chat__dot--second" />
                <div className="chat__dot chat__dot--third" />
              </div>
            </div>
            <p className="content__text chat__user">{user}</p>
          </li>
        ))}
      </ul>

      <div className="chat__input">
        <textarea
          className="chat__textarea"
          data-cy="chatInput"
          value={input}
          onChange={(evt) => setInput(evt.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message ..."
        />
      </div>
    </div>
  );
}
