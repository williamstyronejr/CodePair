import * as React from 'react';
import { Link } from 'react-router-dom';
import { Controlled as CodeMirror } from 'react-codemirror2';
import PropTypes from 'prop-types';
import ChatRoom from './ChatRoom';
import useDetectOutsideClick from '../shared/useDetectOutsideClick';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import './styles/challenge.css';

const Challenge = (props) => {
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
    savingCode,
    usersTyping,
  } = props;
  const inviteRef = React.useRef(null);
  const [lastCode, setLastCode] = React.useState(code);
  const [inviteVisible, setInviteVisibility] = useDetectOutsideClick(
    inviteRef,
    false
  );
  const [details, setDetails] = React.useState('prompt');
  let savingInterval;
  let detailsComponent;

  React.useEffect(() => {
    // Every 5 seconds save code if different for last save
    savingInterval = setInterval(() => {
      if (lastCode !== code) {
        props.saveCode();
        setLastCode(code);
      }
    }, 5000);

    return () => {
      if (savingInterval) clearInterval(savingInterval);
    };
  }, [lastCode, code, props.saveCode, savingInterval]);

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
        testResults.map((test) => {
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
              {test.expects.map((expect) => (
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
          <p className="challenge__prompt">{prompt}</p>
        </div>
      );
  }

  return (
    <section className="challenge">
      <header className="challenge__header">
        <h3 className="challenge__heading">{title}</h3>
        <span
          className={`challenge__saving ${
            savingCode
              ? 'challenge__saving--active'
              : 'challenge__saving--unactive'
          }`}
        >
          <i className="fas fa-spinner fa-spin" />
          Saving
        </span>
      </header>

      <div className="challenge__content">
        <div className="challenge__details">
          <nav className="challenge__nav">
            <button
              className={`btn btn--nav ${
                details === 'prompt' ? 'btn--nav-active' : ''
              }`}
              type="button"
              onClick={() => setDetails('prompt')}
            >
              Prompt
            </button>

            <button
              className={`btn btn--nav ${
                details === 'output' ? 'btn--nav-active' : ''
              }`}
              type="button"
              onClick={() => setDetails('output')}
              data-cy="output"
            >
              Output
            </button>
          </nav>

          {detailsComponent}
        </div>

        <div className="challenge__tools">
          <CodeMirror
            className="challenge__editor"
            value={code}
            options={{
              lineNumbers: true,
              lineWrapping: true,
              theme: 'dracula',
              tabSize: 2,
              mode: 'javascript',
            }}
            onBeforeChange={(editor, data, value) => {
              setCode(value);
            }}
            onChange={(editor, data, value) => {}}
          />
        </div>
      </div>

      <div className="challenge__options">
        <button
          className="btn btn--test"
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
            className="btn btn--public"
            type="button"
            onClick={convertRoomToPublic}
            data-cy="public"
          >
            Invite Link
          </button>
        ) : (
          <>
            <button
              className="btn btn--public"
              type="button"
              data-cy="showInvite"
              onClick={() => setInviteVisibility(!inviteVisible)}
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
};

Challenge.propTypes = {
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  testing: PropTypes.bool.isRequired,
  savingCode: PropTypes.bool.isRequired,
  testPassed: PropTypes.bool.isRequired,
  testResults: PropTypes.array.isRequired,
  usersTyping: PropTypes.array.isRequired,
  testCode: PropTypes.func.isRequired,
  setCode: PropTypes.func.isRequired,
  saveCode: PropTypes.func.isRequired,
  chatVisible: PropTypes.bool.isRequired,
  setMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  toggleChatVisibility: PropTypes.func.isRequired,
  convertRoomToPublic: PropTypes.func.isRequired,
  messageIndicator: PropTypes.func.isRequired,
  privateRoom: PropTypes.bool.isRequired,
  inviteLink: PropTypes.string,
  chatInput: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  testErrors: PropTypes.string,
};

Challenge.defaultProps = {
  testErrors: null,
  inviteLink: '',
};

export default Challenge;
