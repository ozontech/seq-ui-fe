import { format } from 'date-fns-tz'

import { utcToZonedTime } from '@/helpers/date-fns-tz'
import type { ErrorgroupsV1BucketDto, SeqapiV1HistogramBucketDto } from '@/api/generated/seq-ui-server'
import type { Histogram } from '@/types/shared'
import { useTimezoneStore } from '@/stores/timezone'

export const formatHistogramDate = (date: Date, tz: string) => format(utcToZonedTime(date, tz), 'yyyy-MM-dd HH:mm:ss.SSS')

const WIDTH_GAP_RATE = 1.2

export const normalizeBuckets = (buckets: SeqapiV1HistogramBucketDto[], width?: number) => {
  const timezone = useTimezoneStore().timezone.name

  return buckets.reduce((acc, cur) => {
    try {
      const date = new Date(Number(cur.key))
      return {
        // 2013-10-04 22:23:00.000
        x: [...acc.x, formatHistogramDate(date, timezone)],
        // изначальный таймстемп для перевода в другие таймзоны
        _x: [...acc._x, date],
        y: [...acc.y, Number(cur.docCount)],
        // длина бакета
        width: typeof width === 'undefined' ? undefined : width / WIDTH_GAP_RATE,
      }
    } catch {
      return acc
    }
  }, {
    x: [],
    _x: [],
    y: [],
  } as Histogram)
}

export const normalizeErrorBuckets = (buckets: ErrorgroupsV1BucketDto[], tz: string, width?: number) => {
  return buckets.reduce<Histogram>((acc, item) => {
    try {
      const { time = '', count = 0 } = item
      const date = new Date(time)

      acc.x.push(formatHistogramDate(date, tz))
      acc._x.push(date)
      acc.y.push(count)

      return acc
    } catch {
      return acc
    }
  }, {
    x: [],
    _x: [],
    y: [],
    width: typeof width === 'undefined' ? undefined : width / WIDTH_GAP_RATE,
  })
}
