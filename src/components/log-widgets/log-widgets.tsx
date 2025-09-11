import { prop } from "@fe/prop-types";
import { computed, defineComponent } from "vue";

import type { AggregationsState } from "@/composables/use-aggregations";
import type { HistogramState } from "@/composables/use-histogram";
import type { IntervalState } from "@/composables/use-interval";

import { Widget } from "../widget";
import { Histogram } from "../histogram";
import { getClosestPrettyTime } from "@/helpers/closest-pretty-time";

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

    const dataset = computed(() => (
        Array.from({ length: props.histogram.state.value.x.length })
        .map((_, i) => ({
          timestamp: Number(props.histogram.state.value._x[i]) / 1000,
          value: props.histogram.state.value.y[i],
        })
      )
    ))

    const timeParams = computed(() => {
      const { from, to} = props.interval.toDates()

      return {
        min: new Date(from).getTime(),
        max: new Date(to).getTime(),
        step: getClosestPrettyTime({from, to, count: 30})[0]
      }
    })


    return () => (
      <>
        {props.histogram.visible.value && (
          <Widget
            renderTitle={() => <span class="text-base font-semibold">Messages count</span>}
            whenDelete={() => props.histogram.changeVisibility(false)}
          >
            <Histogram
              timeParams={timeParams.value}
              whenZoom={whenZoom}
              data={dataset.value}
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
