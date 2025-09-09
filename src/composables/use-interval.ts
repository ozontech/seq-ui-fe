import type { Duration } from "@/types/duration";
import { useRouteQuery } from '@vueuse/router'
import { defaultFrom } from "@/constants/search";
import { sub } from "date-fns";
import { isDate } from "lodash";
import { durationToSeconds } from "@/helpers/duration";
import { secondsToDuration } from "@/helpers/duration-locale";
import { watch } from "vue";

const valueToQuery = (arg?: Duration) => {
  if (!arg) {
    return undefined
  }

  const date = isDate(arg) ? arg : arg.date

  if (date) {
    return date.toISOString()
  }

  return durationToSeconds(arg as Duration).toString()
}

const queryToValue = (arg: string | undefined): Duration => {
  if (!arg) {
    return {}
  }
  if (typeof Number(arg) === 'number') {
    return secondsToDuration(Number(arg))
  }
  const date = new Date(arg)
  return { date }
}

export const useInterval = (
  initialFrom: Duration = defaultFrom(),
  initialTo: Duration = {},
) => {
  const from = useRouteQuery<string | undefined, Duration>('from', valueToQuery(initialFrom), {
    transform: {
      get: queryToValue,
      set: valueToQuery,
    }
  })

  const to = useRouteQuery<string | undefined, Duration>('to', valueToQuery(initialTo), {
    transform: {
      get: queryToValue,
      set: valueToQuery,
    }
  })

  const setInterval = (newFrom?: Duration, newTo?: Duration) => {
    from.value = newFrom ?? defaultFrom()
    to.value = newTo ?? {}
  }

  const toDates = () => {
    const _from = from.value
    const _to = to.value
    if (_from.date && _to.date) {
      return {
        from: _from.date.toISOString(),
        to: _to.date.toISOString(),
      }
    }
    if (!_from.date && !_to.date) {
      // to utc
      const referenceDate = new Date()
      return {
        from: sub(referenceDate, _from).toISOString(),
        to: sub(referenceDate, _to).toISOString(),
      }
    }

    throw new Error('Dates have different types ><')
  }

  return {
    from,
    to,
    setInterval,
    toDates,
  }
}
