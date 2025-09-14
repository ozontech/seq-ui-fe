import type { Duration } from '~/types/duration'

export type Histogram = {
  x: string[]
  y: number[]

  // изначальный таймстемп для перевода в другие таймзоны
  _x: Date[]
  width?: number
}

export interface Interval {
  from: Duration
  to: Duration
}

export type LiteralUnion<T extends U, U = string> = T | (U & {})

export type SortDirection = 'asc' | 'desc'
