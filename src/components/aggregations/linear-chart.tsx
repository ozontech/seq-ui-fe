import { prop } from '@fe/prop-types'
import { computed, defineComponent } from 'vue'
import { LinearChart, zoomPlugin } from '@ozon-o11y-ui/charts'
import type { ChartRenderLegend, ChartRenderTooltip, LinearChartData } from '@ozon-o11y-ui/charts'
import { formatDate, secondsToMilliseconds } from 'date-fns'

import styles from './chart.module.css'
import { AggregationLinearChartLegend } from './linear-chart-legend'

import type { AggregationTSData } from '~/normalizers/aggregations'
import { LINEAR_CHART_POINTS_LIMIT } from '~/constants/search'
import type { LinearChartType } from '~/constants/aggregation'
import type { Duration } from '~/types/duration'
import { durationToISOString } from '~/helpers/duration'
import { getClosestPrettyTime } from '~/helpers/closest-pretty-time'
import { Minus } from 'lucide-vue-next'

const props = {
  field: prop<string>().required(),
  data: prop<AggregationTSData>().required(),
  type: prop<LinearChartType>().optional('default'),
  from: prop<Duration>().optional(),
  to: prop<Duration>().optional(),
  fullHeight: prop<boolean>().optional(),
  whenZoom: prop<(params: { from: Date; to: Date }) => void>().optional(),
}

const HEIGHTS = {
  DEFAULT: 270,
  LEGEND: 320,
  DEFAULT_FULL: 370,
}

export const AggregationLinearChart = defineComponent({
  name: 'AggregationLinearChart',
  props,
  setup(props) {
    const interval = computed(() => {
      return {
        from: props.from ? durationToISOString(props.from) : null,
        to: props.to ? durationToISOString(props.to) : null,
      }
    })

    const chartData = computed((): LinearChartData[] => props.data.map((item) => ({
      label: item.name,
      dataset: item.result,
    })))

    const timeParams = computed(() => {
      const { from, to } = interval.value

      if (!from || !to) {
        return
      }

      const step = getClosestPrettyTime({
        from,
        to,
        count: LINEAR_CHART_POINTS_LIMIT,
      })[0]

      return {
        min: new Date(from).setMilliseconds(0),
        max: new Date(to).setMilliseconds(0),
        step,
      }
    })

    const renderTooltip: ChartRenderTooltip = (timestamp, points) => {
      const active = points.find((point) => point.hovered)
      const formattedDate = formatDate(secondsToMilliseconds(timestamp), 'dd MMMM yyyy, HH:mm:ss')

      if (!active) {
        return null
      }

      return (
        <div class={styles.tooltip}>
          <div class={styles.tooltipLabel}>
            <Minus style={{ color: active.color }}/>
            <span>{active.label}</span>
          </div>
          <span class={styles.tooltipValue}>value: {active.value}</span>
          <span class={styles.tooltipTime}>{formattedDate}</span>
        </div>
      )
    }

    const renderLegend: ChartRenderLegend = (chartApi) => (
      <AggregationLinearChartLegend
        field={props.field}
        data={props.data}
        chartApi={chartApi}
        type={props.type}
      />
    )

    const xMinMax = computed(() => {
      if (timeParams.value) {
        return {
          min: timeParams.value.min / 1000,
          max: timeParams.value.max / 1000,
        }
      }

      if (chartData.value.length === 0) {
        return { min: 0, max: 0 }
      }

      const min = chartData.value[0].dataset.at(1)?.timestamp ?? 0
      const max = chartData.value[0].dataset.at(-1)?.timestamp ?? 0

      return { min, max }
    })

    const whenZoom = (fromSeconds: number, toSeconds: number) => {
      const { min, max } = xMinMax.value

      if (max === min) {
        return
      }

      if (fromSeconds !== min && toSeconds !== max) {
        const from = new Date(secondsToMilliseconds(fromSeconds))
        const to = new Date(secondsToMilliseconds(toSeconds))

        props.whenZoom?.({ from, to })
      }
    }

    return () => (
      <div class={styles.linearChartWrap}>
          <LinearChart
            class={styles.linearChart}
            timeParams={timeParams.value}
            stacked={props.type === 'stacked'}
            averageParams={{
              enabled: props.type === 'average'
            }}
            data={chartData.value}
            height={HEIGHTS.DEFAULT}
            colors={{
              tick: 'transparent',
              gridLine: '#1E37691A',
              scaleLabel: '#001122A8',
              averageLine: '#F88F14',
            }}
            renderTooltip={renderTooltip}
            renderLegend={renderLegend}
            plugins={[zoomPlugin(whenZoom)]}
          />
      </div>
    )
  },
})
