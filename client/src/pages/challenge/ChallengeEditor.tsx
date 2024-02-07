import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import * as themes from '@uiw/codemirror-themes-all';
import { javascript } from '@codemirror/lang-javascript';
import { Extension } from '@codemirror/state';
import socket from '../../utils/socket';
import DropDown from '../../components/shared/DropDown';
import usePublicizeRoom from '../../hooks/api/usePublicizeRoom';

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

export default function ChallengeEditor({
  roomId,
  initCode,
  privateRoom,
  inviteKey,
  isTesting,
  testCode,
}: {
  roomId: string;
  initCode: string;
  privateRoom: boolean;
  inviteKey: string;
  isTesting: boolean;
  testCode: (code: string) => void;
}) {
  const [theme, setTheme] = useState(() => {
    const defaultTheme = localStorage.getItem('editor-theme') || '';
    return EditorThemes[defaultTheme] ? defaultTheme : 'VSCode Dark';
  });
  const [code, setCode] = useState(initCode);
  const [codeHasChanged, setCodeHasChanged] = useState(false);
  const [inviteVisible, setInviteVisibility] = useState(false);
  const { mutate: makeRoomPublic, isPending } = usePublicizeRoom({ roomId });

  useEffect(() => {
    const savingInterval = setInterval(() => {
      if (codeHasChanged) {
        socket.emit('saveCode', roomId, code);
        setCodeHasChanged(false);
      }
    }, 5000);

    return () => {
      if (savingInterval) clearInterval(savingInterval);
    };
  }, [code, roomId, codeHasChanged]);

  useEffect(() => {
    if (!privateRoom) {
      socket.on('receiveCode', (newCode: string) => {
        setCode(newCode);
      });

      return () => {
        socket.off('receiveCode');
      };
    }
  }, [privateRoom]);

  return (
    <div className="challenge__tools">
      <div className="challenge__themes">
        <DropDown
          className="challenge__theme-dropdown"
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
          className="challenge__editor"
          width="100%"
          height="100%"
          basicSetup={{
            allowMultipleSelections: true,
          }}
          value={code}
          theme={EditorThemes[theme]}
          extensions={[...extensions]}
          onUpdate={(val) => {
            if (val.docChanged) {
              socket.emit('sendCode', roomId, val.state.doc.toString());
              setCode(val.state.doc.toString());
              setCodeHasChanged(true);
            }
          }}
        />
      </div>

      <div className="challenge__options">
        <button
          className="transition-colors challenge__btn-test"
          data-cy="runTest"
          type="button"
          disabled={isTesting}
          onClick={() => {
            socket.emit('testRequested', roomId);
            testCode(code);
          }}
        >
          Run Tests
        </button>

        {privateRoom ? (
          <button
            className="transition-colors challenge__btn-public"
            type="button"
            data-cy="public"
            onClick={() => makeRoomPublic()}
            disabled={isPending}
          >
            Invite
          </button>
        ) : null}

        {!privateRoom ? (
          <>
            <button
              className="transition-colors challenge__btn-public"
              type="button"
              data-cy="showInvite"
              onClick={() => setInviteVisibility((old) => !old)}
            >
              Invite
            </button>
            <div
              className={`challenge__invite ${
                inviteVisible ? '' : 'box--hidden'
              }`}
            >
              <div className="challenge__invite-wrapper">
                <button
                  className="btn btn--close btn--right"
                  type="button"
                  onClick={() => setInviteVisibility(!inviteVisible)}
                >
                  X
                </button>

                <p>Share link to invite another user</p>

                <p className="challenge__invite-link" data-cy="invite">
                  {`${window.location.origin}/invite/${inviteKey}`}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
