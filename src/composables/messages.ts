import { parseISO, subSeconds } from 'date-fns'
import type { RouteLocationNormalized } from 'vue-router'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty as _isEmpty, symmetricDifference } from 'ramda'
import { computedWithControl } from '@vueuse/core'

import { useTimezoneStore } from '@/stores/timezone'
import { LS_COLUMNS_KEY, useConfigStore } from '@/stores/config'
import { secondsToSingleUnitDuration, durationToSeconds, durationToISOString } from '@/helpers/duration'
import type { SeqapiV1SearchResponseDto } from '@/api/generated/seq-ui-server'
import type { Message, SearchWarning, GetRawIntervalOptions, Order } from '@/types/messages'
import type { IntervalType } from '@/types/input'
import type { Histogram } from '@/types/shared'
import { normalizeMessage, normalizeSearchWarning } from '@/normalizers/events'
import { formatHistogramDate, normalizeBuckets } from '@/normalizers/bucket'
import { getApi } from '@/api/client'
import type { FetchMessagesNormalizedData } from '@/api/services/seq-ui-server'
import { DEFAULT_LIMIT } from '@/constants/search'
import { getClosestPrettyTime } from '@/helpers/closest-pretty-time'
import { useSearchStore } from '@/stores/search'
import { pickByIndex } from '@/helpers/search'
import type { Duration } from '@/types/duration'

const normalizeResponse = (data: Pick<SeqapiV1SearchResponseDto, 'events'>) => data.events?.map((event) => normalizeMessage(event)) || []
type LastHistogram = {
	query?: string
	from?: string | number
	to?: string | number
}
const defaultHistogram = (): Histogram => ({
	x: [],
	_x: [],
	y: [],
})

export const useMessages = (id: number) => {
	const searchStore = useSearchStore()
  const route = useRoute()
	const { intervalParams, queryParams } = searchStore.getParams(id)

	const {
		from,
		to,
		rangetype,
		toDates,
		toQueryParams,
		setFrom,
		setTo,
		setInterval,
		fromUnits,
		toUnits,
	} = intervalParams

	const {
		query,
		editQuery,
	} = queryParams

	const isFetching = ref(false)

	const messages = ref<Message[]>([])
	const selectedColumns = ref<string[]>([])
	const tableFields = ref<string[]>([])
	const histogram = ref(defaultHistogram())
	const isHistogramVisible = ref(false)
	const isHistogramFetching = ref(false)
	const lastSearchFilters = ref<LastHistogram>({})
	const selectedMessage = ref<Message | null>(null)
	const hasMore = ref(false)
	/*private*/const limit = ref(DEFAULT_LIMIT)
	const firstSearch = ref(true)
	const error = ref<string | null>(null)
	const searchWarning = ref<SearchWarning>({
		title: null,
		message: '',
	})

	const isEmpty = computed(() => {
		return !isFetching.value && !error.value && messages.value.length === 0
	})

	const isWarning = computed(() => {
		return Boolean(!error.value && searchWarning.value.message)
	})
	const order = ref<Order>('desc')

	const offset = ref(0)
	const fields = ref('')
	/*private*/const service = ref('')
	const searchTime = ref<Date>()

	const searchInterval = computedWithControl(
		() => [intervalParams.from.value, intervalParams.to.value, searchTime.value],
		() => intervalParams.toDates(),
	)

	const exportLimit = ref(100_000)
	const tzStore = useTimezoneStore()

	const loadDataFromQuery = async ({ route: _route, hard }: { route?: RouteLocationNormalized; hard?: boolean }) => {
		let routeQueryValue = _route?.query
		if (!routeQueryValue) {
			routeQueryValue = route.query
		}

		const {
			from: _from,
			to: _to,
			rangetype: _rangetype,
			q: _query,
			service: _service,
			fields: _fields,
		} = pickByIndex(routeQueryValue as Record<string, string>, id)

		// we lose it when change tabs
		const loadedQuery = hard ? (_query || '') : (_query ?? query.value)
		service.value = _service ? _service as string : ''

		query.value = loadedQuery
		fields.value = _fields ? _fields as string : ''
		firstSearch.value = !service.value && _query === undefined
		const isAbsolute = _rangetype === 'absolute'
		const isRelative = _rangetype === 'relative' || !isNaN(Number(_from))
		if (isAbsolute) {
			if (_from) {
        setFrom(parseISO(_from ? _from as string : ''))
      }
			setTo(parseISO(_to ? _to as string : new Date().toISOString()))
		}
		if (isRelative) {
			const fromInDuration = _from && secondsToSingleUnitDuration(Number(_from))
			const toInDuration = secondsToSingleUnitDuration(Number(_to || 0))
			if (fromInDuration && !fromInDuration.forever) {
				from.value = fromInDuration
			}
			if (toInDuration) {
				to.value = toInDuration
			}
		}

		if (fields.value) {
			useConfigStore().setFields(fields.value.split(','))
		}

		return id
	}

	const setRelative = (arg?: { from: Duration }) => {
		if (arg) {
			from.value = arg.from
			to.value = {}
		}
	}

	function toRaw(type: IntervalType, date: Date | Duration | null) {
		const isAbsolute = (type: IntervalType, date: Date | Duration | null): date is Date => type === 'absolute'
		return isAbsolute(type, date) ? date.toISOString() : subSeconds(new Date(), durationToSeconds(date)).toISOString()
	}

	const getRawInterval = (interval: GetRawIntervalOptions) => {
		return {
			from: toRaw(interval.type, interval.from),
			to: toRaw(interval.type, interval.to),
		}
	}

	// mb no reactivity
	const shouldFetchNewHistogram = computed(() => {
		const {
			query: _query,
			from,
			to,
		} = lastSearchFilters.value
		const {
			from: currentFrom,
			to: currentTo,
		} = toDates()
		return _query !== query.value || from !== currentFrom || to !== currentTo
	})

	const setHasMoreAndPartialResponseFromData = (data?: FetchMessagesNormalizedData) => {
		searchWarning.value = normalizeSearchWarning(data)

		if (data?.events?.length !== DEFAULT_LIMIT) {
			hasMore.value = false
			return
		}
		hasMore.value = true
	}
	/*private*/const timezone = computed(() => tzStore.timezone.name)

	/*private*/const createQuery = () => {
		return query.value || ''
	}

	const fetchMessages = async () => {
		isFetching.value = true
		error.value = null
		firstSearch.value = false
		messages.value = []
		offset.value = 0
		hasMore.value = false

		searchTime.value = new Date()
		const {
			from: _from,
			to: _to,
		} = searchInterval.value

		try {
			if (isHistogramVisible.value && shouldFetchNewHistogram.value) {
				isHistogramFetching.value = true
			}
			let interval
			let intervalMs
			if (isHistogramVisible.value && shouldFetchNewHistogram.value) {
				const prettyTime = getClosestPrettyTime({
					from: _from,
					to: _to,
					count: 30,
				})
				interval = prettyTime[1]
				intervalMs = prettyTime[0]
			}

			const data = await getApi().seqUiServer.fetchMessages({
				query: createQuery(),
				offset: offset.value,
				from: _from,
				to: _to,
				order: order.value,
				limit: limit.value,
				interval,
			})
			setHasMoreAndPartialResponseFromData(data)
			const _messages = normalizeResponse(data)
			messages.value = _messages.length === limit.value ? _messages.slice(0, -1) : _messages
			if (shouldFetchNewHistogram.value) {
				histogram.value = normalizeBuckets(data.histogram, timezone.value, intervalMs)
			}
			if (isHistogramVisible.value) {
				lastSearchFilters.value = ({
					query: query.value,
					...toDates(),
				})
			}
			//aggregations.fetchAggregations()
		} catch (e) {
			console.error(e)
			error.value = e as string
			searchWarning.value = { title: null, message: '' }
			hasMore.value = false
			histogram.value = {
				x: [],
				_x: [],
				y: [],
			}
			lastSearchFilters.value = {}
		} finally {
			isHistogramFetching.value = false
			isFetching.value = false
		}
	}

	const fetchAndReturnMessageById = async (id: string) => {
		const event = await getApi().seqUiServer.fetchMessageById(id)
		if (!_isEmpty(event.data)) {
			return normalizeMessage(event)
		}
	}

	const fetchMessageById = async (id: string) => {
		const event = await getApi().seqUiServer.fetchMessageById(id)
		if (!_isEmpty(event.data)) {
			selectedMessage.value = normalizeMessage(event)
		}
	}
	const setQueryAndFetch = (_query: string) => {
		query.value = _query
		return fetchMessages()
	}
	const toggleHistogram = () => {
		isHistogramVisible.value = !isHistogramVisible.value
		if (isHistogramVisible.value) {
			fetchHistogram()
		}
	}

	const fetchMore = async () => {
		if (!hasMore.value || isFetching.value) {
			return
		}
		isFetching.value = true
		offset.value = offset.value + limit.value - 1
		const data = await getApi().seqUiServer.fetchMessages({
			query: createQuery(),
			offset: offset.value,
			order: order.value,
			limit: limit.value,
			...searchInterval.value,
		})
		const _messages = normalizeResponse(data)
		messages.value.push(...(_messages.length === limit.value ? _messages.slice(0, -1) : _messages))
		setHasMoreAndPartialResponseFromData(data)
		isFetching.value = false
	}

	const fetchMoreExtended = async () => {
		if (!hasMore.value || isFetching.value) {
			return
		}
		isFetching.value = true
		offset.value = offset.value + limit.value - 1
		const extendedFrom = durationToISOString(from.value)
		const data = await getApi().seqUiServer.fetchMessages({
			query: createQuery(),
			offset: offset.value,
			order: order.value,
			limit: limit.value,
			...searchInterval.value,
			from: extendedFrom,
		})
		const _messages = normalizeResponse(data)
		messages.value.push(...(_messages.length === limit.value ? _messages.slice(0, -1) : _messages))
		setHasMoreAndPartialResponseFromData(data)
		isFetching.value = false
	}

	const fetchHistogram = async () => {
		if (!shouldFetchNewHistogram.value || firstSearch.value) {
			return
		}
		isHistogramFetching.value = true
		try {
			const [intervalMs, interval] = getClosestPrettyTime({
				...searchInterval.value,
				count: 30,
			})
			const data = await getApi().seqUiServer.fetchHistogram({
				query: query.value,
				...searchInterval.value,
				interval,
			})
			histogram.value = normalizeBuckets(data, timezone.value, intervalMs)
			lastSearchFilters.value = {
				query: query.value,
				...toDates(),
			}
		} finally {
			isHistogramFetching.value = false
		}
	}

	const changeTimezone = (timeZone: string) => {
    // todo: refactor, timezone should only affect render values
		histogram.value = {
			...histogram.value,
			x: histogram.value._x.map((date) => formatHistogramDate(date, timeZone)),
		}
	}

	const toggleOrder = () => {
		order.value = (order.value === 'desc' ? 'asc' : 'desc')
		fetchMessages()
	}

	const setSelectedColumns = (columns: string[], shouldAddColumn = false) => {
		if (!shouldAddColumn) {
			selectedColumns.value = tableFields.value.length > 0 ? tableFields.value : columns
			return
		}
		selectedColumns.value = columns
	}

	const saveColumnsToLocalStorage = (selectedColumns: string[]) => {
		localStorage.setItem(LS_COLUMNS_KEY, selectedColumns.join(','))
	}

	const toggleColumn = (column: string) => {
		setSelectedColumns(symmetricDifference(selectedColumns.value, [column]), true)
    saveColumnsToLocalStorage(selectedColumns.value)
	}

	const addColumnToStart = (column: string) => {
		const newColumnsOrder = selectedColumns.value.filter((col) => col !== column)
		newColumnsOrder.unshift(column)
		setSelectedColumns(newColumnsOrder, true)
    saveColumnsToLocalStorage(selectedColumns.value)
	}

	return {
		messages,
		histogram,
		isHistogramVisible,
		isHistogramFetching,
		lastSearchFilters,
		selectedMessage,
		firstSearch,
		editQuery,
		rangetype,
		getRawInterval,
		isEmpty,
		isWarning,
		isFetching,
		error,
		searchWarning,
		fromUnits,
		toUnits,
		toDates,
		intervalToQueryParams: toQueryParams,
		searchInterval,
		hasMore,
		exportLimit,
		order,
		selectedColumns,

		changeTimezone,
		fetchMessages,
		fetchHistogram,
		fetchMessageById,
		fetchAndReturnMessageById,
		setQueryAndFetch,
		fetchMore,
		fetchMoreExtended,
		toggleHistogram,
		setRelative,
		loadDataFromQuery,
		toggleOrder,
		setInterval,
		toggleColumn,
		addColumnToStart,
	}
}
