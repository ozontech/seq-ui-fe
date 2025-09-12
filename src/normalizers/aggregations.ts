import { toRaw } from 'vue'

import type { SeqapiV1AggregationBucketDto, SeqapiV1AggregationSeriesDto } from '@/api/generated/seq-ui-server'
import { isEmptyDuration } from '@/helpers/duration'
import { values } from 'ramda'

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

export type NormalizedAggregationTSType = {
	total: number
	aggregation: {
		name: string
		result: { timestamp: number;value: number }[]
	}[]
}

export const normalizeAggregationTS = (
	series?: SeqapiV1AggregationSeriesDto[],
): NormalizedAggregationTSType => {
	const arr = (series ?? [])
	const total = arr.length
	const aggregation = arr.map(({ metric = {}, values: dataset = [] }) => {
		const { quantile, ...rest } = metric
		const fieldValue = values(rest)[0]

		return {
			name: quantile ? `${fieldValue} (${quantile})` : fieldValue,
			result: dataset.map((datasetItem) => ({
				timestamp: datasetItem.timestamp ?? 0,
				value: datasetItem.value ?? 0,
			})),
		}
	})

	return { total, aggregation }
}

export type AggregationTSData = ReturnType<typeof normalizeAggregationTS>['aggregation']

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
