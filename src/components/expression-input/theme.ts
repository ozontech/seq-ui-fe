import { EditorView } from '@codemirror/view'
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const baseTheme = EditorView.theme({
  '&': {
    '&.cm-focused': {
      outline: 'none',
      outline_fallback: 'none',
    },
  },
  '.cm-scroller': {
    overflow: 'hidden',
    fontSize: '16px',
  },
  '.cm-content': {
    caretColor: 'var(--foreground)',
  },
  '.cm-placeholder': {
    fontSize: '16px',
  },

  '.cm-matchingBracket': {
    fontWeight: 'bold',
    color: 'var(--foreground)',
    backgroundColor: 'yellow',
    outline: '1px dashed transparent',
  },
  '&.cm-focused .cm-matchingBracket': {
    backgroundColor: 'color-mix(in oklch, var(--muted-foreground) 30%, transparent)',
  },
  '.cm-nonmatchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: 'color-mix(in oklch, var(--destructive-foreground) 20%, transparent)'
  },

  '.cm-tooltip': {
    backgroundColor: 'var(--popover)',
    borderColor: 'var(--border)',
    borderRadius: '8px',
    padding: '16px 0',
    fontSize: '14px',
  },

  '.cm-tooltip.cm-tooltip-autocomplete': {
    '& > ul': {
      maxHeight: '350px',
      maxWidth: 'unset',
    },
    '& > ul > li': {
      padding: '6px 16px',
    },
    '& li:hover': {
      backgroundColor: 'color-mix(in oklab, var(--muted) 50%, transparent)',
    },
    '& > ul > li[aria-selected]': {
      backgroundColor: 'color-mix(in oklab, var(--muted) 80%, transparent);',
      color: 'unset',
    },
    minWidth: '30%',
  },

  '.cm-completionMatchedText': {
    textDecoration: 'underline',
    fontWeight: 'bold',
  },

  '.cm-selectionMatch': {
    backgroundColor: 'color-mix(in oklch, var(--muted-foreground) 20%, transparent)',
  },

  '.cm-completionIcon': {
    float: 'right',
    width: 'max-content',
    opacity: '1',
    marginTop: '1px',
  },

  '.cm-completionIcon-property': {
    '&:after': { content: '\'keyword\'' },
  },
  '.cm-completionIcon-keyword': {
    '&:after': { content: '\'operator\'' },
  },
  '.cm-completionIcon-variable': {
    '&:after': { content: '\'text\'' },
  },

  '.cm-line': {
    '&::selection': {
      backgroundColor: 'color-mix(in oklch, var(--muted-foreground) 30%, transparent)',
    },
    '& > span::selection': {
      backgroundColor: 'color-mix(in oklch, var(--muted-foreground) 30%, transparent)',
    },
  },
})

export const highlighter = HighlightStyle.define([
  {
    tag: tags.string,
    color: 'var(--chart-2)',
  },
  {
    tag: tags.variableName,
    color: 'var(--foreground)',
  },
  {
    tag: tags.keyword,
    color: 'var(--foreground)',
    fontWeight: 'bold',
  },
  {
    tag: tags.operator,
    color: 'var(--foreground)',
  },
  {
    tag: tags.invalid,
    color: 'var(--destructive-foreground)',
  },
])
