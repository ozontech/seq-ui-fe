import { useRouteQuery } from "@vueuse/router"
import { useInterval } from "./use-interval"
import { getApi } from "@/api/client"
import { ref, watch } from "vue"
import type { Message } from "@/types/messages"
import { DEFAULT_LIMIT } from "@/constants/search"
import type { SortDirection } from "@/types/shared"
import { equals } from "ramda"

export const useLogs = () => {
  const api = getApi()

  const interval = useInterval()
  const query = useRouteQuery<string>('q', '')

  const offset = ref(0)
  const timeDirection = ref<SortDirection>('desc')

  const initialized = ref(false)
  const data = ref<Message[]>([])
  const hasMore = ref(false)
  const isLoading = ref(false)

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
      order: timeDirection.value,
      from,
      to,
    })
    data.value = response.events
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
    }
  })

  return {
    query,
    interval,
    setQuery,
    timeDirection,
    setTimeDirection,
    data,
    isLoading,
    submitSearch,
    loadMore,
  }
}
