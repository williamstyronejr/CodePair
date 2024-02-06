import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import socket from '../../utils/socket';
import useGetRoom from '../../hooks/api/useGetRoom';
import useUserContext from '../../hooks/context/useUserContext';
import useTestCode from '../../hooks/api/useTestCode';
import LoadingScreen from '../../components/shared/LoadingScreen';
import ChallengeEditor from './ChallengeEditor';
import ChatRoom from './ChatRoom';
import './styles/challenge.css';

type TestResults = {
  passed: boolean;
  results: any[];
  errors: string;
};

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
  const [testing, setTesting] = useState(false);
  const [testingResults, setTestingResults] = useState<TestResults>({
    passed: false,
    results: [],
    errors: '',
  });
  const { data, isPending, error } = useGetRoom({
    roomId: rId as string,
    challengeId: cId as string,
  });
  const { mutate: testCode, isPending: isRequestingTest } = useTestCode({
    challengeId: cId as string,
    roomId: rId as string,
    onSuccess: () => {
      setTesting(true);
      setTestingResults({ passed: false, results: [], errors: '' });
    },
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

    socket.on('testingCode', () => {
      setTesting(true);
    });

    socket.on(
      'testCompleted',
      (results: any, success: boolean, errors: any) => {
        setTestingResults({ results, passed: success, errors });
        setTesting(false);
      }
    );

    return () => {
      socket.off('testingCode');
      socket.off('testCompleted');
      socket.disconnect();
    };
  }, []);

  if (isPending) return <LoadingScreen message="Getting room data" />;
  if (error)
    return (
      <ChallengeErrorPage message="An server error occurred, please try again." />
    );
  if (!ready && !data.room.private)
    return <LoadingScreen message="Connecting to Room" />;

  return (
    <section className="challenge" data-cy="challenge">
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
                  <h5 className="challenge__status">
                    {testing ? 'Status: Requesting test' : null}
                    {!testing && testingResults.results.length === 0
                      ? 'Test results will appear below'
                      : null}
                  </h5>

                  {testingResults.errors ? (
                    <h6 className="challenge__status challenge__status-error">
                      Error Running Code
                    </h6>
                  ) : null}

                  <div className="challenge__test-stats">
                    {testingResults.results.map((test) => (
                      <li
                        key={`test-${test.name}`}
                        className={`challenge__item ${test.status} ? 'challenge__item--pass' : 'challenge__item--fail'`}
                        data-cy="testResult"
                      >
                        <p className="challenge__test-name">{test.name}</p>
                        {test.expects.map((expect: any) => (
                          <span
                            key={`test-expect-${expect.name}`}
                            className="challenge__expect"
                          >
                            {expect.name}
                          </span>
                        ))}
                      </li>
                    ))}
                  </div>
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
          roomId={rId as string}
          challengeId={cId as string}
          initCode={data.room.code}
          privateRoom={data.room.private}
          inviteKey={data.room.inviteKey}
          testCode={testCode}
          isTesting={isRequestingTest || testing}
        />

        <ChatRoom
          roomId={data.room._id}
          userId={user.id}
          username={user.username}
          privateRoom={data.room.private}
          initMessages={data.room.messages}
        />

        {testingResults.passed ? (
          <div className="challenge__popup">
            <div className="challenge__completed">
              <h2>Challenge Completed!</h2>
              <Link to="/challenges">Click here</Link> to go to challenge list.
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ChallengePage;
