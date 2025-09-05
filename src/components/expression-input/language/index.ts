import type { Extension } from '@codemirror/state'
import { autocompletion } from '@codemirror/autocomplete'
import { LRLanguage } from '@codemirror/language'
import { styleTags, tags } from '@lezer/highlight'
import type { Ref } from 'vue'

import { parser } from './parser'
import { loggingAutocomplete } from './completion'
import type { LoggingLanguageKeyword } from './completion'

function customLoggingLanguage(): LRLanguage {

  return LRLanguage.define({
    parser: parser.configure({
      props: [
        styleTags({
          Key: tags.keyword,
          QuotedKey: tags.keyword,
          QuotedValue: tags.string,
          UnquotedValue: tags.variableName,
          'AND OR NOT IN': tags.operatorKeyword,
          '_exists_:': tags.special(tags.keyword),
        }),
      ],
    }),
  })
}

export function loggingLanguageExtensions(keywords: Ref<LoggingLanguageKeyword[]>): Extension[] {
  const language = customLoggingLanguage()

  const completion = autocompletion({
    override: [loggingAutocomplete(keywords)],
  })

  return [language, completion]
}

