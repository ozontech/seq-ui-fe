import type { SeqapiV1AggregationFuncDto } from '@/api/generated/seq-ui-server'
import type { AggregationData } from '@/normalizers/aggregations'
import type { Duration } from '@/types/duration'

export type FunctionKeys = 'count' | 'max'
export type RangeType = 'relative' | 'absolute'
export type AggregationType = 'table' | 'pie-chart' | 'linear-chart'

export type Aggregation = {
  field: string
  fn: SeqapiV1AggregationFuncDto
  width?: number
  updatedAt?: Date
  height?: number
  groupBy?: string
  quantiles?: number[]
  total?: number
  data?: AggregationData | null
  query?: string
  from?: Duration
  to?: Duration
  rangeType?: RangeType
  showType?: AggregationType
}

export type GroupedAggregations = {
  query?: string
  from?: Duration
  to?: Duration
  rangeType?: RangeType
  field: string
  fn: SeqapiV1AggregationFuncDto
  updatedAt?: Date
  width?: number
  height?: number
  groupBy?: string
  quantiles?: number[]
  data?: AggregationData | null
  aggregations: Aggregation[]
}

export type SaveAggregationBody = {
  field: string
  groupBy?: string
  fn: SeqapiV1AggregationFuncDto
  index: number
  quantiles?: number[]
  shouldIgnorUpdate?: boolean
  query?: string
  from?: Duration
  to?: Duration
  rangeType?: RangeType
  showType?: AggregationType
  total?: number
}

export type PickedAggregationKeys = keyof Pick<Aggregation, 'fn' | 'height' | 'width' | 'updatedAt' | 'field' | 'groupBy' | 'quantiles'>
