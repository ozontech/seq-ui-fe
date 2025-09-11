import { useRouteQuery } from "@vueuse/router"
import { computed, ref, watch } from "vue"
import { equals } from "ramda"
import { storeToRefs } from "pinia"

import { getApi } from "@/api/client"
import type { Message } from "@/types/messages"
import { DEFAULT_LIMIT } from "@/constants/search"
import type { SortDirection } from "@/types/shared"
import { useTokensStore } from "@/stores/tokens"
import { SeqapiV1AggregationFuncDto } from "@/api/generated/seq-ui-server"

import { useAggregations } from "./use-aggregations"
import { useInterval } from "./use-interval"
import { useHistogram } from "./use-histogram"
import { useProfileStore } from "@/stores/profile"
import { getClosestPrettyTime } from "@/helpers/closest-pretty-time"

export type LogsState = ReturnType<typeof useLogs>

export const useLogs = () => {
  const tokens = useTokensStore()
  const { keywords: keywordList } = storeToRefs(tokens)
  const profileStore = useProfileStore()
  const { pinned } = storeToRefs(profileStore)

  const api = getApi()

  const interval = useInterval()
  const query = useRouteQuery<string>('q', '')

  const aggregations = useAggregations(interval, query)
  const histogram = useHistogram(interval, query)

  const offset = ref(0)
  const timeDirection = ref<SortDirection>('desc')

  const initialized = ref(false)
  const data = ref<Message[]>([])
  const hasMore = ref(false)
  const isLoading = ref(false)

  const functions = Object.values(SeqapiV1AggregationFuncDto)
  const keywords = computed(() => {
    return keywordList.value.map(({ name }) => name || '')
  })

  const setQuery = (value: string) => {
    query.value = value
  }

  const setTimeDirection = (value: SortDirection) => {
    timeDirection.value = value
  }

  const submitSearch = async () => {
    offset.value = 0
    isLoading.value = true

    const { from, to } = interval.toDates()
    const response = await api.seqUiServer.fetchMessages({
      query: query.value,
      offset: offset.value,
      limit: DEFAULT_LIMIT,
      interval: histogram.visible && getClosestPrettyTime({
        from,
        to,
        count: 30,
      })[1],
      order: timeDirection.value,
      from,
      to,
    })
    data.value = response.events
    histogram.state.value = response.histogram
    hasMore.value = response.events.length === DEFAULT_LIMIT
    offset.value += DEFAULT_LIMIT

    isLoading.value = false
    initialized.value = true
  }

  const loadMore = async () => {
    if (!initialized.value || isLoading.value || !hasMore.value) {
      return
    }

    isLoading.value = true

    const { from, to } = interval.toDates()
    const response = await api.seqUiServer.fetchMessages({
      query: query.value,
      offset: offset.value,
      limit: DEFAULT_LIMIT,
      order: timeDirection.value,
      from,
      to,
    })
    data.value = [...data.value, ...response.events]
    offset.value += DEFAULT_LIMIT

    isLoading.value = false
  }

  watch([interval.from, interval.to, timeDirection], (curr, prev) => {
    const [from, to, direction] = curr
    const [prevFrom, prevTo, prevDirection] = prev

    const updated = direction !== prevDirection
      || !equals(from, prevFrom)
      || !equals(to, prevTo)

    if (updated) {
      submitSearch()
      aggregations.refetchAggregation()
    }
  }, {
    immediate: true
  })

  return {
    keywords,
    functions,
    query,
    interval,
    setQuery,
    timeDirection,
    setTimeDirection,
    data,
    isLoading,
    submitSearch,
    loadMore,
    aggregations,
    histogram,
    pinned,
  }
}
