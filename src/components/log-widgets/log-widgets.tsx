import { prop } from "@fe/prop-types";
import { computed, defineComponent } from "vue";

import type { AggregationsState } from "~/composables/aggregations";
import type { HistogramState } from "~/composables/use-histogram";
import type { IntervalState } from "~/composables/use-interval";

import { Widget } from "../widget";
import { Histogram } from "../histogram";
import { getClosestPrettyTime } from "~/helpers/closest-pretty-time";
import { AggregationList } from "~/components/aggregations";
import { useTokensStore } from "~/stores/tokens";
import { storeToRefs } from "pinia";

const props = {
  histogram: prop<HistogramState>().required(),
  aggregations: prop<AggregationsState>().required(),
  interval: prop<IntervalState>().required(),
}

export const LogWidgets = defineComponent({
  name: 'LogWidgets',
  props,
  setup(props) {
    const tokens = useTokensStore()
    const { keywords } = storeToRefs(tokens)

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

    const options = computed(() => {
      return keywords.value.map(({ name = '' }) => ({
        value: name,
        label: name,
      }))
    })

    const fnOptions = computed(() => {
      return props.aggregations.aggregationFns.map((fn) => ({
        value: fn,
        label: fn,
      }))
    })

    const handleZoom = (from: number, to: number) => {
      props.interval.setInterval({ date: new Date(from) }, { date: new Date(to) })
    }

    return () => (
      <>
        {
          props.histogram.visible.value && (
            <Widget
              renderTitle={() => <span class="text-base font-semibold">Messages count</span>}
              whenDelete={() => props.histogram.changeVisibility(false)}
            >
              <Histogram
                timeParams={timeParams.value}
                data={dataset.value}
                whenZoom={handleZoom}
              />
            </Widget>
          )
        }
        <AggregationList
          error={props.aggregations.error.value}
          aggregations={props.aggregations.aggregations.value}
          data={props.aggregations.aggregationsData.value}
          options={options.value}
          fnOptions={fnOptions.value}
					intervalParams={{
						from: props.interval.from.value,
						to: props.interval.to.value,
					}}
          whenSetAggregationEditIndex={props.aggregations.setAggregationEditIndex}
          whenChangeOrder={props.aggregations.changeOrder}
          whenUpdate={props.aggregations.updateAggregation}
          whenSave={props.aggregations.saveAggregation}
          whenDelete={props.aggregations.deleteAggregation}
        />
      </>
    )
  }
})
