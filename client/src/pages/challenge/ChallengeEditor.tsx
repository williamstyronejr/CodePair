import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import * as themes from '@uiw/codemirror-themes-all';
import { Extension } from '@codemirror/state';
import DropDown from '../../components/shared/DropDown';
import { useState } from 'react';

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
  initCode,
  privateRoom,
}: {
  initCode: string;
  privateRoom: boolean;
}) {
  const [theme, setTheme] = useState(() => {
    const defaultTheme = localStorage.getItem('editor-theme') || '';
    return EditorThemes[defaultTheme] ? defaultTheme : 'VSCode Dark';
  });
  const [code, setCode] = useState(initCode);

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
            if (val.docChanged) setCode(val.state.doc.toString());
          }}
        />
      </div>

      <div className="challenge__options">
        <button
          className="transition-colors challenge__btn-test"
          data-cy="runTest"
          type="button"
          onClick={() => {}}
        >
          Run Tests
        </button>

        {privateRoom ? (
          <button
            className="transition-colors challenge__btn-public"
            type="button"
            data-cy="public"
            onClick={() => {}}
          >
            Invite
          </button>
        ) : null}
      </div>
    </div>
  );
}
