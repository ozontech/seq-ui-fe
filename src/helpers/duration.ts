import { isDate, parse, sub } from 'date-fns'
import { equals } from 'ramda'
import type { LocationQueryValue } from 'vue-router'

import { utcToZonedTime } from './date-fns-tz'
import { pluralize } from './duration-locale'
import type { Duration } from '@/types/duration'

export const durationToSeconds = (duration: Duration | null | undefined) => {
	if (!duration || duration.date) return 0
	if (duration.forever) {
		return Infinity
	}

	let {
		seconds = 0,
		minutes = 0,
		hours = 0,
		days = 0,
		months = 0,
		weeks = 0,
		years = 0,
	} = duration

	if (seconds < 0) seconds = 0
	if (minutes < 0) minutes = 0
	if (hours < 0) hours = 0
	if (days < 0) days = 0
	if (months < 0) months = 0
	if (weeks < 0) weeks = 0
	if (years < 0) years = 0

	months += years * 12

	// хз как месяцы норм считать
	days += weeks * 7 + months * 30
	hours += days * 24
	minutes += hours * 60
	seconds += minutes * 60

	return seconds <= 0 ? 0 : seconds
}

export const durationToDate = (duration: Duration | null | undefined) => {
	if (!duration || !duration.date) return new Date()

	return duration.date
}

export const durationToISOString = (duration?: Duration) => {
	if (!duration) {
		return new Date().toISOString()
	}
	if (duration.date) {
		return duration.date.toISOString()
	}
	const referenceDate = new Date()
	return sub(referenceDate, duration).toISOString()
}

export const SECONDS_IN_MINUTE = 60
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24
export const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7

export const MS_IN_SECOND = 1000
export const MS_IN_MINUTE = SECONDS_IN_MINUTE * 1000
export const MS_IN_HOUR = SECONDS_IN_HOUR * 1000
export const MS_IN_DAY = SECONDS_IN_DAY * 1000

const secondsMap = {
	seconds: 1,
	minutes: SECONDS_IN_MINUTE,
	hours: SECONDS_IN_HOUR,
	days: SECONDS_IN_DAY,
	weeks: SECONDS_IN_WEEK,
} as const

export const secondsToSingleUnitDuration = (seconds: number): Duration => {
	let units: keyof Duration = 'seconds'
	if (seconds === 0) {
		return {}
	}

	if (seconds === Infinity) {
		return { forever: 1 }
	}

	if (seconds % SECONDS_IN_WEEK === 0) {
		units = 'weeks'
	} else if (seconds % SECONDS_IN_DAY === 0) {
		units = 'days'
	} else if (seconds % SECONDS_IN_HOUR === 0) {
		units = 'hours'
	} else if (seconds % SECONDS_IN_MINUTE === 0) {
		units = 'minutes'
	}

	return { [units]: seconds / secondsMap[units] }
}

type DurationNoDate = keyof Omit<Duration, 'date'>

export const getUnitFromDuration = (duration: Duration | null, type: 'first' | 'any'): DurationNoDate | null => {
	if (duration?.date) {
		return null
	}
	const compareFn = (value: number) => {
		if (type === 'first') {
			return value > 0
		}

		return value >= 0
	}

	const entry = Object
		.entries(duration || {})
		.filter((val) => !isDate(val[1]) && (typeof val[1] === 'boolean' || compareFn(val[1])))[0] as [DurationNoDate, number] | undefined
	return entry ? entry[0] : 'seconds'
}

export const isEmptyDuration = (duration: Duration | null | undefined): boolean => {
	return equals(duration || {}, {})
}

export const msToShortUnits = (ms: number) => {
	if (ms === 0) {
		return '1ms'
	}

	if (ms % MS_IN_DAY === 0) {
		return `${ms / MS_IN_DAY}d`
	}
	if (ms % MS_IN_HOUR === 0) {
		return `${ms / MS_IN_HOUR}h`
	}
	if (ms % MS_IN_MINUTE === 0) {
		return `${ms / MS_IN_MINUTE}m`
	}
	if (ms % MS_IN_SECOND === 0) {
		return `${ms / MS_IN_SECOND}s`
	}
	return `${ms}ms`
}

export const formatDuration = (
	updateTime: Date,
	timeZone: string,
	renderFullDate = false,
) => {
	if (renderFullDate) {
		return dateToLocaleString(updateTime, timeZone)
	}
	const currentTime = utcToZonedTime(new Date(), timeZone)
	const zonedUpdateTime = utcToZonedTime(updateTime, timeZone)
	const differenceInMs = currentTime.valueOf() - zonedUpdateTime.valueOf()
	const differenceInSeconds = Math.floor(differenceInMs / 1000)
	const differenceInMinutes = Math.floor(differenceInSeconds / 60)
	const differenceInHours = Math.floor(differenceInMinutes / 60)

	if (differenceInSeconds < 60) {
		return 'just now'
	} else if (differenceInMinutes < 5) {
		return 'less than 5 minutes ago'
	} else if (differenceInMinutes < 10) {
		return 'less than 10 minutes ago'
	} else if (differenceInMinutes < 30) {
		return 'less than 30 minutes ago'
	} else if (differenceInMinutes < 60) {
		return 'less than an hour ago'
	} else if (differenceInHours < 24) {
		return `${differenceInHours} ${pluralize(differenceInHours, 'hour')}`
	}

	return dateToLocaleString(updateTime, timeZone)
}

export const dateToLocaleString = (date: Date, timeZone: string) => {
	return date.toLocaleString('ru-Ru', { timeZone })
}

export const getTimeFromDashboard = (data: string) => {
	return data.split(', ')?.[0]
}

export const propsStringToDate = (stringDate: string) => {
	// from 24.09.2024, 11:47:02 to format: 2021-01-01T00:00:00Z
	// then parse to Date
	return parse(stringDate, 'dd.MM.yyyy, kk:mm:ss', new Date())
}

export const secondsToDate = (seconds: number | undefined) => {
	if (seconds) {
		return new Date(Date.now() - seconds * 1000)
	}
	return new Date()
}

export const durationToAbsolute = (from: Duration | undefined, to?: Duration) => {
	if (from?.date) {
		return {
			from: from.date,
			to: to?.date || durationToDate(to),
		}
	}
	const absoluteFrom = secondsToDate(durationToSeconds(from))
	const absoluteTo = secondsToDate(durationToSeconds(to))
	return {
		from: absoluteFrom,
		to: absoluteTo,
	}
}

export const queryToDuration = (query: LocationQueryValue | LocationQueryValue[], defaultValue: Duration | undefined = undefined) => {
	const inDuration = query && secondsToSingleUnitDuration(Number(query))

	return inDuration || defaultValue
}
export const stringToDuration = (stringDuration: string): Duration => {
	if (!stringDuration?.trim()) return {}

	const regex = /(\d+)(d|h|m|s)(?:\.\d*)?/g
	const matches = stringDuration.matchAll(regex)
	const result: Duration = {}

	for (const match of matches) {
		const value = parseInt(match[1], 10)
		const unit = match[2]
		if (!value) continue

		switch (unit) {
			case 'd': result.days = value; break
			case 'h': result.hours = value; break
			case 'm': result.minutes = value; break
			case 's': result.seconds = value; break
		}
	}

	return result
}

export const durationToString = (duration: Duration): string => {
	if (!duration) return ''

	const parts: string[] = []

	if (duration.days) parts.push(`${duration.days}d`)
	if (duration.hours) parts.push(`${duration.hours}h`)
	if (duration.minutes) parts.push(`${duration.minutes}m`)
	if (duration.seconds) parts.push(`${duration.seconds}s`)

	return parts.join(' ')
}
