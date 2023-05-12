import * as React from 'react';
import { useParams } from 'react-router-dom';
import LoadingScreen from '../../components/shared/LoadingScreen';
import Challenge from './Challenge';
import { useAppDispatch, useAppSelector } from '../../hooks/reactRedux';
import {
  resetChatData,
  setMessage,
  toggleChatVisibility,
  sendMessage,
  userTypingEnd,
  userTypingStart,
  messageIndicator,
} from '../../reducers/chatReducer';
import {
  getChallenge,
  clearChallengeData,
  setCode,
  saveCode,
  testCode,
  convertRoomToPublic,
} from '../../reducers/challengeReducer';
import {
  closeSocket,
  openSocket,
  joinRoom,
} from '../../reducers/socketReducer';
import './styles/challenge.css';

const ChallengeErrorPage = ({ message }: { message: string }) => (
  <section className="challenge challenge--error">
    <p className="challenge__error-msg">{message}</p>
  </section>
);

const ChallengePage = () => {
  const { chat, socket, challenge, username, userId } = useAppSelector(
    (state) => ({
      chat: state.chat,
      socket: state.socket,
      challenge: state.challenge,
      username: state.user.username,
      userId: state.user.id,
    })
  );
  const dispatch = useAppDispatch();
  const { rId, cId } = useParams();
  // Clean up
  React.useEffect(() => {
    return () => {
      dispatch(clearChallengeData());
      dispatch(resetChatData());
      dispatch(closeSocket());
    };
  }, []);

  // Fetch data for challenge/room initial mount
  React.useEffect(() => {
    dispatch(getChallenge({ cId, rId }));
  }, [rId, cId]);

  // Open socket and connect to room
  React.useEffect(() => {
    if (!socket.connected) {
      dispatch(openSocket());
    } else if (socket.ready && !socket.inRoom) {
      dispatch(joinRoom({ room: rId, username }));
    }
  }, [socket.connected, socket.inRoom, socket.ready, challenge.private]);

  // If an error occurred during data fetch
  if (!rId || challenge.challengeError) {
    return (
      <ChallengeErrorPage
        message={
          challenge.challengeError || 'Server Error occurred, please Refresh'
        }
      />
    );
  }

  // Show loading screen if challenge or room data is being fetched
  if (!challenge.id) {
    return <LoadingScreen message="Getting data" />;
  }

  // Display loading message until chat is connected in public room
  if (!challenge.private && (!socket.connected || !socket.inRoom)) {
    return <LoadingScreen message="Connecting to room" />;
  }

  return (
    <Challenge
      privateRoom={challenge.private}
      title={challenge.title}
      prompt={challenge.prompt}
      code={challenge.code}
      testing={challenge.testing}
      language={challenge.language}
      testPassed={challenge.testPassed}
      testResults={challenge.testResults}
      testErrors={challenge.testErrors}
      inviteLink={challenge.inviteLink}
      savingCode={challenge.savingCode}
      messages={chat.messages}
      chatInput={chat.chatInput}
      chatVisible={chat.visible}
      usersTyping={chat.usersTyping}
      userId={userId}
      toggleChatVisibility={() => dispatch(toggleChatVisibility())}
      setMessage={(text) => dispatch(setMessage(text))}
      messageIndicator={(typing) =>
        dispatch(messageIndicator({ roomId: rId, typing, username }))
      }
      sendMessage={(msg) => dispatch(sendMessage({ roomId: rId, msg, userId }))}
      setCode={(code) => dispatch(setCode({ room: rId, code }))}
      saveCode={() => dispatch(saveCode({ rId, code: challenge.code }))}
      convertRoomToPublic={() => dispatch(convertRoomToPublic(rId))}
      testCode={(code) =>
        dispatch(testCode({ cId, rId, code, language: challenge.language }))
      }
    />
  );
};

export default ChallengePage;
