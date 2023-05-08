import { EditorView, keymap } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';
import { basicSetup } from 'codemirror';

const styles = EditorView.theme({
  '&': {
    height: '100%',
  },
  '.cm-scroller': { overflow: 'auto' },
});

const { lineWrapping } = EditorView;

export default [
  basicSetup,
  styles,
  lineWrapping,
  keymap.of([indentWithTab]),
  oneDark,
];
