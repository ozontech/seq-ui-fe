import type { Duration } from '@/types/duration'
import {
  getUnitFromDuration,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from './duration'

export const durationToMessage = (
  value: Duration,
) => {
  const unit = getUnitFromDuration(value, 'first')
  const _amount = unit ? value[unit] : null
  if (!unit || !_amount) {
    return
  }
  const amount = `${_amount === 1 ? '' : _amount}`
  const units = `${!amount ? unit.slice(0, -1) : unit}`

  return ['Last', amount, units]
}

export const secondsToDuration = (value?: number): Duration => {
  if (!value) return {}
  const durationObject: Duration = {}
  let last = value

  if (last > SECONDS_IN_DAY) {
    const days = Math.floor(last / SECONDS_IN_DAY)
    durationObject.days = days
    last = last - days * SECONDS_IN_DAY
  }
  if (last > SECONDS_IN_HOUR) {
    const hours = Math.floor(last / SECONDS_IN_HOUR)
    durationObject.hours = hours
    last = last - hours * SECONDS_IN_HOUR
  }
  if (last > SECONDS_IN_MINUTE) {
    const minutes = Math.floor(last / SECONDS_IN_MINUTE)
    durationObject.minutes = minutes
    last = last - minutes * SECONDS_IN_MINUTE
  }
  if (last > 0) {
    durationObject.seconds = last
  }

  return durationObject
}

export const pluralize = (amount: number, word: string) => {
  if (amount === 1) {
    return word
  }
  return word + 's'
}

export const durationToText = (duration: Duration) => {
  let str = ''
  if (duration.years) {
    str += ` ${duration.years} ${pluralize(duration.years, 'year')}`
  }
  if (duration.months) {
    str += ` ${duration.months} ${pluralize(duration.months, 'month')}`
  }
  if (duration.weeks) {
    str += ` ${duration.weeks} ${pluralize(duration.weeks, 'week')}`
  }
  if (duration.days) {
    str += ` ${duration.days} ${pluralize(duration.days, 'day')}`
  }
  if (duration.hours) {
    str += ` ${duration.hours} ${pluralize(duration.hours, 'hour')}`
  }
  if (duration.minutes) {
    str += ` ${duration.minutes} ${pluralize(duration.minutes, 'minute')}`
  }
  if (duration.seconds) {
    str += ` ${duration.seconds} ${pluralize(duration.seconds, 'second')}`
  }
  return str.trim()
}

export const durationToShortText = (duration: Duration) => {
  let str = ''

  if (duration.years) {
    str += ` ${duration.years} y`
  }
  if (duration.months) {
    str += ` ${duration.months} mo`
  }
  if (duration.weeks) {
    str += ` ${duration.weeks} w`
  }
  if (duration.days) {
    str += ` ${duration.days} d`
  }
  if (duration.hours) {
    str += ` ${duration.hours}h`
  }
  if (duration.minutes) {
    str += ` ${duration.minutes}m`
  }
  if (duration.seconds) {
    str += ` ${duration.seconds}s`
  }
  return str.trim()
}
