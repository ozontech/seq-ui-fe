import { prop } from "@/lib/prop";
import type { Duration } from "@/types/duration";
import type { Timezone } from "@/types/timezone";
import { defineComponent } from "vue";
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
    return () => (
      <div class="flex flex-col gap-[8px]">
        <div class="flex flex-col gap-[4px]">
          <span class="text-muted-foreground">С</span>
          <DateTimePicker
            timezone={props.timezone.name}
            value={props.from.date}
            whenChange={(date) => props.whenChange({ date }, props.to)}
          />
        </div>

        <div class="flex flex-col gap-[4px]">
          <span class="text-muted-foreground">По</span>
          <DateTimePicker
            timezone={props.timezone.name}
            value={props.to.date}
            whenChange={(date) => props.whenChange(props.from, { date })}
          />
        </div>
      </div >
    )
  },
})
