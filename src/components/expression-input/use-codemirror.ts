import type { Ref } from 'vue'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Prec, Compartment } from '@codemirror/state'
import { insertNewlineAndIndent } from '@codemirror/commands'
import { syntaxHighlighting } from '@codemirror/language'

import { extensions } from './extensions'
import { loggingLanguageExtensions } from './language'
import type { LoggingLanguageKeyword } from './language/completion'
import { acceptAndRestartCompletion } from './helpers'
import { baseTheme, highlighter } from './theme'

const dynamicConfigCompartment = new Compartment()

export const useCodemirror = (editorRef: Ref<HTMLDivElement | null>, options: {
  doc: Ref<string>
  placeholder: string
  keywords: Ref<LoggingLanguageKeyword[]>
  whenChange: (value: string) => void
  whenEnter: (value: string) => void
  whenBlur?: () => void
  whenFocus?: () => void
  whenEscape?: () => void
}) => {
  const view = ref<EditorView | null>(null)
  const active = ref(false)

  const dynamicConfig = computed(() => {
    return [
      EditorView.editable.of(true),
      baseTheme,
      syntaxHighlighting(highlighter),
    ]
  })

  const createState = (doc: string) => {
    return EditorState.create({
      doc,
      extensions: [
        keymap.of([
          {
            key: 'Escape',
            run: (editor: EditorView): boolean => {
              editor.contentDOM.blur()
              options.whenEscape?.()
              return false
            },
          },
        ]),
        Prec.highest(keymap.of([
          {
            key: 'Tab',
            run: (view: EditorView) => {
              return acceptAndRestartCompletion(view) || false
            },
          },
          {
            key: 'Enter',
            run: (view: EditorView): boolean => {
              if (acceptAndRestartCompletion(view)) return true
              options.whenEnter(view.state.doc.toString())
              return true
            },
          },
          {
            key: 'Shift-Enter',
            run: insertNewlineAndIndent,
          },

        ])),
        ...extensions({ placeholder: options.placeholder }),
        ...loggingLanguageExtensions(options.keywords),
        dynamicConfigCompartment.of(dynamicConfig.value),

        EditorView.updateListener.of((update: ViewUpdate): void => {
          if (update.focusChanged) {
            active.value = update.view.hasFocus

            if (update.view.hasFocus) {
              options.whenFocus?.()
            } else {
              options.whenBlur?.()
            }
          }

          if (update.docChanged) {
            options.whenChange(update.state.doc.toString())
          }
        }),
        EditorView.domEventHandlers({
          paste: (event, view) => {
            event.preventDefault()

            const text = event.clipboardData?.getData('text/plain') ?? ''
            const inlineText = text.replaceAll('\n', ' ')
            const { from, to } = view.state.selection.main

            view.dispatch({
              changes: { from, to, insert: inlineText },
              selection: { anchor: from + inlineText.length },
            })
          },
        }),
      ],
    })
  }

  onMounted(async () => {
    if (!editorRef.value) {
      throw new Error('expected CodeMirror container element to exist')
    }

    const editor = new EditorView({
      state: createState(options.doc.value),
      parent: editorRef.value,
    })

    view.value = editor

    nextTick(() => view.value?.focus())

  })

  watch(options.doc, (value) => {
    if (!view.value) {
      return
    }

    if (value !== view.value.state.doc.toString()) {
      view.value.dispatch({
        changes: {
          from: 0,
          to: view.value.state.doc.length,
          insert: value,
        },
      })
    }
  })

  return {
    view,
    active,
  }
}
