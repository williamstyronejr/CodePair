import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import ChatRoom from './ChatRoom';
import useOutsideClick from '../../hooks/useOutsideClick';
import './styles/challenge.css';

const extensions = [javascript({ jsx: false })];

function Challenge(props: {
  userId: string;
  title: string;
  prompt: string;
  code: string;
  testing: boolean;
  savingCode: boolean;
  testPassed: boolean;
  testResults: any[];
  usersTyping: any[];
  testCode: () => void;
  setCode: () => void;
  saveCode: () => void;
  setMessage: () => void;
  sendMessage: () => void;
  toggleChatVisibility: () => void;
  convertRoomToPublic: () => void;
  messageIndicator: () => void;
  privateRoom: boolean;
  chatVisible: boolean;
  inviteLink: string;
  chatInput: string;
  messages: any[];
  language: string;
  testErrors: string;
}) {
  const {
    title,
    prompt,
    testing,
    code,
    testPassed,
    privateRoom,
    inviteLink,
    chatInput,
    messages,
    setMessage,
    chatVisible,
    toggleChatVisibility,
    convertRoomToPublic,
    sendMessage,
    setCode,
    testCode,
    testResults,
    testErrors,
    usersTyping,
  } = props;
  const [lastCode, setLastCode] = useState(code);
  const [inviteVisible, setInviteVisibility] = useState(false);
  const inviteRef = useOutsideClick({
    active: inviteVisible,
    ignoreButton: true,
    closeEvent: () => {
      setInviteVisibility(false);
    },
  });
  const [details, setDetails] = useState('prompt');
  let detailsComponent;

  useEffect(() => {
    // Every 5 seconds save code if different for last save
    const savingInterval = setInterval(() => {
      if (lastCode !== code) {
        props.saveCode();
        setLastCode(code);
      }
    }, 5000);

    return () => {
      if (savingInterval) clearInterval(savingInterval);
    };
  }, [lastCode, code, props.saveCode]);

  switch (details) {
    case 'output': {
      let testPass = 0;
      let testFail = 0;

      const listItems = testErrors ? (
        <li
          className="challenge__item challenge__item--error"
          data-cy="testError"
        >
          {testErrors}
        </li>
      ) : (
        testResults.map((test: any) => {
          if (test.status) {
            testPass += 1;
          } else {
            testFail += 1;
          }

          return (
            <li
              className={`challenge__item ${
                test.status ? 'challenge__item--pass' : 'challenge__item--fail'
              }`}
              key={test.name}
              data-cy="testResult"
            >
              <p className="challenge__test-name">{test.name}</p>
              {test.expects.map((expect: any) => (
                <span className="challenge__expect" key={expect.name}>
                  {expect.name}
                </span>
              ))}
            </li>
          );
        })
      );

      detailsComponent = (
        <div className="challenge__output">
          <header className="challenge__results">
            <h5 className="challenge__status">
              {testing ? 'Status: Requesting test from server' : null}
              {!testing && !testErrors && testResults.length === 0
                ? 'Test results will appear below'
                : ''}
              {testErrors ? 'Error running code' : null}
            </h5>

            <div className="challenge__test-stats">
              {testResults && testResults.length > 0 ? (
                <>
                  <span className="challenge__test-passed">
                    Test Passed: {testPass}
                  </span>
                  <span className="challenge__test-failed">
                    Test Failed: {testFail}
                  </span>
                </>
              ) : null}
            </div>
          </header>
          <ul className="challenge__list">{listItems}</ul>
        </div>
      );

      break;
    }

    default:
      detailsComponent = (
        <div className="challenge__info">
          <header className="challenge__header">
            <h3 className="challenge__heading">{title}</h3>
          </header>

          <p className="challenge__prompt">{prompt}</p>
        </div>
      );
  }

  return (
    <section className="challenge">
      <div className="challenge__content">
        <div className="challenge__details">
          <nav className="challenge__nav">
            <button
              className={`challenge__nav-link ${
                details === 'prompt' ? 'challenge__nav-link--active' : ''
              }`}
              type="button"
              onClick={() => setDetails('prompt')}
            >
              Prompt
            </button>

            <button
              className={`challenge__nav-link ${
                details === 'output' ? 'challenge__nav-link--active' : ''
              }`}
              type="button"
              onClick={() => setDetails('output')}
              data-cy="output"
            >
              Output
            </button>
          </nav>

          <div className="challenge__details-content">{detailsComponent}</div>
        </div>

        <div className="challenge__tools" id="pairs">
          <CodeMirror
            width="100%"
            height="100%"
            basicSetup={{
              allowMultipleSelections: true,
            }}
            value={code}
            theme={vscodeDark}
            extensions={[...extensions]}
            onUpdate={(val) => {
              if (val.docChanged) setCode(val.state.doc.toString());
            }}
          />
        </div>
      </div>

      <div className="challenge__options">
        <button
          className="transition-colors btn btn--test"
          data-cy="runTest"
          type="button"
          disabled={testPassed || testing}
          onClick={() => {
            setDetails('output');
            testCode(code);
          }}
        >
          Run Tests
        </button>

        {privateRoom ? (
          <button
            className="transition-colors btn btn--public"
            type="button"
            onClick={convertRoomToPublic}
            data-cy="public"
          >
            Invite Link
          </button>
        ) : (
          <>
            <button
              className="transition-colors btn btn--public"
              type="button"
              data-cy="showInvite"
              onClick={() => setInviteVisibility((old) => !old)}
            >
              Invite Link
            </button>

            <div
              className={`challenge__invite ${
                inviteVisible ? '' : 'box--hidden'
              }`}
            >
              <div className="challenge__invite-wrapper" ref={inviteRef}>
                <button
                  className="btn btn--close btn--right"
                  type="button"
                  onClick={() => setInviteVisibility(!inviteVisible)}
                >
                  X
                </button>

                <p>Share link to invite another user</p>

                <p className="challenge__invite-link" data-cy="invite">
                  {inviteLink}
                </p>
              </div>
            </div>
          </>
        )}

        {!privateRoom ? (
          <ChatRoom
            userId={props.userId}
            chatInput={chatInput}
            messages={messages}
            usersTyping={usersTyping}
            setMessage={setMessage}
            sendMessage={sendMessage}
            visible={chatVisible}
            toggleChat={toggleChatVisibility}
            messageIndicator={props.messageIndicator}
          />
        ) : null}
      </div>

      {testPassed && (
        <div className="challenge__popup">
          <div className="challenge__completed">
            <h2>Challenge Completed!</h2>
            <Link to="/challenges">Click here</Link> to go to challenge list.
          </div>
        </div>
      )}
    </section>
  );
}

export default Challenge;
