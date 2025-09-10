import { defineComponent } from "vue";
import { Play } from "lucide-vue-next";
import { prop } from "@/lib/prop";
import { Button } from "@/ui";
import type { Duration } from '@/types/duration'

import { ExpressionInput } from "../expression-input";
import { DurationPicker } from "../duration-picker";
import { AddWidget } from "../add-widget";
import type { SeqapiV1AggregationFuncDto } from "@/api/generated/seq-ui-server";

const props = {
  from: prop<Duration>().required(),
  to: prop<Duration>().required(),
  expression: prop<string>().required(),
  fields: prop<string[]>().required(),
  functions: prop<SeqapiV1AggregationFuncDto[]>().required(),
  // toggleHistogram: prop<() => void>().required(),
  whenExpressionChange: prop<(expression: string) => void>().required(),
  whenIntervalChange: prop<(from: Duration, to: Duration) => void>().required(),
  whenSubmit: prop<(value: string) => void>().required(),
}

export const LogControls = defineComponent({
  name: 'LogControls',
  props,
  setup(props) {
    const renderExpressionInput = () => (
      <ExpressionInput
        placeholder="message:error"
        value={props.expression}
        whenChange={props.whenExpressionChange}
        whenEnter={props.whenSubmit}
      />
    )

    const renderMainControls = () => (
      <div class="flex gap-[12px]">
        <DurationPicker
          from={props.from}
          to={props.to}
          whenChange={props.whenIntervalChange}
        />
        <Button
          whenClick={() => props.whenSubmit(props.expression)}
        >
          <Play size={16} /> Search
        </Button>
      </div>
    )

    const renderAdditionalControls = () => (
      <div class="flex gap-[12px]">
        <AddWidget
          fields={props.fields}
          functions={props.functions}
        // whenHistogramClick={props.toggleHistogram}
        />
      </div>
    )

    return () => (
      <div class="flex flex-col gap-[16px]">
        {renderExpressionInput()}
        <div class="flex justify-between gap-[12px]">
          {renderAdditionalControls()}
          {renderMainControls()}
        </div>
      </div>
    )
  }
})
