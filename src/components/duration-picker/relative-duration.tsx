import { getUnitFromDuration } from "@/helpers/duration";
import { durationToMessage } from "@/helpers/duration-locale";
import { prop } from "@/lib/prop";
import type { Duration } from "@/types/duration";
import {
  FilterChipToggle,
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui";
import { equals } from "ramda";
import type { AcceptableValue } from "reka-ui";
import { computed, defineComponent } from "vue";
import { cn } from "@/lib/utils"

export const relativeOptions: Duration[] = [
  { minutes: 15 },
  { hours: 1 },
  { days: 1 },
  { weeks: 1 },
]

const unitOptions = [
  'seconds',
  'minutes',
  'hours',
  'days',
  'weeks',
] as const

const props = {
  from: prop<Duration>().required(),
  amount: prop<number>().optional(),
  unit: prop<keyof Duration | null>().optional(),
  whenSelect: prop<(value: Duration) => void>().required(),
}

export const RelativeDuration = defineComponent({
  name: 'RelativeDuration',
  props,
  setup(props) {
    const customLastLabel = computed(() => {
      const message = durationToMessage(props.from)

      return message ? message[0] : 'Last'
    })

    const customUnitLabel = computed(() => {
      if (!props.unit) {
        return
      }

      const message = durationToMessage({ [props.unit ?? 'minutes']: props.amount })
      if (!message) {
        return
      }

      return message[2]
    })

    const renderOptions = () => (
      <>
        <span class="text-base font-medium">Presets</span>
        <div class="flex flex-wrap gap-[8px]">
          {relativeOptions.map((duration) => {
            const message = durationToMessage(duration)
            if (!message) {
              return
            }

            const [last, amount, unit] = message
            const _unit = getUnitFromDuration(duration, 'first')
            const selected = Boolean(_unit && equals(duration, props.from))

            return (
              <FilterChipToggle
                class={cn(selected && 'border-primary')}
                key={`${amount}${unit}`}
                variant="outline"
                whenClick={() => props.whenSelect(duration)}
              >
                {amount.length > 0 ? `${last} ${amount} ${unit}` : `${last} ${unit}`}
              </FilterChipToggle>
            )
          })}
        </div>
      </>
    )

    const whenAmountChange = (value: number) => {
      const durationKey = props.unit ?? 'minutes'
      props.whenSelect({ [durationKey]: value })
    }

    const whenUnitChange = (value?: AcceptableValue | AcceptableValue[]) => {
      const _unit = getUnitFromDuration(props.from, 'first') || 'minutes'

      if (!_unit || !value || Array.isArray(value)) {
        return
      }

      const unit = value as keyof Duration
      props.whenSelect({ [unit]: props.from[_unit] })
    }

    const renderCustom = () => {
      const durationKey = props.unit ?? 'minutes'

      return (
        <>
          <span class="text-base font-medium mt-[8px]">Custom preset</span>
          <span class="text-muted-foreground">{customLastLabel.value}</span>
          <div class="grid grid-cols-[180px_1fr] gap-[8px]">
            <NumberField
              value={props.from[durationKey] as number}
              whenChange={whenAmountChange}
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput placeholder={'count'} />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <Select value={props.unit} whenValueChange={whenUnitChange}>
              <SelectTrigger>
                <SelectValue placeholder={'days'}>{customUnitLabel.value}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map(option => (
                  <SelectItem
                    key={option}
                    value={option}
                  >
                    {props.amount === 1 ? option.slice(0, -1) : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div >
        </>
      )
    }

    return () => (
      <div class="flex flex-col gap-[4px]">
        {renderOptions()}
        {renderCustom()}
      </div>
    )
  }
})
