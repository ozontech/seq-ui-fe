import { nextTick, defineComponent, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { prop } from '@/lib/prop'
import { cn } from "@/lib/utils"

import { useTokensStore } from '@/stores/tokens'
import { useCodemirror } from './use-codemirror'
import type { LoggingLanguageKeyword } from './language/completion'
import { SuggestionsHint } from './suggestions-hint'

const props = {
  id: prop<string>().optional(),
  value: prop<string>().required(),
  loading: prop<boolean>().optional(false),
  placeholder: prop<string>().optional(''),
  whenChange: prop<(value: string) => void>().required(),
  whenEnter: prop<(value: string) => void>().required(),
  whenBlur: prop<() => void>().optional(() => undefined),
  whenFocus: prop<() => void>().optional(() => undefined),
  whenEscape: prop<() => void>().optional(() => undefined),
}

export const ExpressionInput = defineComponent({
  name: 'ExpressionInput',
  props,
  setup(props) {
    const value = computed(() => props.value)
    const editorRef = ref<HTMLDivElement | null>(null)

    const tokens = useTokensStore()
    const { keywords } = storeToRefs(tokens)

    const filteredKeywords = computed(() => {
      const list = []
      for (const keyword of keywords.value) {
        if (!keyword.name) continue
        list.push(keyword as LoggingLanguageKeyword)
      }
      return list
    })

    const codemirror = useCodemirror(editorRef, {
      doc: value,
      keywords: filteredKeywords,
      placeholder: props.placeholder,
      whenChange: props.whenChange,
      whenEnter: props.whenEnter,
      whenBlur: props.whenBlur,
      whenFocus: props.whenFocus,
      whenEscape: props.whenEscape,
    })

    const handleSelectSuggestion = (text: string) => {
      const matchInfo = { start: 0, end: 0 }
      const resultText = text.replace(/\$\{\d+:(.*?)\}/g, (_, innerValue, offset) => {
        matchInfo.start = offset
        matchInfo.end = offset + innerValue.length
        return innerValue
      })

      codemirror.view.value?.dispatch({
        changes: {
          from: 0,
          to: codemirror.view.value?.state?.doc?.length ?? 0,
          insert: resultText,
        },
        selection: {
          head: matchInfo.end || resultText.length,
          anchor: matchInfo.start || resultText.length,
        },
      })
      nextTick(() => codemirror.view.value?.focus())
    }

    return () => (
      <div
        id={props.id}
        class={cn(
          'flex grow items-center gap-[8px] w-full border border-input rounded-md shadow-xs bg-transparent px-3 py-2',
          codemirror.active.value && 'border-ring ring-ring/50 ring-[3px]',
        )}
      >
        <SuggestionsHint
          whenSelect={handleSelectSuggestion}
        />
        <div
          class="grow"
          ref={editorRef}
        />
      </div>
    )
  },
})
