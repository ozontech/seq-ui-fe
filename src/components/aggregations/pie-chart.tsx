import { defineComponent, computed } from 'vue'
import { prop } from '@fe/prop-types'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import type { TooltipItem, ChartTypeRegistry, ChartOptions } from 'chart.js'

import styles from './chart.module.css'
import {
	PIE_CHART_COLOR_DEBUG,
	PIE_CHART_COLOR_ERROR,
	PIE_CHART_COLOR_INFO,
	PIE_CHART_COLOR_NEUTRAL,
	PIE_CHART_COLOR_OTHER,
	PIE_CHART_COLOR_SUCCESS,
	PIE_CHART_COLOR_WARNING,
	RANDOM_OZI_COLORS,
} from './chart-colors'

import { LEVELS } from '~/constants/levels'
import { getDecimalPercent } from '~/helpers/percents'
import { formatNumber } from '~/helpers/format-number'


const MIN_PERCENT = 1

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export const AggregationPieChart = defineComponent({
	name: 'AggregationPieChart',
	props: {
		data: prop<({
			name: string
			result: number
			quantiles?: number[]
		}[] | null)>().optional(),
		radius: prop<number>().optional(100),
		total: prop<number>().optional(0),
	},

	setup(props) {
		const total = computed(() => props.total || props.data?.reduce((acc, item) => {
			return acc + item.result
		}, 0))
		const options: ChartOptions<'pie'> = {
			responsive: true,
			borderColor: 'transparent',
			radius: props.radius,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					callbacks: {
						label: function (context: TooltipItem<keyof ChartTypeRegistry>) {
							let value = 0
							if (context.parsed) {
								value = context.parsed
							}
							const percent = getDecimalPercent(value, total.value) || 0
							return `${formatNumber(value)} (${percent}%)`
						},
						title: function (context: TooltipItem<'pie'>[]) {
							let label = context[0].label || ''
							if (LEVELS[Number(label)]) {
								label = LEVELS[Number(label)]
							}
							return label
						},
					},
				},
			},
		}

		const preparedData = computed(() => {
			const reduced = (props.data || []).reduce((acc, item) => {
				const percent = getDecimalPercent(item.result, total.value) || 0
				if (percent > MIN_PERCENT) {
					acc.data.push(item.result)
					acc.labels.push(item.name)
				} else {
					acc.others += item.result
				}

				return acc
			}, {
				data: [] as number[],
				value: [] as number[],
				labels: [] as string[],
				others: 0,
				othersValue: 0,
			})

			const result = {
				data: reduced?.data,
				labels: reduced?.labels,
			}

			if (reduced.others > 0) {
				result.data.push(reduced.others)
				result.labels.push('other')
			}

			return result
		})

		const colors: string[] = preparedData.value.labels.map((name, index) => {
			switch (name) {
				case '0':
				case '1':
				case '2':
				case '3':
					return PIE_CHART_COLOR_ERROR
				case '4':
					return PIE_CHART_COLOR_WARNING
				case '5':
					return PIE_CHART_COLOR_SUCCESS
				case '6':
					return PIE_CHART_COLOR_INFO
				case '7':
					return PIE_CHART_COLOR_DEBUG
				case '_not_exists':
					return PIE_CHART_COLOR_NEUTRAL
				case 'other':
					return PIE_CHART_COLOR_OTHER
				default:
					return RANDOM_OZI_COLORS[index % RANDOM_OZI_COLORS.length]
			}
		})

		const renderLegend = () => {
			return preparedData.value.labels.map((item, index) => (
				<div class={styles.legendItem} key={item}>
					<div class={styles.legendItemColor} style={`background-color: ${colors[index]}`}></div>
					<div class={styles.legendItemText}>{item}</div>
				</div>
			))

		}

		const chartData = computed(() => ({
			labels: preparedData.value.labels,
			datasets: [{
				data: preparedData.value.data.map((item) => Number(item.toFixed(2))),
				backgroundColor: colors,
				hoverOffset: 4,
			}],
			maintainAspectRatio: true,
		}))

		return () => (
			<div
				class={styles.container}
				style={{ '--pie-radius': `${props.radius}px` }}
			>
				<Pie
					options={options}
					data={chartData.value}
				/>
				<div class={styles.legend}>
					{renderLegend()}
				</div>
			</div>
		)
	},
})
