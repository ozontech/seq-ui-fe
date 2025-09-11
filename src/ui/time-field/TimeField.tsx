import { defineComponent, type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  TimeFieldRoot,
  TimeFieldInput,
  type TimeFieldRootProps,
  type TimeFieldInputProps,
} from 'reka-ui'
import { Time } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { prop } from '@fe/prop-types'
import { Clock8 } from 'lucide-vue-next'

const props = {
  value: prop<string>().required(),
  whenChange: prop<(value: string) => void>().required(),
  placeholder: prop<string>().optional(),
  as: prop<TimeFieldRootProps['as']>().optional(),
  asChild: prop<TimeFieldRootProps['asChild']>().optional(),
  defaultPlaceholder: prop<TimeFieldRootProps['defaultPlaceholder']>().optional(),
  defaultValue: prop<TimeFieldRootProps['defaultValue']>().optional(),
  dir: prop<TimeFieldRootProps['dir']>().optional(),
  disabled: prop<TimeFieldRootProps['disabled']>().optional(),
  granularity: prop<TimeFieldRootProps['granularity']>().optional(),
  hideTimeZone: prop<TimeFieldRootProps['hideTimeZone']>().optional(),
  hourCycle: prop<TimeFieldRootProps['hourCycle']>().optional(),
  id: prop<TimeFieldRootProps['id']>().optional(),
  locale: prop<TimeFieldRootProps['locale']>().optional(),
  minValue: prop<TimeFieldRootProps['minValue']>().optional(),
  maxValue: prop<TimeFieldRootProps['maxValue']>().optional(),
  name: prop<TimeFieldRootProps['name']>().optional(),
  readonly: prop<TimeFieldRootProps['readonly']>().optional(),
  required: prop<TimeFieldRootProps['required']>().optional(),
  asteps: prop<TimeFieldRootProps['step']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

type Segment = { part: TimeFieldInputProps['part'], value: string }

const parseTimeString = (value: string) => {
  if (!value) {
    return new Time()
  }

  const [hours, minutes, seconds] = value.split(':').map(Number)
  return new Time(hours, minutes, seconds)
}

export const TimeField = defineComponent({
  name: 'TimeField',
  props,
  setup(props) {
    return () => (
      <TimeFieldRoot
        data-slot="time-field"
        class={cn(
          'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          props.class
        )}
        modelValue={parseTimeString(props.value)}
        onUpdate:modelValue={(time) => props.whenChange(time?.toString() ?? '')}
        {...reactiveOmit(props, 'class', 'placeholder')}
      >
        {{
          default: ({ segments }: { segments: Segment[] }) => (
            <div class="flex items-center">
              <Clock8 class="mr-2 h-4 w-4" />
              {props.value ? segments.map((segment, index) => (
                <TimeFieldInput
                  key={`${segment.part}-${index}`}
                  part={segment.part}
                  class="flex items-center"
                >
                  {segment.value}
                </TimeFieldInput>
              )) : props.placeholder}
            </div>
          )
        }}
      </TimeFieldRoot>
    )
  },
})
