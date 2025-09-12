import { ChartLine, ChartPie, Sheet } from "lucide-vue-next";
import { values } from "ramda";

export const AGGREGATION_TYPES = [
  {
    id: 'table',
    Icon: Sheet,
    name: 'Table',
  },
  {
    id: 'pie-chart',
    Icon: ChartPie,
    name: 'Pie chart',
  },
  {
    id: 'linear-chart',
    Icon: ChartLine,
    name: 'LinearChart',
  },
] as const


export const LINEAR_CHART_TYPE_MAP = {
	default: {
		id: 'default',
		label: 'Linear',
		// icon: chart-line,
	},
	stacked: {
		id: 'stacked',
		label: 'Linear with fill',
		// icon: chart-area,
	},
	average: {
		id: 'average',
		label: 'Linear with average',
		// icon: chart-no-axes-combined,
	},
} as const

export type LinearChartType = keyof typeof LINEAR_CHART_TYPE_MAP

export const LINEAR_CHART_TYPE_OPTIONS = values(LINEAR_CHART_TYPE_MAP)
