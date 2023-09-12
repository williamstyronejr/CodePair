import { useState } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { githubLight } from '@uiw/codemirror-themes-all';

import './styles/demo.css';

const DemoChallenge = () => {
  const [code, setCode] = useState(
    'function main (num1, num2) {\n\t// Comment...\n\tconst sum = num1 + num2;\n\treturn sum;\n}'
  );

  return (
    <div className="demo__container">
      <div className="demo__prompt">
        <h4 className="demo__prompt-title">Find the Sum</h4>

        <div className="demo__description">
          Write a function that takes two integers and returns the sum.
        </div>
      </div>

      <div className="demo__content">
        <div className="demo__options">
          <button
            className="demo__test transition-colors"
            type="button"
            onClick={() => {}}
          >
            Run
          </button>
        </div>

        <CodeMirror
          className="demo__editor"
          width="100%"
          height="100%"
          theme={githubLight}
          basicSetup={{
            allowMultipleSelections: true,
          }}
          value={code}
          extensions={[javascript()]}
          onUpdate={(val) => {
            if (val.docChanged) setCode(val.state.doc.toString());
          }}
        />
      </div>
    </div>
  );
};

export default DemoChallenge;
