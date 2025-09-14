import type { SeqapiV1AggregationFuncDto } from "~/api/generated/seq-ui-server"
import type { AggregationShowType } from "~/types/aggregations"
import type { Duration } from "~/types/duration"

export type AggregationForm = {
  type: AggregationShowType
  fn?: SeqapiV1AggregationFuncDto
  field?: string
  groupBy?: string
  quantiles: string[]
  isIndependent: boolean
  query: string
  from: Duration
  to: Duration
}

export type AggregationFormErrors = Partial<Record<keyof AggregationForm, boolean>>
