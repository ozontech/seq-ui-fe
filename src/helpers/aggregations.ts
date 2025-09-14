import { SeqapiV1AggregationFuncDto } from '~/api/generated/seq-ui-server'
import type { AggregationData, AggregationTSData } from '~/normalizers/aggregations'

export const isAggregationFn = (fn: string): fn is SeqapiV1AggregationFuncDto => {
	return Object.values(SeqapiV1AggregationFuncDto).includes(fn as SeqapiV1AggregationFuncDto)
}

export const isTimeseriesAggregation = (
	data?: AggregationData | AggregationTSData | null,
): data is AggregationTSData => {
	const arr = data ?? []
	return arr.length > 0 && Array.isArray(arr[0].result)
}
