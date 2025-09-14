import { prop } from "@fe/prop-types";
import { defineComponent } from "vue";
import { HistogramChart, type ChartRenderTooltip, type HistogramChartProps } from '@ozon-o11y-ui/charts'
import { useDark } from "@vueuse/core";
import { formatDate, secondsToMilliseconds } from 'date-fns'

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

    const renderTooltip: ChartRenderTooltip = (timestamp, points) => {
      const active = points[0]
      const formattedDate = formatDate(secondsToMilliseconds(timestamp), 'dd MMMM yyyy, HH:mm:ss')

      if (!active) {
        return null
      }

      return (
        <div class='font-normal text-[13px] leading-4 tracking-[0] flex flex-col gap-1 bg-white elevation p-2 rounded-lg'>
          <span class='font-semibold text-[13px] leading-4 tracking-[0]'>value: {active.value}</span>
          <span class='font-normal text-[11px] leading-3 tracking-[0] mt-1;'>{formattedDate}</span>
        </div>
      )
    }

    const renderHistogram = () => (
      <HistogramChart
        data={{
          dataset: props.data
        }}
        timeParams={props.timeParams}
        height={300}
        colors={{ scaleLabel: isDark.value ? 'white' : 'black'}}
        renderTooltip={renderTooltip}
      />
    )

    return () => props.data.length ? renderHistogram() : renderPlaceholder()
  }
})
