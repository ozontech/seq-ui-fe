/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError } from 'axios'
import { Api, SeqapiV1AggregationFuncDto, SeqapiV1OrderDto, type SeqapiV1AggregationQueryDto, type SeqapiV1AggregationTsQueryDto } from '../generated/seq-ui-server'
import { normalizeEvent, normalizeMessage } from '@/normalizers/events'
import type { NoDataAg } from '@/composables/aggregations'
import { normalizeAggregation, normalizeAggregationTS, type NormalizedAggregationTSType, type NormalizedAggregationType } from '@/normalizers/aggregations'
import type { Order } from '@/types/messages'
import { HandleErrorDecorator, ServiceHandleError } from '../base/error-handler'
import { toast } from 'vue-sonner'
import { normalizeBuckets } from '@/normalizers/bucket'

export type FetchMessagesNormalizedData = Awaited<ReturnType<InstanceType<typeof SeqUiServerService>['fetchMessages']>>

export type ResponseType<T> = {
  data?: T
  error: Error | string | null
}

export class SeqUiServerService extends Api {
  async fetchMessages({
    offset = 0,
    query = '',
    limit = 100,
    from,
    to,
    interval = '',
    order
  }: {
    limit?: number
    offset?: number
    query?: string
    from?: string
    to?: string
    interval?: string
    order?: Order
  }) {
    const orderEnumed = order === 'asc'
      ? SeqapiV1OrderDto.OASC
      : order === 'desc'
        ? SeqapiV1OrderDto.ODESC
        : undefined

    try {
      const { data: { total, events, histogram, partialResponse, error } } = await this.seqapiV1Search({
        query,
        from,
        to,
        limit,
        offset,
        order: orderEnumed,
        histogram: {
          interval,
        },
      })

      return {
        total: Number(total),
        histogram: normalizeBuckets(histogram?.buckets || []),
        events: (events ?? []).map(normalizeMessage),
        partialResponse,
        error,
      }
    } catch (e) {
      // @ts-expect-error fix later
      toast.error((e as AxiosError).response?.data?.message, {
        id: 'search',
      })
      return {
        total: 0,
        histogram: normalizeBuckets([]),
        events: []
      }
    }
  }

  async getLimits() {
    return {
      maxExportLimit: 1
    }
  }

  async getLogsLifespan() {
    return {
      lifespan: 1
    }
  }

  async getPinnedFields() {
    const { data: { fields = [] } } = await this.seqapiV1GetPinnedFields()
    return fields.map(({ name }) => name || '')
  }

  async streamExport(body: unknown): Promise<Response> {
    return {} as Response
  }

  async fetchKeywords() {
    const { data } = await this.seqapiV1GetFields()
    return data.fields || []
  }

  async fetchMessageById(id: string) {
    const { data } = await this.seqapiV1GetEvent(id)
    return normalizeEvent(data?.event || {})
  }

  async fetchHistogram({ query = '', from, to, interval, intervalMs }: {
    from?: string
    to?: string
    query?: string
    interval: string
    intervalMs: number
  }) {
    const { data } = await this.seqapiV1GetHistogram({
      query,
      from,
      to,
      interval,
    })
    return normalizeBuckets(data.histogram?.buckets ?? [], intervalMs)
  }

  async fetchAggregation({ timeseries, ...args }: {
    query: string
    from: string
    to: string
    index?: number
    aggregations?: SeqapiV1AggregationTsQueryDto[]
		timeseries?: boolean
  }) {
		let result: ResponseType<NormalizedAggregationType | NormalizedAggregationTSType> | null = null

		try {
			if (timeseries) {
				const { data } = await this.seqapiV1GetAggregationTs({
					...args,
				})

				result = {
					data: normalizeAggregationTS(data.aggregations?.[0]?.data?.result),
					error: null,
				}
			} else {
				const { data } = await this.seqapiV1GetAggregation({
					...args,
				})

				result = {
					data: normalizeAggregation(data.aggregations?.[0]?.buckets),
					error: null,
				}
			}
		} catch (error) {
			console.error(error)

			if (axios.isAxiosError(error)) {
				result = { error: error.response?.data.message || error.message }
			}
		}
		return result
  }

  async fetchAggregationsChunk({ aggs, timeseries, ...rest }: {
    aggs: NoDataAg[]
    query: string
    from: string
    to: string
		timeseries?: boolean
  }) {
    let result: ResponseType<NormalizedAggregationType[] | NormalizedAggregationTSType[]> | null = null

    const body = {
      ...rest,
      aggregations: aggs.map(({ field, quantiles, fn, groupBy }) => ({
        field,
        filter: '',
        quantiles: fn === SeqapiV1AggregationFuncDto.AfQuantile ? quantiles : undefined,
        agg_func: fn,
        group_by: groupBy,
      })),
    }

    try {

			if (timeseries) {
				const { data } = await this.seqapiV1GetAggregationTs(body)

				result = {
					data: data.aggregations?.map(({ data }) => normalizeAggregationTS(data?.result)) || [],
					error: null,
				}
			} else {
				const { data } = await this.seqapiV1GetAggregation(body)

				result = {
					data: data.aggregations?.map(({ buckets }) => normalizeAggregation(buckets)) || [],
					error: null,
				}
			}
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        result = { error: error.response?.data.message || error.message }
      }
    }

    return result
  }
}
