import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import * as themes from '@uiw/codemirror-themes-all';
import ChatRoom from './ChatRoom';
import useOutsideClick from '../../hooks/useOutsideClick';
import { Extension } from '@codemirror/state';
import DropDown from '../../components/shared/DropDown';
import './styles/challenge.css';

const extensions = [javascript({ jsx: false })];

const EditorThemes: Record<string, Extension> = {
  abcdef: themes.abcdef,
  'Android Studio': themes.androidstudio,
  AtomOne: themes.atomone,
  Aura: themes.aura,
  BBedit: themes.bbedit,
  Bespin: themes.bespin,
  Darcula: themes.darcula,
  'Duotone Light': themes.duotoneLight,
  'Duotone Dark': themes.duotoneDark,
  Eclipse: themes.eclipse,
  'Github Light': themes.githubLight,
  'Github Dark': themes.githubDark,
  'Gruvbox Dark': themes.gruvboxDark,
  Material: themes.material,
  'Noctis Lilac': themes.noctisLilac,
  Nord: themes.nord,
  Okaidia: themes.okaidia,
  'Solarized Light': themes.solarizedLight,
  'Solarized Dark': themes.solarizedDark,
  Sublime: themes.sublime,
  'Tokyo Night': themes.tokyoNight,
  'Tokyo Night Storm': themes.tokyoNightStorm,
  'Tokyo Night Day': themes.tokyoNightDay,
  'VSCode Dark': themes.vscodeDark,
  'XCode Light': themes.xcodeLight,
  'XCode Dark': themes.xcodeDark,
};

function Challenge({
  userId,
  title,
  prompt,
  code,
  testing,
  testPassed,
  testResults,
  testErrors,
  challengeError,
  usersTyping,
  privateRoom,
  chatVisible,
  inviteLink,
  chatInput,
  messages,
  testCode,
  setCode,
  saveCode,
  setMessage,
  sendMessage,
  toggleChatVisibility,
  convertRoomToPublic,
  messageIndicator,
}: {
  userId: string;
  title: string;
  prompt: string;
  code: string;
  testing: boolean;
  testPassed: boolean;
  testResults: any[];
  testErrors: string;
  usersTyping: any[];
  challengeError: string | null;
  privateRoom: boolean;
  chatVisible: boolean;
  inviteLink: string | null;
  chatInput: string;
  messages: any[];
  testCode: (code: string) => void;
  setCode: (code: string) => void;
  saveCode: () => void;
  setMessage: (text: string) => void;
  sendMessage: (msg: string) => void;
  toggleChatVisibility: () => void;
  convertRoomToPublic: () => void;
  messageIndicator: (typing: boolean) => void;
}) {
  const defaultTheme = localStorage.getItem('editor-theme') || '';
  const [inviteVisible, setInviteVisibility] = useState(false);
  const [lastCode, setLastCode] = useState(code);
  const [theme, setTheme] = useState(
    EditorThemes[defaultTheme] ? defaultTheme : 'VSCode Dark'
  );
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
        saveCode();
        setLastCode(code);
      }
    }, 5000);

    return () => {
      if (savingInterval) clearInterval(savingInterval);
    };
  }, [lastCode, code, saveCode]);

  switch (details) {
    case 'output': {
      let testPass = 0;
      let testFail = 0;

      console.log(testErrors);

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
        <div className="challenge__output" data-cy="tab-tests">
          <header className="challenge__results">
            <h5 className="challenge__status">
              {testing ? 'Status: Requesting test from server' : null}
              {!testing && testResults.length === 0
                ? 'Test results will appear below'
                : ''}
            </h5>

            {challengeError ? (
              <h6 className="chalelnge__status challenge__status-error">
                Error running code
              </h6>
            ) : null}

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
    <section className="challenge" data-cy="challenge">
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
          <div className="challenge__themes">
            <DropDown
              options={Object.keys(EditorThemes)}
              value={theme}
              title="Theme"
              changeValue={(option) => {
                setTheme(option);
                localStorage.setItem('editor-theme', option);
              }}
            />
          </div>

          <div className="challenge__editor-wrapper">
            <CodeMirror
              width="100%"
              height="100%"
              basicSetup={{
                allowMultipleSelections: true,
              }}
              value={code}
              theme={EditorThemes[theme]}
              extensions={[...extensions]}
              onUpdate={(val) => {
                if (val.docChanged) setCode(val.state.doc.toString());
              }}
            />
          </div>
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
                  {`${window.location.origin}/invite/${inviteLink}`}
                </p>
              </div>
            </div>
          </>
        )}

        {!privateRoom ? (
          <ChatRoom
            userId={userId}
            chatInput={chatInput}
            messages={messages}
            usersTyping={usersTyping}
            setMessage={setMessage}
            sendMessage={sendMessage}
            visible={chatVisible}
            toggleChat={toggleChatVisibility}
            messageIndicator={messageIndicator}
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
