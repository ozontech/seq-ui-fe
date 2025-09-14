import { ref, type Ref } from "vue"
import type { IntervalState } from "./use-interval"
import { getClosestPrettyTime } from "~/helpers/closest-pretty-time"
import type { Histogram } from "~/types/shared"
import { useAsyncState } from "@vueuse/core"
import { getApi } from "~/api/client"

const defaultHistogram = (): Histogram => ({
  x: [],
  _x: [],
  y: [],
})

const BARS_COUNT = 30

export type HistogramState = ReturnType<typeof useHistogram>

export const useHistogram = (
  interval: IntervalState,
  query: Ref<string>
) => {
  const api = getApi()

  const visible = ref(false)

  const changeVisibility = (state: boolean) => {
    visible.value = state
  }

  const { state, isLoading, execute } = useAsyncState(() => {
    const { from, to } = interval.toDates()
    const [ms, prettyStr] = getClosestPrettyTime({ from, to, count: BARS_COUNT })

    return api.seqUiServer.fetchHistogram({
      query: query.value,
      from,
      to,
      interval: prettyStr,
      intervalMs: ms,
    })
  }, defaultHistogram(), { immediate: false })

  const fetchHistogram = () => {
    if (visible.value) {
      execute()
    }
  }

  const addHistogram = () => {
    if (visible.value) {
      return
    }

    changeVisibility(true)

    if (state.value.x.length === 0) {
      fetchHistogram()
    }
  }

  return {
    visible,
    changeVisibility,
    isLoading,
    state,
    fetchHistogram,
    addHistogram,
  }
}
