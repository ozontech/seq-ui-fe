import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useLastRelative } from '@/helpers/last-relative'

import { useRouteQuery } from './route-query'

import { useSearchStore } from '@/stores/search'
import { durationToSeconds } from '@/helpers/duration'

export const usePagination = (index = 0) => {
	const { setRelative, extractRelative } = useLastRelative()
	const routeQuery = useRouteQuery()

	const { intervalParams } = useSearchStore().getParams(index)

	const pageField = computed(() => index > 0 ? `page.${index}` : 'page').value
	const rangetypeField = computed(() => index > 0 ? `rangetype.${index}` : 'rangetype').value
	const fromField = computed(() => index > 0 ? `from.${index}` : 'from').value
	const toField = computed(() => index > 0 ? `to.${index}` : 'to').value

	const getPageFromQuery = () => {
		const { query } = useRoute()
		const page = query[pageField]

		return Number.parseInt(page?.toString() || '')
	}

	const parsedPage = getPageFromQuery()

	const isPaginationMode = ref(Boolean(parsedPage))
	const page = ref(parsedPage || 1)
	const totalPages = ref<number | null>(null)

	const reset = () => {
		page.value = 1
		totalPages.value = null
	}

	const setTotalPages = (total: number | null) => {
		totalPages.value = total
	}

	const changePage = (newPage: number) => {
		page.value = newPage
	}

	watch(isPaginationMode, (value) => {
		if (value) {
			reset()
			extractRelative(intervalParams.from.value)
			const { from, to } = intervalParams.toDates()
			const query: Record<string, string | number | undefined> = {}
			query[pageField] = page.value
			query[rangetypeField] = 'absolute'
			query[fromField] = from
			query[toField] = to
			routeQuery.batch(query)
			return
		}

		const result = setRelative()
		if (result) {
			intervalParams.setInterval(result.from)
		}
		const query: Record<string, string | number | undefined> = {}
		query[pageField] = undefined
		routeQuery.batch(query)

		if (intervalParams.rangetype.value === 'relative') {
			const from = durationToSeconds(intervalParams.from.value)
			if (from === 300) {
				query[rangetypeField] = undefined
				query[fromField] = undefined
				query[toField] = undefined
				routeQuery.batch(query)
				return
			}
			query[rangetypeField] = 'relative'
			query[fromField] = from
			query[toField] = undefined
			routeQuery.batch(query)
		}
	})

	const changePaginationMode = (value: boolean) => {
		isPaginationMode.value = value
		if (value) {
			reset()
			return
		}
		page.value = 0
	}

	watch(page, (value) => {
		if (isPaginationMode.value) {
			routeQuery.batch({ [pageField]: value })
		}
	})

	return {
		page,
		totalPages,
		isPaginationMode,
		changePage,
		setTotalPages,
		changePaginationMode,
		reset,
	}
}
