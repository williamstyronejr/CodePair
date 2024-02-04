import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../../utils/socket';
import useGetRoom from '../../hooks/api/useGetRoom';
import useUserContext from '../../hooks/context/useUserContext';
import LoadingScreen from '../../components/shared/LoadingScreen';
import ChallengeEditor from './ChallengeEditor';
import ChatRoom from './ChatRoom';
import './styles/challenge.css';
import {
  resetChatData,
  setMessage,
  toggleChatVisibility,
  sendMessage,
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
import { chatTypingIndicator } from '../../middlewares/socket';

const ChallengeErrorPage = ({ message }: { message: string }) => (
  <section className="challenge challenge--error">
    <p className="challenge__error-msg">{message}</p>
  </section>
);

const ChallengePrompt = ({
  title,
  prompt,
}: {
  title: string;
  prompt: string;
}) => {
  return (
    <div className="challenge__info">
      <header className="challenge__header">
        <h3 className="challenge__heading">{title}</h3>
      </header>

      <p className="challenge__prompt">{prompt}</p>
    </div>
  );
};

const ChallengePage = () => {
  const user = useUserContext();
  const { rId, cId } = useParams();
  const [tab, setTab] = useState('prompt');
  const [ready, setReady] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [testError, setTestError] = useState<string | null>(null);
  const { data, isPending, error } = useGetRoom({
    roomId: rId as string,
    challengeId: cId as string,
  });

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('logUser', user?.id);
    });

    socket.on('userLogged', () => {
      socket.emit('joinRoom', rId, user?.username);
      setReady(true);
    });

    return () => {
      socket.off('userLogged');
    };
  }, [user, rId]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Open socket and connect to room
  // useEffect(() => {
  //   if (!socket.connected) {
  //     dispatch(openSocket());
  //   } else if (socket.ready && !socket.inRoom && rId) {
  //     dispatch(joinRoom({ room: rId, username }));
  //   }
  // }, [
  //   rId,
  //   username,
  //   dispatch,
  //   socket.connected,
  //   socket.inRoom,
  //   socket.ready,
  //   challenge.private,
  // ]);

  if (isPending) return <LoadingScreen message="Getting room data" />;
  if (error)
    return (
      <ChallengeErrorPage message="An server error occurred, please try again." />
    );
  if (!ready && !data.room.private)
    return <LoadingScreen message="Connecting to Room" />;

  // Display loading message until chat is connected in public room
  // if (!challenge.private && (!socket.connected || !socket.inRoom)) {
  //   return <LoadingScreen message="Connecting to room" />;
  // }

  return (
    <section className="challenge">
      <div className="challenge__content">
        <div className="challenge__details">
          <nav className="challenge__nav">
            <button
              className={`challenge__nav-link ${
                tab === 'prompt' ? 'challenge__nav-link--active' : ''
              }`}
              type="button"
              onClick={() => setTab('prompt')}
            >
              Prompt
            </button>

            <button
              className={`challenge__nav-link ${
                tab === 'output' ? 'challenge__nav-link--active' : ''
              }`}
              type="button"
              onClick={() => setTab('output')}
              data-cy="output"
            >
              Output
            </button>
          </nav>

          <div className="challenge__details_content">
            {tab === 'output' ? (
              <div className="challenge__output" data-cy="tab-tests">
                <header className="challenge__results">
                  <h5 className="challenge__status"></h5>

                  <div className="challenge__test-stats"></div>
                </header>
              </div>
            ) : (
              <ChallengePrompt
                title={data.challenge.title}
                prompt={data.challenge.prompt}
              />
            )}
          </div>
        </div>

        <ChallengeEditor
          initCode={data.room.code}
          privateRoom={data.room.private}
          roomId={rId as string}
          inviteKey={data.room.inviteKey}
        />

        <ChatRoom
          roomId={data.room._id}
          userId={user.id}
          username={user.username}
          privateRoom={data.room.private}
          initMessages={data.room.messages}
        />
      </div>
    </section>
  );

  // return (
  //   <Challenge
  //     privateRoom={challenge.private}
  //     title={challenge.title}
  //     prompt={challenge.prompt}
  //     code={challenge.code}
  //     testing={challenge.testing}
  //     testPassed={challenge.testPassed}
  //     testResults={challenge.testResults}
  //     testErrors={challenge.testErrors}
  //     inviteLink={challenge.inviteLink}
  //     messages={chat.messages}
  //     chatInput={chat.chatInput}
  //     chatVisible={chat.visible}
  //     usersTyping={chat.usersTyping}
  //     challengeError={challenge.challengeError}
  //     userId={userId}
  //     toggleChatVisibility={() => dispatch(toggleChatVisibility())}
  //     setMessage={(text) => dispatch(setMessage(text))}
  //     messageIndicator={(typing) => chatTypingIndicator(rId, username, typing)}
  //     sendMessage={(msg) => dispatch(sendMessage({ roomId: rId, msg, userId }))}
  //     setCode={(code) => dispatch(setCode({ room: rId, code }))}
  //     saveCode={() => dispatch(saveCode({ rId, code: challenge.code }))}
  //     convertRoomToPublic={() => dispatch(convertRoomToPublic(rId))}
  //     testCode={(code) =>
  //       dispatch(testCode({ cId, rId, code, language: challenge.language }))
  //     }
  //   />
  // );
};

export default ChallengePage;
