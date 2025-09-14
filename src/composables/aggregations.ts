import { ref, computed, toRaw, type Ref } from 'vue'
import { chunk } from 'lodash'
import { is } from 'ramda'

import type { Aggregation, GroupedAggregations, PickedAggregationKeys, SaveAggregationBody } from '~/types/aggregations'
import { getApi } from '~/api/client'
import { addRequestDelay } from '~/helpers/add-request-delay'
import { SeqapiV1AggregationFuncDto } from '~/api/generated/seq-ui-server'
import { durationToISOString, durationToSeconds, isEmptyDuration } from '~/helpers/duration'
import type { IntervalState } from '~/composables/use-interval'
import { getClosestPrettyTime } from '~/helpers/closest-pretty-time'
import { LINEAR_CHART_POINTS_LIMIT } from '~/constants/search'

const defaultFn = () => SeqapiV1AggregationFuncDto.AfCount
export type NoDataAg = Omit<Aggregation, 'data'>
type AgData = Aggregation['data']

export type AggregationsState = ReturnType<typeof useAggregations>

export const useAggregations = (
  interval: IntervalState,
  query: Ref<string>
) => {
	const aggs: Pick<Aggregation, PickedAggregationKeys>[] = []
	const aggregations = ref<NoDataAg[]>(aggs)

	const filteredAggregations = computed(() => {
		return aggregations.value.filter((ag) => ag && ag.fn && (ag.field || ag.groupBy))
	})

	const error = ref<Record<number, string | undefined> | null>(null)

	const aggregationsData = ref<AgData[]>([])
	const aggregationFns = Object.values(SeqapiV1AggregationFuncDto)
	const limit = ref(5)
	const isErrorFromPreview = ref(false)
	const aggregationEditIndex = ref(-1)
	const blockIndex = ref(0)

	const hasErrors = computed(() => (
    !isErrorFromPreview.value &&
    error.value !== null &&
    Object.values(error.value).some((item) => is(String, item))
  ))

	function setAggregationEditIndex(index: number) {
		aggregationEditIndex.value = index
	}

	function setLimit(value: number) {
		limit.value = value
	}

	function setAggregationsData(value: AgData[]) {
		aggregationsData.value = value
	}

	function clearErrors(isChunk: boolean, idx?: number) {
		if (isChunk) {
			error.value = null
			return
		}

		if (idx === undefined || !error.value?.[idx]) return

		error.value[idx] = undefined
	}

	function changeOrder(aggs: Aggregation[]) {
		aggregations.value = aggs
		aggregationsData.value = aggs.map((agg) => {
			return agg?.data
		})
	}

	function addAggregation({
		field,
		fn,
		height,
		width,
		updatedAt,
		groupBy,
		data,
		quantiles,
		query,
		from,
		to,
		rangeType,
		showType,
	}: Aggregation) {
		aggregations.value.push({
			field,
			fn,
			height,
			width,
			updatedAt,
			groupBy,
			quantiles,
			query,
			from,
			to,
			rangeType,
			showType,
		})
		aggregationsData.value.push(data)
	}

	function deleteAggregation(index: number) {
		clearErrors(false, index)
		isErrorFromPreview.value = false
		aggregations.value = aggregations.value.filter((_, idx) => idx !== index)
		aggregationsData.value = aggregationsData.value.filter((_, idx) => idx !== index)
	}

	function updateAggregation({
		index,
		fn,
		height,
		width,
		field,
		groupBy,
		quantiles,
		query,
		from,
		to,
		rangeType,
		showType,
	}: Aggregation & { index: number }) {
		clearErrors(false, index)
		isErrorFromPreview.value = false
		aggregations.value = aggregations.value.map((ag, idx) => {
			return idx === index ? {
				...ag,
				fn: fn ?? ag.fn,
				field: field ?? ag.field,
				height: height ?? ag.height,
				width: width ?? ag.width,
				updatedAt: new Date(),
				groupBy: groupBy ?? ag.groupBy,
				quantiles: quantiles ?? ag.quantiles,
				query: query ?? ag.query,
				from: from ?? ag.from,
				to: to ?? ag.to,
				rangeType: rangeType ?? ag.rangeType,
				showType: showType ?? ag.showType,
			} : ag
		})
	}

	async function fetchAggregation({
		field,
		fn,
		groupBy,
		quantiles,
		showType,
	}: Aggregation, index?: number) {
		clearErrors(false, index)

		const { from, to } = interval.toDates()
		const prettyTimeInterval = getClosestPrettyTime({ from, to, count: LINEAR_CHART_POINTS_LIMIT })[0]

		const result = await getApi().seqUiServer.fetchAggregation({
			query: query.value,
			from,
			to,
			index,
			aggregations: [
				{
					field,
					group_by: groupBy || undefined,
					agg_func: fn || defaultFn(),
					quantiles: fn === SeqapiV1AggregationFuncDto.AfQuantile ? quantiles : undefined,
					interval: `${prettyTimeInterval}ms`,
				},
			],
			timeseries: showType === 'linear-chart',
		})

		if (result?.error && is(String, result.error) && index !== undefined) {
			error.value = {
				...error.value,
				[index]: result.error,
			}
		}

		return result?.data
	}

	async function fetchIndependentAggregation(
		aggregation: GroupedAggregations,
		index?: number,
	) {
		clearErrors(false, index)
		const { from, to, aggregations, showType } = aggregation
		const rawInterval = interval.toDates()
		const requestFrom = isEmptyDuration(from) ? rawInterval.from : durationToISOString(from)
		const requestTo = isEmptyDuration(to) ? rawInterval.to : durationToISOString(to)

		const prettyTimeInterval = getClosestPrettyTime({
			from: requestFrom,
			to: requestTo,
			count: LINEAR_CHART_POINTS_LIMIT,
		})[0]

		const body = {
			query: aggregation.query || query.value,
			from: requestFrom,
			to: requestTo,
			index,
			aggregations: aggregations.map((agg) => ({
				field: agg.field,
				group_by: agg.groupBy || undefined,
				agg_func: agg.fn || defaultFn(),
				interval: `${prettyTimeInterval}ms`,
				quantiles: agg.fn === SeqapiV1AggregationFuncDto.AfQuantile ? agg.quantiles : undefined,
			})),
			timeseries: showType === 'linear-chart',
		}

		const result = await getApi().seqUiServer.fetchAggregation(body)

		if (result?.error && is(String, result.error) && index !== undefined) {
			error.value = {
				...error.value,
				[index]: result.error,
			}
		}

		return result?.data
	}

	// TODO: надо вернуть заполнение нуллами если запрос упал
	async function fetchChunk(aggs: GroupedAggregations, chunkIndex = 0, dataLength = 1) {
		clearErrors(true)
		isErrorFromPreview.value = false
		const { from, to } = interval.toDates()
		const requestFrom = isEmptyDuration(aggs.from) ? from : durationToISOString(aggs.from)
		const requestTo = isEmptyDuration(aggs.to) ? to : durationToISOString(aggs.to)

		const prettyTimeInterval = getClosestPrettyTime({
			from: requestFrom,
			to: requestTo,
			count: LINEAR_CHART_POINTS_LIMIT,
		})[0]

		const result = await getApi().seqUiServer.fetchAggregationsChunk({
			aggs: aggs.aggregations.map((agg) => ({ ...agg, interval: `${prettyTimeInterval}ms` })),
			query: aggs.query || query.value,
			from: isEmptyDuration(aggs.from) ? from : durationToISOString(aggs.from),
			to: isEmptyDuration(aggs.to) ? to : durationToISOString(aggs.to),
			timeseries: aggs.showType === 'linear-chart',
		})

		if (result?.error && is(String, result.error)) {
			for (let i = 0; i < aggs.aggregations.length; i++) {
				error.value = {
					...error.value,
					[i]: result.error,
				}
			}
		}

		if (!result?.data) return

		result.data.forEach((aggregation, index) => {
			aggregationsData.value[chunkIndex + dataLength + index] = aggregation.aggregation
			// todo: какой ужас
			aggregations.value[chunkIndex + dataLength + index].total = aggregation.total
		})
	}

	// TODO: abort signal
	async function fetchAggregations() {
		const groupedAggregations = groupAggregations(filteredAggregations.value)
		const dataLength: number = groupedAggregations?.reduce((acc, agg) => {
			acc += agg.aggregations.length
			return acc
		}, 0)
		const groupedData: NoDataAg[] = groupedAggregations?.reduce((acc: NoDataAg[], aggr: GroupedAggregations) => {
			aggr.aggregations.forEach((agg) => acc.push({
				field: agg.field,
				fn: agg.fn,
				height: agg.height,
				width: agg.width,
				updatedAt: agg.updatedAt,
				groupBy: agg.groupBy,
				quantiles: agg.quantiles,
				query: agg.query,
				from: agg.from,
				to: agg.to,
				rangeType: agg.rangeType,
				showType: agg.showType,
			}))
			return acc
		}, [])

		aggregations.value = Array.from(groupedData)
		aggregationsData.value = Array.from(Array(dataLength))

		let i = 0
		let chunkDataLen = 0
		for (const chunk of groupedAggregations) {
			await addRequestDelay(fetchChunk(chunk, i, chunkDataLen), 1000)
			chunkDataLen += chunk.aggregations.length - 1
			i++
		}
	}

	function groupAggregations(list: Aggregation[]): GroupedAggregations[] {
		const result: Record<string, GroupedAggregations> = {}
		const finalList: GroupedAggregations[] = []

		list.forEach((item) => {
			const timeseries = item.showType === 'linear-chart'
			const key = `${item.query}_${durationToSeconds(item.from)}_${durationToSeconds(item.to)}_${timeseries}`
			if (result[key]) {
				result[key].aggregations?.push(toRaw(item))
				return
			}
			result[key] = {
				query: item.query,
				from: toRaw(item.from),
				to: toRaw(item.to),
				field: item.field,
				fn: item.fn,
				showType: item.showType,

				aggregations: [toRaw(item)],
			}
		})

		Object.values(result).forEach((res) => {
			const chunks = chunk(res.aggregations, limit.value)
			for (const chunk of chunks) {
				finalList.push({
					...res,
					aggregations: chunk,
				})
			}
		})

		return finalList
	}

	async function saveAggregation({
		field,
		fn,
		index,
		groupBy,
		quantiles,
		query,
		from,
		to,
		rangeType,
		showType,
		shouldIgnorUpdate = false,
	}: SaveAggregationBody) {
		clearErrors(false, index)
		isErrorFromPreview.value = false
		const aggregation = {
			field,
			fn,
			groupBy,
			quantiles,
			query,
			from,
			to,
			rangeType,
			showType,
		}
		aggregationsData.value[index] = undefined

		isErrorFromPreview.value = shouldIgnorUpdate

		if (!shouldIgnorUpdate) {
			updateAggregation({
				index,
				...aggregation,
			})
		}

		// todo: не запрашивать если не выполнен поиск
		const data = await fetchIndependentAggregation({
			...aggregation,
			aggregations: [aggregation],
		}, index)
		if (!data) return

		aggregationsData.value[index] = data.aggregation
		aggregations.value[index].total = data.total
	}

	async function createAggregation() {
		aggregations.value.push({
			field: '',
			fn: defaultFn(),
			showType: 'table',
		})
		aggregationsData.value.push(undefined)
		setAggregationEditIndex(aggregations.value.length - 1)
	}

	async function pushAggregation(ag: {
		field: string
		fn: SeqapiV1AggregationFuncDto
	}) {
		aggregations.value.push(ag)
		const data = await fetchAggregation(ag, aggregations.value.length - 1)
		if (!data) return

		aggregationsData.value.push(data.aggregation)

		aggregations.value[aggregations.value.length - 1].total = data.total
	}

	function setAggregations(list: Aggregation[]) {
		aggregations.value = list
	}

	function clearAggregations() {
		setAggregations([])
	}

	function clearAggregationsData() {
		setAggregationsData([])
	}

	return {
		aggregations,
		filteredAggregations,
		aggregationsData,
		aggregationFns,
		limit,
		error,
		hasErrors,
		aggregationEditIndex,
		blockIndex,

		setLimit,
		setAggregationEditIndex,
		setAggregationsData,
		setAggregations,

		changeOrder,

		createAggregation,
		addAggregation,
		updateAggregation,
		deleteAggregation,
		pushAggregation,

		clearAggregations,
		clearAggregationsData,

		saveAggregation,
		fetchAggregations,
	}
}
