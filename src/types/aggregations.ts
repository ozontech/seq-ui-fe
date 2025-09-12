import type { Duration } from '@/types/duration'
import type { SeqapiV1AggregationFuncDto } from '@/api/generated/seq-ui-server'
import type { AggregationData, AggregationTSData } from '@/normalizers/aggregations'

export type FunctionKeys = 'count' | 'max'
export type RangeType = 'relative' | 'absolute'
export type AggregationShowType = 'table' | 'chart' | 'linear-chart'

export type Aggregation = {
	field: string
	fn: SeqapiV1AggregationFuncDto
	width?: number
	updatedAt?: Date
	height?: number
	groupBy?: string
	quantiles?: number[]
	total?: number
	data?: AggregationData | AggregationTSData | null
	query?: string
	from?: Duration
	to?: Duration
	rangeType?: RangeType
	showType?: AggregationShowType
	interval?: string
}

export type GroupedAggregations = {
	query?: string
	from?: Duration
	to?: Duration
	rangeType?: RangeType
	field: string
	fn: SeqapiV1AggregationFuncDto
	updatedAt?: Date
	width?: number
	height?: number
	groupBy?: string
	quantiles?: number[]
	data?: AggregationData | AggregationTSData | null
	aggregations: Aggregation[]
	showType?: AggregationShowType
}

export type SaveAggregationBody = {
	field: string
	groupBy?: string
	fn: SeqapiV1AggregationFuncDto
	index: number
	quantiles?: number[]
	shouldIgnorUpdate?: boolean
	query?: string
	from?: Duration
	to?: Duration
	rangeType?: RangeType
	showType?: AggregationShowType
	total?: number
}

export type PickedAggregationKeys = keyof Pick<Aggregation, 'fn' | 'height' | 'width' | 'updatedAt' | 'field' | 'groupBy' | 'quantiles'>
