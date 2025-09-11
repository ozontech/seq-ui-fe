import { prop } from "@fe/prop-types";
import { computed, defineComponent, ref } from "vue";
import type { Duration } from '@/types/duration'
import type { Timezone } from "@/types/timezone";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/ui";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useTimezoneStore } from "@/stores/timezone";
import { DurationPickerTrigger } from "./duration-picker-trigger";
import { durationToAbsolute } from "@/helpers/duration";
import { DurationPickerContent } from "./duration-picker-content";

const props = {
  from: prop<Duration>().required(),
  to: prop<Duration>().required(),
  timezone: prop<Timezone>().optional(),
  whenChange: prop<(from: Duration, to: Duration) => void>().required(),
}

export const DurationPicker = defineComponent({
  name: 'DurationPicker',
  props,
  setup(props) {
    const timezoneStore = useTimezoneStore()

    const open = ref(false)

    const whenOpenChange = (state: boolean) => {
      open.value = state
    }

    const timezone = computed(() => {
      return props.timezone ?? timezoneStore.timezone
    })

    const whenStepClick = (type: 'left' | 'right') => () => {
      const interval = durationToAbsolute(props.from, props.to)
      const timeOffset = Math.abs(interval.from.getTime() - interval.to.getTime()) / 2
      const multiplier = type === 'left' ? -1 : 1

      const from = { date: new Date(interval.from.getTime() + multiplier * timeOffset) }
      const to = { date: new Date(interval.to.getTime() + multiplier * timeOffset) }

      props.whenChange(from, to)
    }

    return () => (
      <div class="flex gap-[2px]">
        <Button
          class="rounded-l-md rounded-r-none"
          variant="outline"
          whenClick={whenStepClick('left')}
        >
          <ChevronLeft />
        </Button>

        <Popover open={open.value} whenOpenChange={whenOpenChange}>
          <PopoverTrigger>
            <DurationPickerTrigger
              from={props.from}
              to={props.to}
              timezone={timezone.value}
            />
          </PopoverTrigger>
          <PopoverContent class="w-[710px] p-0">
            <DurationPickerContent
              from={props.from}
              to={props.to}
              timezone={timezone.value}
              whenChange={props.whenChange}
              whenClose={() => whenOpenChange(false)}
            />
          </PopoverContent>
        </Popover>

        <Button
          class="rounded-l-none rounded-r-md"
          variant="outline"
          whenClick={whenStepClick('right')}
        >
          <ChevronRight />
        </Button>
      </div>
    )
  }
})
