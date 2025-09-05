import { defineComponent, ref } from 'vue'
import { prop } from '@/lib/prop'
import { Lightbulb } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui'

const suggestionsArray = [
  {
    caption: 'Поиск ошибок по сервису',
    label: 'service:"my-service" AND message:"error"',
    snippet: 'service:"${1:my-service}" AND message:"error"',
  },
  {
    caption: 'Поиск ошибок на определенном контейнере',
    label: 'k8s_container:"service-api-*" AND message:"error"',
    snippet: 'k8s_container:"${1:service-api-*}" AND message:"error"',
  },
]

export const SuggestionsHint = defineComponent({
  name: 'SuggestionsHint',
  props: {
    whenSelect: prop<(text: string) => void>().required(),
  },
  setup(props) {
    const open = ref(false)

    const whenOpenChange = (state: boolean) => {
      open.value = state
    }

    const whenSelect = (text: string) => {
      props.whenSelect(text)
      whenOpenChange(false)
    }

    const renderSuggestionItem = ({ label, caption, snippet }: typeof suggestionsArray[0]) => (
      <div
        class="flex flex-col cursor-pointer"
        onClick={() => whenSelect(snippet)}
      >
        <span class="font-medium underline">
          {label}
        </span>
        <span class="text-sm">
          {caption}
        </span>
      </div>
    )

    return () => (
      <Popover open={open.value} whenOpenChange={whenOpenChange}>
        <PopoverTrigger
          class="flex justify-center align-middle cursor-pointer"
        >
          <Lightbulb size={20} color="var(--muted-foreground)" />
        </PopoverTrigger>
        <PopoverContent class="z-[3] mt-[12px] w-[450px]">
          <div class="flex flex-col gap-[8px]">
            {suggestionsArray.map(renderSuggestionItem)}
          </div>
        </PopoverContent>
      </Popover>
    )
  },
})
