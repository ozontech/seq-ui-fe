import type { Duration } from "@/types/duration"

export const DEFAULT_LIMIT = 100
export const DEFAULT_DASHBOARDS_LIMIT = 10
export const DEFAULT_ERROR_GROUPS_LIMIT = 20

export const MIN_EXPORT_LIMIT = 1000

export const defaultFrom = (): Duration => ({
  minutes: 5,
})

export const QUERY_KEYS = ['q', 'from', 'to', 'rangetype', 'page']

export const DEFAULT_CHART_WIDTH = 30
