import { highlightSpecialChars, keymap, placeholder as placeholderExtension } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import { highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBracketsKeymap, closeBrackets } from '@codemirror/autocomplete'

export const extensions = ({ placeholder }: { placeholder: string }) => [
  highlightSpecialChars(),
  history(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  highlightSelectionMatches(),
  placeholderExtension(placeholder),
  EditorState.allowMultipleSelections.of(true),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...completionKeymap,
  ]),

]
