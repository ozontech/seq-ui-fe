import type { Completion, CompletionContext, CompletionSource } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import type { Ref } from 'vue'

import { filterOptions, filterRecords } from '~/helpers/filter-options'

export type LoggingLanguageKeyword = {
  name: string
  type?: 'unknown' | 'keyword' | 'text'
}

const getText = (context: CompletionContext, from: number, to: number) => {
  return context.state.doc.sliceString(from, to)
}

const applier = (text: string, cursorOffset: number): Completion['apply'] => (view, _, from, to) => {
  view.dispatch({
    changes: { from, to, insert: text },
    selection: {
      anchor: from + text.length + cursorOffset,
      head: from + text.length + cursorOffset,
    },
  })

}

export function loggingAutocomplete(keywords: Ref<LoggingLanguageKeyword[]>): CompletionSource {

  const unaryOperators = ['_exists_', 'NOT']
  const binaryOperators = ['AND', 'OR']

  return (context: CompletionContext) => {

    const word = context.matchBefore(/[a-zA-Zа-яА-ЯёЁ0-9_]*/)
    if (!word) return null
    const wordWithQuotes = context.matchBefore(/[a-zA-Zа-яА-ЯёЁ0-9_"'`]*/)
    const endQuoteAfter = ['"', '\'', '`'].includes(context.view?.state?.doc?.sliceString?.(context.pos, context.pos + 1) ?? '')
    const quoteClosed = /^(["'`])[^]*\1$/.test(wordWithQuotes?.text ?? '')

    const tree = syntaxTree(context.state)
    const pos = context.pos
    const node = tree.resolveInner(pos, -1)

    if (!node) return null
    if ([...binaryOperators, 'NOT'].some((it) => node.name.toUpperCase() === it)) return null

    if (node.prevSibling?.name === 'Exists' && !quoteClosed) {
      return {
        from: word.from,
        options: [
          ...filterRecords(keywords.value, 'name', word.text).map((keyword) => {
            return ({
              label: `${keyword.name}`,
              type: keyword.type === 'keyword' ? 'property' : 'variable',
              apply: !endQuoteAfter ? applier(`${keyword.name}${wordWithQuotes?.text[0]} `, 0) : applier(`${keyword.name}`, 1),
            })
          }),
        ],
      }
    }

    if (node.name === 'Key') {
      return {
        from: word.from,
        options: [...filterOptions(unaryOperators, word.text).map((operator) => {
          return ({
            label: `${operator}`,
            type: 'keyword',
            apply: operator === 'NOT' ? applier(`${operator} `, 0) : applier(`${operator}:""`, -1),
            boost: 1000000,
          })
        }), ...filterRecords(keywords.value, 'name', word.text).map((keyword) => {
          return ({
            label: `${keyword.name}`,
            type: keyword.type === 'keyword' ? 'property' : 'variable',
            apply: applier(`${keyword.name}:""`, -1),
          })
        })],
      }
    }

    const levelApply = () => {
      return {
        from: word.from,
        options: [0, 1, 2, 3, 4, 5, 6, 7].map((it) => ({
          label: `${it}`,
          type: `level${it}`,
          apply: applier(`${it}`, 0),
        })),
      }
    }

    if (node.name === 'Eq' && !word.text) {
      const key = node.prevSibling
      if (key?.name === 'Key' && getText(context, key.from, key.to) === 'level') {
        return levelApply()
      }
    }
    if (node.name === 'UnquotedValue' || node.name === 'QuotedValue') {
      if ((wordWithQuotes?.text?.length ?? 0) - (word?.text?.length ?? 0) < 2) {
        const key = node.prevSibling?.prevSibling
        if (key?.name === 'Key' && getText(context, key.from, key.to) === 'level' && !word.text) {
          return levelApply()
        }
      }
    }

    if (node.parent?.name === 'BinaryExpression') {
      if (node.name === 'DirtyOperator') {
        return {
          from: word.from,
          options: filterOptions(binaryOperators, word.text).map((operator) => {
            return ({
              label: `${operator}`,
              type: 'keyword',
              apply: applier(`${operator} `, 0),
            })
          }),
        }
      }
    }

    return {
      from: word.from,
      options: [],
      validFor: /^[\w@-]*$/,
    }
  }
}
