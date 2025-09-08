import { defineComponent } from "vue";
import { Play } from "lucide-vue-next";
import { prop } from "@/lib/prop";
import { Button } from "@/ui";
import type { Duration } from '@/types/duration'

import { ExpressionInput } from "../expression-input";
import { DurationPicker } from "../duration-picker";

const props = {
  from: prop<Duration>().required(),
  to: prop<Duration>().required(),
  expression: prop<string>().required(),
  whenExpressionChange: prop<(expression: string) => void>().required(),
  whenIntervalChange: prop<(from: Duration, to: Duration) => void>().required(),
  whenSubmit: prop<(value: string) => void>().required(),
}

export const LogControls = defineComponent({
  name: 'LogControls',
  props,
  setup(props) {
    return () => (
      <div class="flex flex-col gap-[16px]">
        <ExpressionInput
          placeholder="message:error"
          value={props.expression}
          whenChange={props.whenExpressionChange}
          whenEnter={props.whenSubmit}
        />
        <div class="flex justify-end gap-[12px]">
          <DurationPicker
            from={props.from}
            to={props.to}
            whenChange={props.whenIntervalChange}
          />
          <Button
            class="cursor-pointer"
            whenClick={props.whenSubmit}
          >
            <Play size={16} />Выполнить запрос
          </Button>
        </div>
      </div>
    )
  }
})
