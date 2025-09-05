import type { Duration } from '@/types/duration'
import {
  getUnitFromDuration,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from './duration'

import { pluralize } from './pluralize'

export const locale: Record<string, [string, string, string]> = {
  seconds: ['секунда', 'секунды', 'секунд'],
  minutes: ['минута', 'минуты', 'минут'],
  hours: ['час', 'часа', 'часов'],
  days: ['день', 'дня', 'дней'],
  weeks: ['неделя', 'недели', 'недель'],
  months: ['месяц', 'месяца', 'месяцев'],
  years: ['год', 'года', 'лет'],
}

export const localeAccusative: Record<string, [string, string, string]> = {
  seconds: ['секунду', 'секунды', 'секунд'],
  minutes: ['минуту', 'минуты', 'минут'],
  hours: ['час', 'часа', 'часов'],
  days: ['день', 'дня', 'дней'],
  weeks: ['неделю', 'недели', 'недель'],
  months: ['месяц', 'месяца', 'месяцев'],
  years: ['год', 'года', 'лет'],
}

// russian stuff
const getLastForUnit = (
  amount: number,
  unit: keyof Duration,
  wordCase: 'nominative' | 'accusative',
) => {
  if (amount % 100 === 11 || amount % 10 !== 1) {
    return 'Последние'
  }
  if (['seconds', 'minutes', 'weeks'].includes(unit)) {
    return wordCase === 'nominative' ? 'Последняя' : 'Последнюю'
  }
  return 'Последний'
}

export const durationToMessage = (
  value: Duration,
  wordCase: 'nominative' | 'accusative' = 'nominative',
) => {
  const unit = getUnitFromDuration(value, 'first')
  const _amount = unit ? value[unit] : null
  if (!unit || !_amount) {
    return
  }
  if (typeof _amount === 'boolean') {
    return ['все', '', 'время']
  }
  const last = getLastForUnit(_amount, unit, wordCase)
  const amount = `${_amount === 1 ? '' : _amount}`
  const casedLocale = wordCase === 'nominative' ? locale : localeAccusative
  const units = `${pluralize(_amount, casedLocale[unit])}`

  return [last, amount, units]
}

export const getPluralizedUnit = (unit: keyof Duration, amount: number | null) => {
  const units = `${pluralize(amount || 0, locale[unit])}`

  return units
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

export const durationToText = (duration: Duration) => {
  let str = ''
  if (duration.years) {
    str += ` ${duration.years} ${pluralize(duration.years, ['год', 'года', 'лет'])}`
  }
  if (duration.months) {
    str += ` ${duration.months} ${pluralize(duration.months, ['месяц', 'месяца', 'месяцев'])}`
  }
  if (duration.weeks) {
    str += ` ${duration.weeks} ${pluralize(duration.weeks, ['неделя', 'недели', 'недель'])}`
  }
  if (duration.days) {
    str += ` ${duration.days} ${pluralize(duration.days, ['день', 'дня', 'дней'])}`
  }
  if (duration.hours) {
    str += ` ${duration.hours} ${pluralize(duration.hours, ['час', 'часа', 'часов'])}`
  }
  if (duration.minutes) {
    str += ` ${duration.minutes} ${pluralize(duration.minutes, ['минута', 'минуты', 'минут'])}`
  }
  if (duration.seconds) {
    str += ` ${duration.seconds} ${pluralize(duration.seconds, ['секунда', 'секунды', 'секунд'])}`
  }
  return str.trim()
}

export const durationToShortText = (duration: Duration) => {
  let str = ''

  if (duration.years) {
    str += ` ${duration.years} г`
  }
  if (duration.months) {
    str += ` ${duration.months} мес`
  }
  if (duration.weeks) {
    str += ` ${duration.weeks} нед`
  }
  if (duration.days) {
    str += ` ${duration.days} д`
  }
  if (duration.hours) {
    str += ` ${duration.hours}ч`
  }
  if (duration.minutes) {
    str += ` ${duration.minutes}мин`
  }
  if (duration.seconds) {
    str += ` ${duration.seconds}с`
  }
  return str.trim()
}
