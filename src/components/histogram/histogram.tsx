import { prop } from "@fe/prop-types";
import { defineComponent } from "vue";
import { HistogramChart, type HistogramChartProps } from '@ozon-o11y-ui/charts'
import { formatDate, useDark } from "@vueuse/core";

const props = {
  data: prop<HistogramChartProps['data']['dataset']>().required(),
  timeParams: prop<HistogramChartProps['timeParams']>().optional(),
  whenZoom: prop<(from: number, to: number) => void>().required(),
}

export const Histogram = defineComponent({
  name: 'HistogramChart',
  props,
  setup(props) {
    const renderPlaceholder = () => (
      <div class="w-full h-full flex justify-center items-center text-sm text-muted-foreground">
        Data doesn't requested
      </div>
    )

    const isDark = useDark()

    const renderHistogram = () => (
      <HistogramChart
        data={{
          dataset: props.data
        }}
        timeParams={props.timeParams}
        height={300}
        colors={{ scaleLabel: isDark.value ? 'white' : 'black'}}
        renderTooltip={(timestamp, points) => (
          <div class={'flex flex-col background border bg-card text-card-foreground shadow p-2 rounded-l text-xs'}>
            <span>{formatDate(new Date(timestamp * 1000), 'ddd DD MMM YYYY HH:mm:ss.SSS')}</span>
            <span>{points[0].value}</span>
          </div>
        )}
      />
    )

    return () => props.data.length ? renderHistogram() : renderPlaceholder()
  }
})
