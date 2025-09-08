import type { Duration } from "@/types/duration";
import { useRouteQuery } from '@vueuse/router'
import { defaultFrom } from "@/constants/search";
import { sub } from "date-fns";

const valueToQuery = (arg?: Duration | Date) => {
  if (!arg) {
    return undefined
  }

  return JSON.stringify(arg)
}

const queryToValue = (arg: string): Duration => {
  try {
    return JSON.parse(arg)
  } catch {
    return { date: new Date(arg) }
  }
}

export const useInterval = (
  initialFrom: Duration | Date = defaultFrom(),
  initialTo: Duration | Date = {},
) => {
  const from = useRouteQuery('from', valueToQuery(initialFrom), {
    transform: {
      get: (value: string): Duration => queryToValue(value),
      set: (value: Duration) => JSON.stringify(value),
    }
  })

  const to = useRouteQuery('to', valueToQuery(initialTo), {
    transform: {
      get: (value: string): Duration => queryToValue(value),
      set: (value: Duration) => JSON.stringify(value),
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
