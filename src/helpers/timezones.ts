import { formatInTimeZone } from 'date-fns-tz'

import type { Timezone } from '~/types/timezone'

export const timezoneToText = ({ name, timezone }: Timezone) => `${name} (${timezone})`

export const timezonesToOptions = (timezones: Timezone[]) => {
	return timezones.map((tz) => {
		const text = timezoneToText(tz)
		return {
			label: text,
			value: tz.name,
		}
	})
}

export const timezoneNameToObject = (name: string, date?: Date) => ({
	name,
	timezone: formatInTimeZone(date || new Date(), name, 'zzz'),
})
