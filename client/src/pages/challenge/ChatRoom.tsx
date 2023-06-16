import { useRef, useEffect } from 'react';
import './styles/chatRoom.css';

const ChatRoom = ({
  userId,
  setMessage,
  sendMessage,
  visible,
  toggleChat,
  chatInput,
  messages,
  usersTyping,
  messageIndicator,
}: {
  userId: string;
  setMessage: any;
  sendMessage: any;
  visible: any;
  toggleChat: any;
  chatInput: any;
  messages: any;
  usersTyping: string[];
  messageIndicator: any;
}) => {
  const chatRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (chatInput !== '') {
      messageIndicator(true);
    } else {
      messageIndicator(false);
    }

    const typingTmeout = setTimeout(() => {
      if (chatInput !== '') {
        messageIndicator(false);
      }
    }, 5000);

    return () => {
      if (typingTmeout) clearTimeout(typingTmeout);
    };
  }, [chatInput]);

  if (visible) {
    return (
      <div className="chat chat--hidden" data-cy="chat">
        <button className="btn" type="button" onClick={() => toggleChat()}>
          <i className="fas fa-comment chat__icon" />
        </button>
      </div>
    );
  }

  const onChange = (e: any) => {
    setMessage(e.target.value);
  };

  // When user hits enter (without shift), send current message
  const onKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); // Stop '\n' from being put in form

      // Prevent sending empty message (spaces work)
      if (chatInput) sendMessage(chatInput);
    }
  };

  const messageList = messages.map((msg: any) => {
    const type =
      msg.author === userId
        ? 'client'
        : msg.author === 'notification'
        ? 'notification'
        : 'server';

    return (
      <li
        className={`message message-${type}`}
        key={`${msg.author}-${msg.time}-${type}`}
        data-cy="message"
      >
        <div className={`message-${type}__content`}>
          <p className="content__text">{msg.content}</p>
        </div>
      </li>
    );
  });

  return (
    <div className="chat chat--active" data-cy="chat">
      <header className="chat__header">
        <h4 className="chat__heading">
          <button className="btn btn--chat" type="button" onClick={toggleChat}>
            Chat
          </button>
        </h4>
      </header>

      <ul className="chat__messages" ref={chatRef}>
        {messageList}

        {usersTyping.map((username, index) => (
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
            <p className="content__text chat__user">{username}</p>
          </li>
        ))}
      </ul>

      <div className="chat__input">
        <textarea
          className="input__text"
          data-cy="chatInput"
          value={chatInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message ..."
        />
      </div>
    </div>
  );
};

export default ChatRoom;
