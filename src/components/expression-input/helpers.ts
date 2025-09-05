import { acceptCompletion, completionStatus, startCompletion } from '@codemirror/autocomplete'
import type { EditorView } from '@codemirror/view'

export function acceptAndRestartCompletion(view: EditorView): boolean {
  if (completionStatus(view.state) !== 'active') return false
  acceptCompletion(view)
  setTimeout(() => startCompletion(view), 100)
  return true
}
