/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { Api, SeqapiV1AggregationFuncDto, SeqapiV1OrderDto, type SeqapiV1AggregationQueryDto } from '../generated/seq-ui-server'
import { normalizeEvent, normalizeMessage } from '@/normalizers/events'
import type { NoDataAg } from '@/composables/aggregations'
import { normalizeAggregation, type NormalizedAggregationType } from '@/normalizers/aggregations'
import { getKeywords } from '@/helpers/generate-data'
import type { Order } from '@/types/messages'
import { HandleErrorDecorator, ServiceHandleError } from '../base/error-handler'

export type FetchMessagesNormalizedData = Awaited<ReturnType<InstanceType<typeof SeqUiServerService>['fetchMessages']>>

export type ResponseType<T> = {
  data?: T
  error: Error | string | null
}

export class SeqUiServerService extends Api {
  @ServiceHandleError(() => ({
    total: 0,
    histogram: [],
    events: [],
    partialResponse: false,
    error: ''
  }))
	async fetchMessages({ offset = 0, query = '', limit = 100, from, to, interval = '', order }: {
		limit?: number
		offset?: number
		query?: string
		from?: string
		to?: string
		interval?: string
		order?: Order
	}) {
		const orderEnumed = order === 'asc' ? SeqapiV1OrderDto.OASC : order === 'desc' ? SeqapiV1OrderDto.ODESC : undefined

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
			total,
			histogram: histogram?.buckets || [],
			events: events?.map(normalizeEvent) || [],
			partialResponse,
			error,
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
    return []
  }

  async streamExport(body: unknown): Promise<Response> {
    return {} as Response
  }

  async fetchKeywords() {
    return getKeywords()
  }

  async fetchMessageById(id: string) {
    const { data } = await this.seqapiV1GetEvent(id)
    return normalizeEvent(data?.event || {})
  }

  async fetchHistogram({ query = '', from, to, interval }: {
    from?: string
    to?: string
    query?: string
    interval: string
  }) {
    const { data } = await this.seqapiV1GetHistogram({
      query,
      from,
      to,
      interval,
    })
    return data.histogram?.buckets || []
  }

  async fetchAggregation({ ...args }: {
    query: string
    from: string
    to: string
    index?: number
    aggregations?: SeqapiV1AggregationQueryDto[]
  }) {
    let result: ResponseType<NormalizedAggregationType> | null = null
    try {
      const { data } = await this.seqapiV1GetAggregation({
        ...args,
      })

      result = {
        data: normalizeAggregation(data.aggregations?.[0]?.buckets),
        error: null,
      }
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        result = { error: error.response?.data.message || error.message }
      }
    }
    return result
  }

  async fetchAggregationsChunk({ aggs, ...rest }: {
    aggs: NoDataAg[]
    query: string
    from: string
    to: string
  }) {
    let result: ResponseType<NormalizedAggregationType[]> | null = null

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
      const { data } = await this.seqapiV1GetAggregation(body)

      result = {
        data: data.aggregations?.map(({ buckets }) => normalizeAggregation(buckets)) || [],
        error: null,
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
