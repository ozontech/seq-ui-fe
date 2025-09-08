/* eslint-disable @typescript-eslint/no-unused-vars */
import { differenceInSeconds, parseISO, subSeconds } from 'date-fns'
import { format } from 'date-fns-tz'
import type { LocationQuery, LocationQueryValueRaw, RouteLocationNormalized } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty as _isEmpty, symmetricDifference } from 'ramda'
import { computedWithControl } from '@vueuse/core'

import { useTimezoneStore } from '@/stores/timezone'
import { LS_COLUMNS_KEY, useConfigStore } from '@/stores/config'
import { useGroup } from '@/composables/group'
import { usePagination } from '@/composables/pagination'
import { utcToZonedTime } from '@/helpers/date-fns-tz'
import { secondsToSingleUnitDuration, durationToSeconds, durationToISOString } from '@/helpers/duration'
import type { SeqapiV1SearchResponseDto } from '@/api/generated/seq-ui-server'
import type { Message, SearchWarning, GetRawIntervalOptions, Order } from '@/types/messages'
import type { IntervalType } from '@/types/input'
import type { Histogram } from '@/types/shared'
import { normalizeMessage, normalizeSearchWarning } from '@/normalizers/events'
import { formatHistogramDate, normalizeBuckets } from '@/normalizers/bucket'
import { getApi } from '@/api/client'
import type { FetchMessagesNormalizedData } from '@/api/services/seq-ui-server'
import { useLastRelative } from '@/helpers/last-relative'
import { DEFAULT_LIMIT, defaultFrom } from '@/constants/search'
import { getClosestPrettyTime } from '@/helpers/closest-pretty-time'
import { useSearchStore } from '@/stores/search'
import { pickByIndex } from '@/helpers/search'
import { useDashboardsStore } from '@/stores/dashboards'
import type { Duration } from '@/types/duration'

const normalizeResponse = (data: Pick<SeqapiV1SearchResponseDto, 'events'>, timezone: string) => data.events?.map((event) => normalizeMessage(event, timezone)) || []
type LastHistogram = {
	query?: string
	from?: string | number
	to?: string | number
}
type LocationScalarQuery = Record<string, LocationQueryValueRaw>

const getLocationScalarQuery = (data: LocationQuery): LocationScalarQuery => {
	if (!data || typeof data !== 'object') return {}

	return Object.keys(data).reduce<LocationScalarQuery>((accum, key) => {
		const value = data[key]
		accum[key] = typeof value === 'string' || typeof value === 'number' ? value.toString() : null
		return accum
	}, {})
}
const defaultHistogram = (): Histogram => ({
	x: [],
	_x: [],
	y: [],
})

export const useMessages = (id: number) => {
	const searchStore = useSearchStore()
	const dashboardStore = useDashboardsStore()
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

	const pagination = usePagination(id)

	const isFetching = ref(false)

	const messages = ref<Message[]>([])
	const selectedColumns = ref<string[]>([])
	const tableFields = ref<string[]>([])
	const groups = useGroup(id, messages)
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
			page: _page,
			fields: _fields,
		} = pickByIndex(routeQueryValue as Record<string, string>, id)

		// проебывается при смене вкладки
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

		if (_page) {
			pagination.isPaginationMode.value = true
			pagination.page.value = Number(_page)
			const result = useLastRelative().extractRelative(from.value)
			if (result) {
				setInterval(result.from, result.to)
			}
		}
		return id
	}

	// ToDo: найти, где это используется и проверить, нужны ли там индексы блоков
	const loadSliceDataFromQuery = async () => {
		const {
			from: _from,
			to: _to,
			rangetype,
			histogram,
			aggregation,
			timezone,
			q,
			...rest
		} = getLocationScalarQuery(useRoute().query)
		const buildedQuery = Object.entries(rest).map(([key, value]) => `${key}:"${value}"`).join(' AND ')
		firstSearch.value = false

		query.value = buildedQuery
		if (rangetype === 'absolute') {
      if (_from) {
        setFrom(parseISO(_from.toString()))
      }
      if (_to) {
        setTo(parseISO(_to.toString()))
      }
			return
		}
		if (_from === '0') {
			from.value = {}
			return
		}
		const fromInDuration = _from && secondsToSingleUnitDuration(Number(_from))
		const toInDuration = _to && secondsToSingleUnitDuration(Number(_to))
		if (fromInDuration) {
			from.value = fromInDuration
		} else {
			from.value = defaultFrom()
		}
		if (toInDuration) {
			to.value = toInDuration
		} else {
			to.value = {}
		}
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
	/*private*/const dashboardUUID = computed(() => dashboardStore.selectedUuid)
	/*private*/const canEditDashboard = computed(() => dashboardStore.canEdit)

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

		pagination.setTotalPages(null)
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
				offset: pagination.isPaginationMode.value ? (pagination.page.value - 1) * (limit.value - 1) : offset.value,
				from: _from,
				to: _to,
				order: order.value,
				limit: pagination.isPaginationMode.value ? limit.value - 1 : limit.value,
				interval,
				withTotal: pagination.isPaginationMode.value,
			})
			if (pagination.isPaginationMode.value) {
				const total = Number(data.total || 0)
				pagination.setTotalPages(Math.ceil(total / (limit.value - 1)))
			}
			setHasMoreAndPartialResponseFromData(data)
			const _messages = normalizeResponse(data, timezone.value)
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
			pagination.setTotalPages(0)
		} finally {
			isHistogramFetching.value = false
			isFetching.value = false
		}
	}

	const fetchAndReturnMessageById = async (id: string) => {
		const event = await getApi().seqUiServer.fetchMessageById(id)
		if (!_isEmpty(event.data)) {
			return normalizeMessage(event, timezone.value)
		}
	}

	const fetchMessageById = async (id: string) => {
		const event = await getApi().seqUiServer.fetchMessageById(id)
		if (!_isEmpty(event.data)) {
			selectedMessage.value = normalizeMessage(event, timezone.value)
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
		const _messages = normalizeResponse(data, timezone.value)
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
		const _messages = normalizeResponse(data, timezone.value)
		messages.value.push(...(_messages.length === limit.value ? _messages.slice(0, -1) : _messages))
		setHasMoreAndPartialResponseFromData(data)
		isFetching.value = false
	}

	const shouldAddWithTotal = (totalPages: number | null) => {
		// todo
		return totalPages === null || differenceInSeconds(new Date(), to.value as Date) < 30
	}

	const fetchPage = async () => {
		isFetching.value = true
		messages.value = []
		const withTotal = shouldAddWithTotal(pagination.totalPages.value)
		try {
			const data = await getApi().seqUiServer.fetchMessages({
				query: createQuery(),
				offset: pagination.page.value > 0 ? (pagination.page.value - 1) * (limit.value - 1) : 0,
				order: order.value,
				limit: limit.value - 1,
				withTotal,
				...searchInterval.value,
			})
			error.value = null

			messages.value = normalizeResponse(data, timezone.value)
			if (withTotal && data.total) {
				const total = Number(data.total || 0)
				pagination.setTotalPages(Math.ceil(total / (limit.value - 1)))
			}
		} catch (e) {
			console.error(e)
			error.value = e as string
			hasMore.value = false
			histogram.value = {
				x: [],
				_x: [],
				y: [],
			}
			lastSearchFilters.value = {}
		}
		finally {
			isFetching.value = false
		}
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
		const callback = (message: Message) => {
			return {
				...message,
				timestamp: format(utcToZonedTime(message.rawTime.toISOString(), timeZone), 'yyyy-MM-dd HH:mm:ss.SSS', {
					timeZone,
				}),
			}
		}
		messages.value = messages.value.map(callback)

		groups.updateGroups(callback)
		histogram.value = {
			...histogram.value,
			x: histogram.value._x.map((date) => formatHistogramDate(date, timeZone)),
		}
	}

	const toggleOrder = () => {
		order.value = (order.value === 'desc' ? 'asc' : 'desc')
		if (groups.isGroupView.value) {
			return
		}
		fetchMessages()
	}

	const setSelectedColumns = (columns: string[], shouldAddColumn = false) => {
		if (!shouldAddColumn) {
			selectedColumns.value = tableFields.value.length > 0 ? tableFields.value : columns
			return
		}
		selectedColumns.value = columns
	}

	const loadDashboardColumns = () => {
		let result: string[] | undefined = tableFields.value
		if (!result.length) {
			result = selectedColumns.value.length ? selectedColumns.value : localStorage.getItem(LS_COLUMNS_KEY)?.split(',')
		}
		setSelectedColumns(result && result[0].length ? result : [])
	}

	const saveColumnsToLocalStorage = (selectedColumns: string[]) => {
		localStorage.setItem(LS_COLUMNS_KEY, selectedColumns.join(','))
	}

	const toggleColumn = (column: string) => {
		setSelectedColumns(symmetricDifference(selectedColumns.value, [column]), true)

		if (canEditDashboard.value || !dashboardUUID.value) {
			saveColumnsToLocalStorage(selectedColumns.value)
		}
	}

	const addColumnToStart = (column: string) => {
		const newColumnsOrder = selectedColumns.value.filter((col) => col !== column)
		newColumnsOrder.unshift(column)
		setSelectedColumns(newColumnsOrder, true)
		if (canEditDashboard.value || !dashboardUUID.value) {
			saveColumnsToLocalStorage(selectedColumns.value)
		}
	}

	watch(groups.isGroupView, (value) => {
		const { setRelative: _setRelative, extractRelative } = useLastRelative()
		if (value) {
			const result = extractRelative(from.value)
			if (result) {
				setInterval(result.from, result.to)
			}
			return
		}
		setRelative(_setRelative())
		fetchMessages()
	})

	return {
		messages,
		histogram,
		isHistogramVisible,
		isHistogramFetching,
		lastSearchFilters,
		selectedMessage,
		firstSearch,
		/** @deprecated */
		query,
		editQuery,
		rangetype,
		getRawInterval,
		/** @deprecated */
		from,
		/** @deprecated */
		to,
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
		pagination,
		selectedColumns,
		groups,

		changeTimezone,
		fetchMessages,
		fetchHistogram,
		fetchMessageById,
		fetchAndReturnMessageById,
		fetchPage,
		setQueryAndFetch,
		fetchMore,
		fetchMoreExtended,
		toggleHistogram,
		setRelative,
		loadDataFromQuery,
		loadSliceDataFromQuery,
		toggleOrder,
		setInterval,
		toggleColumn,
		addColumnToStart,
		loadDashboardColumns,
	}
}
