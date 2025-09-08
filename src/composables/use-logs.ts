import { useRouteQuery } from "@vueuse/router"
import { useInterval } from "./use-interval"
import { getApi } from "@/api/client"
import { ref } from "vue"
import type { Log } from "@/types/log"

export const useLogs = () => {
  const api = getApi()

  const interval = useInterval()
  const query = useRouteQuery<string>('q', '')

  const data = ref<Log[]>([])
  const isLoading = ref(false)

  const setQuery = (value: string) => {
    query.value = value
  }

  // TODO: don't request data for same parameters
  const submitSearch = async () => {
    isLoading.value = true

    const { from, to } = interval.toDates()
    const response = await api.seqUiServer.fetchMessages({
      query: query.value,
      offset: 0,
      limit: 50,
      order: 'desc',
      from,
      to,
      interval: '30s',
      withTotal: false,
    })

    isLoading.value = false
  }

  const loadMore = async () => {
    console.log('load more')
  }

  return {
    query,
    interval,
    setQuery,
    data,
    isLoading,
    submitSearch,
    loadMore,
  }
}
