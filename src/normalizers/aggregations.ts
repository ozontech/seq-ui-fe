import { toRaw } from 'vue'

import type { SeqapiV1AggregationBucketDto } from '@/api/generated/seq-ui-server'
import { isEmptyDuration } from '@/helpers/duration'

export type NormalizedAggregationType = {
	total: number
	aggregation: {
		name: string
		result: number
		quantiles?: number[]
	}[]
}

export const normalizeAggregation = (aggregation?: SeqapiV1AggregationBucketDto[]) => {
	return aggregation?.reduce<NormalizedAggregationType>((acc, cur) => {
		const name = cur.key || ''
		const result = cur.value || 0
		acc.total += result
		acc.aggregation.push({
			name,
			result,
			quantiles: cur.quantiles,
		})
		return acc
	}, {
		total: 0,
		aggregation: [],
	}) || {
		total: 0,
		aggregation: [],
	}
}

export const normalizeQuantiles = (quantiles: number[]) => {
	if (!quantiles.length) {
		return {
			0: '',
		}
	}

	return quantiles.reduce<Record<number, string>>((acc, val, i) => {
		acc[i] = String(val)
		return acc
	}, {})
}

export type AggregationData = ReturnType<typeof normalizeAggregation>['aggregation']

// ToDo!!!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeAggregationList = (aggregations: any) => {
	const aggregationsList = toRaw(aggregations)
	const aggs = []

  for (const agg of aggregationsList) {
		aggs.push({
			field: agg.field,
			fn: agg.fn,
			...agg.width ? { width: agg.width } : {},
			...agg.height ? { height: agg.height } : {},
			...agg.groupBy ? { groupBy: agg.groupBy } : {},
			...agg.quantiles ? { quantiles: agg.quantiles } : {},
			...agg.query ? { query: agg.query } : {},
			...!isEmptyDuration(agg.from) ? { from: agg.from } : {},
			...!isEmptyDuration(agg.to) ? { to: agg.to } : {},
			...agg.rangeType ? { rangeType: agg.rangeType } : {},
			...agg.showType ? { showType: agg.showType } : {},
		})
	}

	return aggs
}
