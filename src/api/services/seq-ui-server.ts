/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import type { FavoriteQuery } from '@/types/profile'
import { Api, SeqapiV1AggregationFuncDto, type SeqapiV1AggregationQueryDto } from '../generated/seq-ui-server'
import type { DashboardInfo, DashboardSaved } from '@/types/dashboards'
import { normalizeEvent } from '@/normalizers/events'
import type { NoDataAg } from '@/composables/aggregations'
import { normalizeAggregation, type NormalizedAggregationType } from '@/normalizers/aggregations'
import { generateTableData, getKeywords } from '@/helpers/generate-data'

export type FetchMessagesNormalizedData = Awaited<ReturnType<InstanceType<typeof SeqUiServerService>['fetchMessages']>>

export type ResponseType<T> = {
  data?: T
  error: Error | string | null
}

export class SeqUiServerService extends Api {
  async fetchMessages(body: unknown) {
    return {
      total: 1,
      histogram: [],
      events: generateTableData(50),
      partialResponse: undefined,
      error: {
        code: 'code',
        message: 'message',
      },
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

  async getFavoriteQueries(): Promise<FavoriteQuery[]> {
    return []
  }

  async saveFavoriteQuery(query: unknown) {
    return 'id'
  }

  async deleteFavoriteQuery(id: string) {
    return true
  }

  async streamExport(body: unknown): Promise<Response> {
    return {} as Response
  }

  async fetchKeywords() {
    return getKeywords()
  }

  async getDashboardById(uuid: string): Promise<DashboardSaved> {
    return {} as DashboardSaved
  }

  async saveDashboard(uuid: string, dashboard: unknown) {
    return []
  }

  async createDashboard(body: unknown) {
    return ''
  }

  async deleteDashboard(uuid: string) {
    return ''
  }

  async getMyDashboards(query: unknown): Promise<DashboardInfo[]> {
    return []
  }

  async getAllDashboards(query: unknown): Promise<DashboardInfo[]> {
    return []
  }

  async searchDashboards(query: unknown): Promise<DashboardInfo[]> {
    return []
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
