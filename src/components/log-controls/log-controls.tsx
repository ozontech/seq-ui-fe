import { defineComponent } from "vue";
import { Play } from "lucide-vue-next";
import { prop } from "@fe/prop-types";

import { Button } from "@/ui";
import type { SeqapiV1AggregationFuncDto } from "@/api/generated/seq-ui-server";
import type { AggregationsState } from "@/composables/aggregations";
import type { HistogramState } from "@/composables/use-histogram";
import type { IntervalState } from "@/composables/use-interval";

import { ExpressionInput } from "../expression-input";
import { DurationPicker } from "../duration-picker";
import { AddWidget } from "../add-widget";

const props = {
  histogram: prop<HistogramState>().required(),
  aggregations: prop<AggregationsState>().required(),
  interval: prop<IntervalState>().required(),
  expression: prop<string>().required(),
  fields: prop<string[]>().required(),
  functions: prop<SeqapiV1AggregationFuncDto[]>().required(),
  whenExpressionChange: prop<(expression: string) => void>().required(),
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
          from={props.interval.from.value}
          to={props.interval.to.value}
          whenChange={props.interval.setInterval}
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
          histogram={props.histogram}
          aggregations={props.aggregations}
          fields={props.fields}
          functions={props.functions}
        />
      </div>
    )

    return () => (
      <div class="flex flex-col gap-[20px]">
        {renderExpressionInput()}
        <div class="flex justify-between gap-[12px]">
          {renderAdditionalControls()}
          {renderMainControls()}
        </div>
      </div>
    )
  }
})
