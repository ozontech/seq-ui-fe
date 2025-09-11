import { prop } from "@fe/prop-types";
import type { Duration } from "@/types/duration";
import type { Timezone } from "@/types/timezone";
import { computed, defineComponent } from "vue";
import { DateTimePicker } from "./date-time-picker";

const props = {
  from: prop<Duration>().required(),
  to: prop<Duration>().required(),
  timezone: prop<Timezone>().required(),
  whenChange: prop<(from: Duration, to: Duration) => void>().required(),
}
export const AbsolutePicker = defineComponent({
  name: 'AbsolutePicker',
  props,
  setup(props) {
    const invalidFrom = computed(() => {
      return !!props.to.date && !props.from.date
    })

    const invalidTo = computed(() => {
      const emptyTo = !!props.from.date && !props.to.date
      const more = !!props.from.date && !!props.to.date && props.from.date.getTime() < props.to.date.getTime()

      return emptyTo || !!props.from.date && !!props.to.date && !more
    })

    return () => (
      <div class="flex flex-col gap-[8px]">
        <div class="flex flex-col gap-[4px]">
          <span class="text-muted-foreground">From</span>
          <DateTimePicker
            timezone={props.timezone.name}
            value={props.from.date}
            invalid={invalidFrom.value}
            whenChange={(date) => props.whenChange({ date }, props.to)}
          />
        </div>

        <div class="flex flex-col gap-[4px]">
          <span class="text-muted-foreground">To</span>
          <DateTimePicker
            timezone={props.timezone.name}
            value={props.to.date}
            invalid={invalidTo.value}
            whenChange={(date) => props.whenChange(props.from, { date })}
          />
        </div>
      </div >
    )
  },
})
