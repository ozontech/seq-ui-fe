import { prop } from "@/lib/prop";
import { defineComponent } from "vue";

import type { AggregationsState } from "@/composables/use-aggregations";
import type { HistogramState } from "@/composables/use-histogram";
import type { IntervalState } from "@/composables/use-interval";

import { Widget } from "../widget";
import { Histogram } from "../histogram";

const props = {
  histogram: prop<HistogramState>().required(),
  aggregations: prop<AggregationsState>().required(),
  interval: prop<IntervalState>().required(),
}

export const LogWidgets = defineComponent({
  name: 'LogWidgets',
  props,
  setup(props) {
    const whenZoom = (from: number, to: number) => {
      props.interval.setInterval({ date: new Date(from) }, { date: new Date(to) })
    }

    return () => (
      <>
        {props.histogram.visible.value && (
          <Widget
            renderTitle={() => <span class="text-base font-semibold">Messages count</span>}
            whenDelete={() => props.histogram.changeVisibility(false)}
          >
            <Histogram
              whenZoom={whenZoom}
            />
          </Widget>
        )}
        {props.aggregations.list.value.map((agg, index) => (
          <Widget
            key={index}
            renderTitle={(() => <span>title</span>)}
          >
            <div >aggregation {index}</div>
          </Widget>
        ))}
      </>
    )
  }
})
