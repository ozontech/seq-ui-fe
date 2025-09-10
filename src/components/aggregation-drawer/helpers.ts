import { equals, isNil, pick } from 'ramda'

import type { AggregationForm } from './types'
import type { Aggregation } from '@/types/aggregations'
import { SeqapiV1AggregationFuncDto } from '@/api/generated/seq-ui-server'
import { isEmptyDuration } from '@/helpers/duration'

export const getAggregationForm = (aggregation?: Aggregation): AggregationForm => {
  const {
    showType: type = 'table',
    fn = SeqapiV1AggregationFuncDto.AfCount,
    field,
    groupBy,
    quantiles = [],
    query,
    from,
    to,
  } = aggregation ?? {}

  const isIndependent = query || !isEmptyDuration(from) || !isEmptyDuration(to)

  return {
    type,
    fn,
    field,
    groupBy,
    quantiles: quantiles.map((item) => item.toString()),
    isIndependent: Boolean(isIndependent),
    query: query ?? '',
    from: (isNil(from) || isEmptyDuration(from)) ? { minutes: 5 } : from,
    to: (isNil(to) || isEmptyDuration(to)) ? {} : to,
  }
}

export const validateQuantile = (value: string) => {
  const num = Number(value)
  return isNaN(num) || num === 0 || num > 0.99 || num < 0.01
}

export const validateAggregationForm = (form: AggregationForm) => {
  const isQuantileFn = form.fn === SeqapiV1AggregationFuncDto.AfQuantile
  const isNotCountFn = form.fn !== SeqapiV1AggregationFuncDto.AfCount

  return {
    fn: isNil(form.fn),
    field: isNil(form.field),
    groupBy: isNotCountFn && isNil(form.groupBy),
    quantiles: isQuantileFn && (form.quantiles.length === 0 || form.quantiles.some(validateQuantile)),
  }
}

export const getAggregation = (form: AggregationForm, index: number) => {
  const {
    type: showType,
    fn = SeqapiV1AggregationFuncDto.AfCount,
    field = '',
    groupBy = '',
    quantiles,
    query,
    from,
    to,
    isIndependent,
  } = form

  return {
    shouldIgnorUpdate: false,
    index,
    showType,
    fn,
    field,
    groupBy,
    quantiles: quantiles
      .map((value) => Number(value))
      .filter((value): value is number => !isNaN(value)),
    ...isIndependent ? {
      query,
      from,
      to,
    } : {},
  }
}

const fields: Array<keyof Aggregation> = ['showType', 'fn', 'field', 'groupBy', 'quantiles', 'query', 'from', 'to']

export const isEqualAggregations = (a?: Aggregation, b?: Aggregation) => {
  const aggregationA = a && pick(fields, a)
  const aggregationB = b && pick(fields, b)

  return equals(aggregationA, aggregationB)
}
