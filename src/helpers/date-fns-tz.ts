import { toZonedTime, fromZonedTime } from 'date-fns-tz'

export const utcToZonedTime = (date: Date | string | number, timezone: string) => {
	return toZonedTime(date, timezone)
}

export const zonedTimeToUtc = (date: Date | string | number, timezone: string) => {
	return fromZonedTime(date, timezone)
}
