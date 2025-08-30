/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UnexpectedErrorDto {
  message?: string;
}

export interface DashboardsV1CreateRequestDto {
  meta?: string;
  name?: string;
}

export interface DashboardsV1CreateResponseDto {
  uuid?: string;
}

export interface DashboardsV1DashboardDto {
  meta?: string;
  name?: string;
  owner_name?: string;
}

export interface DashboardsV1GetAllRequestDto {
  limit?: number;
  offset?: number;
}

export interface DashboardsV1GetAllResponseDto {
  dashboards?: DashboardsV1InfoWithOwnerDto[];
}

export interface DashboardsV1GetMyRequestDto {
  limit?: number;
  offset?: number;
}

export interface DashboardsV1GetMyResponseDto {
  dashboards?: DashboardsV1InfoDto[];
}

export interface DashboardsV1InfoDto {
  name?: string;
  uuid?: string;
}

export interface DashboardsV1InfoWithOwnerDto {
  name?: string;
  owner_name?: string;
  uuid?: string;
}

export interface DashboardsV1SearchFilterDto {
  owner_name?: string;
}

export interface DashboardsV1SearchRequestDto {
  filter?: DashboardsV1SearchFilterDto;
  limit?: number;
  offset?: number;
  query?: string;
}

export interface DashboardsV1SearchResponseDto {
  dashboards?: DashboardsV1InfoWithOwnerDto[];
}

export interface DashboardsV1UpdateRequestDto {
  meta?: string;
  name?: string;
}

export interface ErrorgroupsV1BucketDto {
  count?: number;
  /** @format date-time */
  time?: string;
}

export interface ErrorgroupsV1DistributionDto {
  percent: number;
  value: string;
}

export interface ErrorgroupsV1DistributionsDto {
  by_env?: ErrorgroupsV1DistributionDto[];
  by_release?: ErrorgroupsV1DistributionDto[];
}

export interface ErrorgroupsV1EnvDto {
  env?: string;
  percent?: number;
}

export interface ErrorgroupsV1GetDetailsRequestDto {
  env?: string;
  /** @format uint64 */
  group_hash?: string;
  release?: string;
  service?: string;
}

export interface ErrorgroupsV1GetDetailsResponseDto {
  distributions?: ErrorgroupsV1DistributionsDto;
  /** Deprecated. Use `distributions.by_envs` instead */
  envs?: ErrorgroupsV1EnvDto[];
  /** @format date-time */
  first_seen_at?: string;
  /** @format uint64 */
  group_hash?: string;
  /** @format date-time */
  last_seen_at?: string;
  message?: string;
  seen_total?: number;
}

export interface ErrorgroupsV1GetGroupsRequestDto {
  /**
   * In go duration format. If not specified, then for the entire time.
   * @format duration
   * @example "1h"
   */
  duration?: string;
  env?: string;
  limit?: number;
  offset?: number;
  order?: ErrorgroupsV1OrderDto;
  release?: string;
  service?: string;
  with_total?: boolean;
}

export interface ErrorgroupsV1GetGroupsResponseDto {
  groups?: ErrorgroupsV1GroupDto[];
  total?: number;
}

export interface ErrorgroupsV1GetHistRequestDto {
  /**
   * In go duration format. If not specified, `1h` is used.
   * @format duration
   * @example "1h"
   */
  duration?: string;
  env?: string;
  /** @format uint64 */
  group_hash?: string;
  release?: string;
  service?: string;
}

export interface ErrorgroupsV1GetHistResponseDto {
  buckets?: ErrorgroupsV1BucketDto[];
}

export interface ErrorgroupsV1GetReleasesRequestDto {
  env?: string;
  /** @format uint64 */
  group_hash?: string;
  service?: string;
}

export interface ErrorgroupsV1GetReleasesResponseDto {
  releases?: string[];
}

export interface ErrorgroupsV1GetServicesRequestDto {
  env?: string;
  limit?: number;
  offset?: number;
  query?: string;
}

export interface ErrorgroupsV1GetServicesResponseDto {
  services?: string[];
}

export interface ErrorgroupsV1GroupDto {
  /** @format date-time */
  first_seen_at?: string;
  /** @format uint64 */
  hash?: string;
  /** @format date-time */
  last_seen_at?: string;
  message?: string;
  seen_total?: number;
}

export enum ErrorgroupsV1OrderDto {
  OrderFrequent = "frequent",
  OrderLatest = "latest",
  OrderOldest = "oldest",
}

export interface MassexportV1CancelRequestDto {
  session_id?: string;
}

export interface MassexportV1CheckRequestDto {
  session_id?: string;
}

export interface MassexportV1CheckResponseDto {
  duration?: string;
  error?: string;
  finished_at?: string;
  id?: string;
  links?: string;
  packed_size?: number;
  progress?: number;
  started_at?: string;
  status?: MassexportV1ExportStatusDto;
  unpacked_size?: number;
  user_id?: string;
}

export enum MassexportV1ExportStatusDto {
  ExportStatusUnspecified = "UNSPECIFIED",
  ExportStatusStart = "START",
  ExportStatusCancel = "CANCEL",
  ExportStatusFail = "FAIL",
  ExportStatusFinish = "FINISH",
}

export interface MassexportV1GetAllResponseDto {
  exports?: MassexportV1CheckResponseDto[];
}

export interface MassexportV1RestoreRequestDto {
  session_id?: string;
}

export interface MassexportV1StartRequestDto {
  /** @format date-time */
  from?: string;
  name?: string;
  query?: string;
  /** @format date-time */
  to?: string;
  window?: string;
}

export interface MassexportV1StartResponseDto {
  session_id?: string;
}

export interface SeqapiV1AggregationDto {
  buckets?: SeqapiV1AggregationBucketDto[];
  not_exists?: number;
}

export interface SeqapiV1AggregationBucketDto {
  key?: string;
  not_exists?: number;
  quantiles?: number[];
  value?: number;
}

export enum SeqapiV1AggregationFuncDto {
  AfCount = "count",
  AfSum = "sum",
  AfMin = "min",
  AfMax = "max",
  AfAvg = "avg",
  AfQuantile = "quantile",
  AfUnique = "unique",
}

export interface SeqapiV1AggregationQueryDto {
  /** @default "count" */
  agg_func?: SeqapiV1AggregationFuncDto;
  field?: string;
  group_by?: string;
  quantiles?: number[];
}

export interface SeqapiV1ErrorDto {
  /** @default "ERROR_CODE_NO" */
  code?: SeqapiV1ErrorCodeDto;
  message?: string;
}

export enum SeqapiV1ErrorCodeDto {
  AecNo = "ERROR_CODE_NO",
  AecPartialResponse = "ERROR_CODE_PARTIAL_RESPONSE",
  AecQueryTooHeavy = "ERROR_CODE_QUERY_TOO_HEAVY",
  AecTooManyFractionsHit = "ERROR_CODE_TOO_MANY_FRACTIONS_HIT",
}

export interface SeqapiV1EventDto {
  data?: Record<string, string>;
  id?: string;
  /** @format date-time */
  time?: string;
}

export enum SeqapiV1ExportFormatDto {
  EfJSONL = "jsonl",
  EfCSV = "csv",
}

export interface SeqapiV1ExportRequestDto {
  fields?: string[];
  /** @default "jsonl" */
  format?: SeqapiV1ExportFormatDto;
  /** @format date-time */
  from?: string;
  /** @format int32 */
  limit?: number;
  /** @format int32 */
  offset?: number;
  query?: string;
  /** @format date-time */
  to?: string;
}

/** Export response in one of the following formats:<br> - JSONL: {"id":"some-id","data":{"field1":"value1","field2":"value2"},"time":"2024-12-31T10:20:30.0004Z"}<br> - CSV: value1,value2,value3 */
export type SeqapiV1ExportResponseDto = object;

export interface SeqapiV1FieldDto {
  name?: string;
  /** @default "unknown" */
  type?: "unknown" | "keyword" | "text";
}

export interface SeqapiV1GetAggregationRequestDto {
  aggField?: string;
  aggregations?: SeqapiV1AggregationQueryDto[];
  /** @format date-time */
  from?: string;
  query?: string;
  /** @format date-time */
  to?: string;
}

export interface SeqapiV1GetAggregationResponseDto {
  aggregation?: SeqapiV1AggregationDto;
  aggregations?: SeqapiV1AggregationDto[];
  error?: SeqapiV1ErrorDto;
  partialResponse?: boolean;
}

export interface SeqapiV1GetEventResponseDto {
  event?: SeqapiV1EventDto;
}

export interface SeqapiV1GetFieldsResponseDto {
  fields?: SeqapiV1FieldDto[];
}

export interface SeqapiV1GetHistogramRequestDto {
  /** @format date-time */
  from?: string;
  interval?: string;
  query?: string;
  /** @format date-time */
  to?: string;
}

export interface SeqapiV1GetHistogramResponseDto {
  error?: SeqapiV1ErrorDto;
  histogram?: SeqapiV1HistogramDto;
  partialResponse?: boolean;
}

export interface SeqapiV1GetLimitsResponseDto {
  /** @format int32 */
  maxAggregationsPerRequest?: number;
  /** @format int32 */
  maxExportLimit?: number;
  /** @format int32 */
  maxParallelExportRequests?: number;
  /** @format int32 */
  maxSearchLimit?: number;
  /** @format int32 */
  seqCliMaxSearchLimit?: number;
}

export interface SeqapiV1GetLogsLifespanResponseDto {
  lifespan?: number;
}

export interface SeqapiV1HistogramDto {
  buckets?: SeqapiV1HistogramBucketDto[];
}

export interface SeqapiV1HistogramBucketDto {
  /** @format uint64 */
  docCount?: string;
  /** @format uint64 */
  key?: string;
}

export enum SeqapiV1OrderDto {
  ODESC = "desc",
  OASC = "asc",
}

export interface SeqapiV1SearchRequestDto {
  aggregations?: SeqapiV1AggregationQueryDto[];
  /** @format date-time */
  from?: string;
  histogram?: {
    interval?: string;
  };
  /** @format int32 */
  limit?: number;
  /** @format int32 */
  offset?: number;
  /** @default "desc" */
  order?: SeqapiV1OrderDto;
  query?: string;
  /** @format date-time */
  to?: string;
  withTotal?: boolean;
}

export interface SeqapiV1SearchResponseDto {
  aggregations?: SeqapiV1AggregationDto[];
  error?: SeqapiV1ErrorDto;
  events?: SeqapiV1EventDto[];
  histogram?: SeqapiV1HistogramDto;
  partialResponse?: boolean;
  /** @format int64 */
  total?: string;
}

export interface SeqapiV1StatusResponseDto {
  number_of_stores?: number;
  oldest_storage_time?: string;
  stores?: SeqapiV1StoreStatusDto[];
}

export interface SeqapiV1StoreStatusDto {
  error?: string;
  host?: string;
  values?: SeqapiV1StoreStatusValuesDto;
}

export interface SeqapiV1StoreStatusValuesDto {
  oldest_time?: string;
}

export interface UserprofileV1CreateFavoriteQueryRequestDto {
  name?: string;
  query?: string;
  /** @format uint64 */
  relativeFrom?: string;
}

export interface UserprofileV1CreateFavoriteQueryResponseDto {
  /** @format int64 */
  id?: string;
}

export interface UserprofileV1FavoriteQueryDto {
  /** @format int64 */
  id?: string;
  name?: string;
  query?: string;
  /** @format uint64 */
  relativeFrom?: string;
}

export interface UserprofileV1GetFavoriteQueriesResponseDto {
  queries?: UserprofileV1FavoriteQueryDto[];
}

export interface UserprofileV1UpdateUserProfileRequestDto {
  log_columns?: {
    columns?: string[];
  };
  onboardingVersion?: string;
  timezone?: string;
}

export interface UserprofileV1UserProfileDto {
  log_columns?: string[];
  onboardingVersion?: string;
  timezone?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";
import qs from "qs";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export type HttpQueryArrayFormat =
  | "brackets" // 'a[]=b&a[]=c'
  | "indices" // 'a[0]=b&a[1]=c'
  | "repeat" // 'a=b&a=c'
  | "comma"; // 'a=b,c'

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient {
  private instance: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.instance = axios;
  }

  private stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  private createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  private serializeParams(params: AxiosRequestConfig["paramsSerializer"]) {
    return qs.stringify(params, { arrayFormat: "brackets" });
  }

  public request = async <T = any, _E = any>({
    path,
    type,
    query,
    format = "json",
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...params,
      paramsSerializer: this.serializeParams,
      headers: {
        ...(params.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: format,
      data: body,
      url: path,
    });
  };
}

/**
 * @title SeqUI Server
 * @version 1.0
 * @baseUrl //seq-ui-server-prod.logging.o-obs.c.o3.ru:80
 * @contact
 */
export class Api {
  http: HttpClient;

  constructor(private axios: AxiosInstance) {
    this.http = new HttpClient(axios);
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1Create
   * @request POST:/dashboards/v1/
   */
  dashboardsV1Create(body: DashboardsV1CreateRequestDto, params: RequestParams = {}) {
    return this.http.request<DashboardsV1CreateResponseDto, UnexpectedErrorDto>({
      path: `/dashboards/v1/`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1GetAll
   * @request POST:/dashboards/v1/all
   */
  dashboardsV1GetAll(body: DashboardsV1GetAllRequestDto, params: RequestParams = {}) {
    return this.http.request<DashboardsV1GetAllResponseDto, UnexpectedErrorDto>({
      path: `/dashboards/v1/all`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1GetMy
   * @request POST:/dashboards/v1/my
   */
  dashboardsV1GetMy(body: DashboardsV1GetMyRequestDto, params: RequestParams = {}) {
    return this.http.request<DashboardsV1GetMyResponseDto, UnexpectedErrorDto>({
      path: `/dashboards/v1/my`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1Search
   * @request POST:/dashboards/v1/search
   */
  dashboardsV1Search(body: DashboardsV1SearchRequestDto, params: RequestParams = {}) {
    return this.http.request<DashboardsV1SearchResponseDto, UnexpectedErrorDto>({
      path: `/dashboards/v1/search`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1GetByUuid
   * @request GET:/dashboards/v1/{uuid}
   */
  dashboardsV1GetByUuid(uuid: string, params: RequestParams = {}) {
    return this.http.request<DashboardsV1DashboardDto, UnexpectedErrorDto>({
      path: `/dashboards/v1/${uuid}`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1Delete
   * @request DELETE:/dashboards/v1/{uuid}
   */
  dashboardsV1Delete(uuid: string, params: RequestParams = {}) {
    return this.http.request<void, UnexpectedErrorDto>({
      path: `/dashboards/v1/${uuid}`,
      method: "DELETE",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags dashboards_v1
   * @name DashboardsV1Update
   * @request PATCH:/dashboards/v1/{uuid}
   */
  dashboardsV1Update(uuid: string, body: DashboardsV1UpdateRequestDto, params: RequestParams = {}) {
    return this.http.request<void, UnexpectedErrorDto>({
      path: `/dashboards/v1/${uuid}`,
      method: "PATCH",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags errorgroups_v1
   * @name ErrorgroupsV1GetDetails
   * @request POST:/errorgroups/v1/details
   */
  errorgroupsV1GetDetails(body: ErrorgroupsV1GetDetailsRequestDto, params: RequestParams = {}) {
    return this.http.request<ErrorgroupsV1GetDetailsResponseDto, UnexpectedErrorDto>({
      path: `/errorgroups/v1/details`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags errorgroups_v1
   * @name ErrorgroupsV1GetGroups
   * @request POST:/errorgroups/v1/groups
   */
  errorgroupsV1GetGroups(body: ErrorgroupsV1GetGroupsRequestDto, params: RequestParams = {}) {
    return this.http.request<ErrorgroupsV1GetGroupsResponseDto, UnexpectedErrorDto>({
      path: `/errorgroups/v1/groups`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags errorgroups_v1
   * @name ErrorgroupsV1GetHist
   * @request POST:/errorgroups/v1/hist
   */
  errorgroupsV1GetHist(body: ErrorgroupsV1GetHistRequestDto, params: RequestParams = {}) {
    return this.http.request<ErrorgroupsV1GetHistResponseDto, UnexpectedErrorDto>({
      path: `/errorgroups/v1/hist`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags errorgroups_v1
   * @name ErrorgroupsV1GetReleases
   * @request POST:/errorgroups/v1/releases
   */
  errorgroupsV1GetReleases(body: ErrorgroupsV1GetReleasesRequestDto, params: RequestParams = {}) {
    return this.http.request<ErrorgroupsV1GetReleasesResponseDto, UnexpectedErrorDto>({
      path: `/errorgroups/v1/releases`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags errorgroups_v1
   * @name ErrorgroupsV1GetServices
   * @request POST:/errorgroups/v1/services
   */
  errorgroupsV1GetServices(body: ErrorgroupsV1GetServicesRequestDto, params: RequestParams = {}) {
    return this.http.request<ErrorgroupsV1GetServicesResponseDto, UnexpectedErrorDto>({
      path: `/errorgroups/v1/services`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags massexport_v1
   * @name MassexportV1Cancel
   * @request POST:/massexport/v1/cancel
   */
  massexportV1Cancel(body: MassexportV1CancelRequestDto, params: RequestParams = {}) {
    return this.http.request<void, UnexpectedErrorDto>({
      path: `/massexport/v1/cancel`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags massexport_v1
   * @name MassexportV1Check
   * @request POST:/massexport/v1/check
   */
  massexportV1Check(body: MassexportV1CheckRequestDto, params: RequestParams = {}) {
    return this.http.request<MassexportV1CheckResponseDto, UnexpectedErrorDto>({
      path: `/massexport/v1/check`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags massexport_v1
   * @name MassexportV1Jobs
   * @request GET:/massexport/v1/jobs
   */
  massexportV1Jobs(params: RequestParams = {}) {
    return this.http.request<MassexportV1GetAllResponseDto, UnexpectedErrorDto>({
      path: `/massexport/v1/jobs`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags massexport_v1
   * @name MassexportV1Restore
   * @request POST:/massexport/v1/restore
   */
  massexportV1Restore(body: MassexportV1RestoreRequestDto, params: RequestParams = {}) {
    return this.http.request<void, UnexpectedErrorDto>({
      path: `/massexport/v1/restore`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags massexport_v1
   * @name MassexportV1Start
   * @request POST:/massexport/v1/start
   */
  massexportV1Start(body: MassexportV1StartRequestDto, params: RequestParams = {}) {
    return this.http.request<MassexportV1StartResponseDto, UnexpectedErrorDto>({
      path: `/massexport/v1/start`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetAggregation
   * @request POST:/seqapi/v1/aggregation
   */
  seqapiV1GetAggregation(body: SeqapiV1GetAggregationRequestDto, params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetAggregationResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/aggregation`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetEvent
   * @request GET:/seqapi/v1/events/{id}
   */
  seqapiV1GetEvent(id: string, params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetEventResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/events/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1Export
   * @request POST:/seqapi/v1/export
   */
  seqapiV1Export(body: SeqapiV1ExportRequestDto, params: RequestParams = {}) {
    return this.http.request<SeqapiV1ExportResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/export`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetFields
   * @request GET:/seqapi/v1/fields
   */
  seqapiV1GetFields(params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetFieldsResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/fields`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetPinnedFields
   * @request GET:/seqapi/v1/fields/pinned
   */
  seqapiV1GetPinnedFields(params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetFieldsResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/fields/pinned`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetHistogram
   * @request POST:/seqapi/v1/histogram
   */
  seqapiV1GetHistogram(body: SeqapiV1GetHistogramRequestDto, params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetHistogramResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/histogram`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetLimits
   * @request GET:/seqapi/v1/limits
   */
  seqapiV1GetLimits(params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetLimitsResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/limits`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1GetLogsLifespan
   * @request GET:/seqapi/v1/logs_lifespan
   */
  seqapiV1GetLogsLifespan(params: RequestParams = {}) {
    return this.http.request<SeqapiV1GetLogsLifespanResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/logs_lifespan`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1Search
   * @request POST:/seqapi/v1/search
   */
  seqapiV1Search(body: SeqapiV1SearchRequestDto, params: RequestParams = {}) {
    return this.http.request<SeqapiV1SearchResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/search`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags seqapi_v1
   * @name SeqapiV1Status
   * @request GET:/seqapi/v1/status
   */
  seqapiV1Status(params: RequestParams = {}) {
    return this.http.request<SeqapiV1StatusResponseDto, UnexpectedErrorDto>({
      path: `/seqapi/v1/status`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags userprofile_v1
   * @name UserprofileV1GetUserProfile
   * @request GET:/userprofile/v1/profile
   */
  userprofileV1GetUserProfile(params: RequestParams = {}) {
    return this.http.request<UserprofileV1UserProfileDto, UnexpectedErrorDto>({
      path: `/userprofile/v1/profile`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags userprofile_v1
   * @name UserprofileV1UpdateUserProfile
   * @request PATCH:/userprofile/v1/profile
   */
  userprofileV1UpdateUserProfile(body: UserprofileV1UpdateUserProfileRequestDto, params: RequestParams = {}) {
    return this.http.request<void, UnexpectedErrorDto>({
      path: `/userprofile/v1/profile`,
      method: "PATCH",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags userprofile_v1
   * @name UserprofileV1GetFavoriteQueries
   * @request GET:/userprofile/v1/queries/favorite
   */
  userprofileV1GetFavoriteQueries(params: RequestParams = {}) {
    return this.http.request<UserprofileV1GetFavoriteQueriesResponseDto, UnexpectedErrorDto>({
      path: `/userprofile/v1/queries/favorite`,
      method: "GET",
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags userprofile_v1
   * @name UserprofileV1CreateFavoriteQuery
   * @request POST:/userprofile/v1/queries/favorite
   */
  userprofileV1CreateFavoriteQuery(body: UserprofileV1CreateFavoriteQueryRequestDto, params: RequestParams = {}) {
    return this.http.request<UserprofileV1CreateFavoriteQueryResponseDto, UnexpectedErrorDto>({
      path: `/userprofile/v1/queries/favorite`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  }

  /**
   * No description
   *
   * @tags userprofile_v1
   * @name UserprofileV1DeleteFavoriteQuery
   * @request DELETE:/userprofile/v1/queries/favorite/{id}
   */
  userprofileV1DeleteFavoriteQuery(id: string, params: RequestParams = {}) {
    return this.http.request<void, UnexpectedErrorDto>({
      path: `/userprofile/v1/queries/favorite/${id}`,
      method: "DELETE",
      ...params,
    });
  }
}
