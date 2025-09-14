import { computed, ref } from 'vue'
import { isDate, sub } from 'date-fns'

import { defaultFrom } from '~/constants/search'
import { durationToSeconds, getUnitFromDuration } from '~/helpers/duration'
import type { Duration } from '~/types/duration'
import type { IntervalType } from '~/types/input'

const getType = (from?: Duration, to?: Duration): IntervalType => {
  if (from?.date && to?.date) {
    return 'absolute'
  }
  return 'relative'
}

const getValue = (arg?: Duration | Date) => {
  if (!arg) {
    return {}
  }
  if (isDate(arg)) {
    return { date: arg }
  }
  return arg
}

export const useInterval = (_from?: Duration | Date, _to?: Duration | Date) => {
  const from = ref<Duration>(getValue(_from))
  const to = ref<Duration>(getValue(_to))

  const setFrom = (value?: Duration | Date) => {
    from.value = getValue(value)
  }

  const setTo = (value?: Duration | Date) => {
    to.value = getValue(value)
  }

  const setInterval = (_from?: Duration | Date, _to?: Duration | Date) => {
    setFrom(_from || defaultFrom())
    setTo(_to)
  }

  const fromUnits = computed<keyof Duration | null>(() => {
    return getUnitFromDuration(from.value, 'first')
  })

  const toUnits = computed<keyof Duration | null>(() => {
    return getUnitFromDuration(to.value, 'first')
  })

  const rangetype = computed<IntervalType>(() => getType(from.value, to.value))

  const toQueryParams = () => {
    const _from = from.value
    const _to = to.value
    const params = new URLSearchParams({
      rangetype: getType(_from, _to),
    })
    if (_from.date && _to.date) {
      const dates = toDates()
      params.set('from', dates.from)
      params.set('to', dates.to)
    } else {
      params.set('from', durationToSeconds(_from).toString())
      const toSeconds = durationToSeconds(_to)
      if (toSeconds) {
        params.set('to', toSeconds.toString())
      }
    }
    return Object.fromEntries(params)
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
    fromUnits,
    toUnits,
    rangetype,
    setFrom,
    setTo,
    setInterval,
    toDates,
    toQueryParams,
  }
}
