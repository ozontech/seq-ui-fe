import type { Aggregation, SaveAggregationBody } from "@/types/aggregations"
import { ref, type Ref } from "vue"
import type { IntervalState } from "./use-interval"

export type AggregationsState = ReturnType<typeof useAggregations>

export const useAggregations = (
  interval: IntervalState,
  query: Ref<string>
) => {
  const list = ref<Aggregation[]>([])
  const selectedIndex = ref(-1)

  const addAggregation = (aggregation: SaveAggregationBody) => {
    console.log('add')
    list.value.push(aggregation)
  }

  const updateAggregation = (aggregation: SaveAggregationBody) => {
    console.log('update')
  }

  const deleteAggregation = (index: number) => {
    list.value = list.value.filter((_, i) => i !== index)
  }

  const refetchAggregation = () => {
    console.log('refetch')
  }

  return {
    list,
    selectedIndex,
    addAggregation,
    updateAggregation,
    deleteAggregation,
    refetchAggregation,
  }
}
