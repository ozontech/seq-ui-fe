import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useDashboardsStore } from './dashboards'

import { timezoneNameToObject, timezonesToOptions } from '@/helpers/timezones'

const defaultTimezone = () => timezoneNameToObject(Intl?.DateTimeFormat?.().resolvedOptions().timeZone || 'Europe/Moscow')
const LS_TIMEZONE_KEY = 'LOGGING_TIMEZONE'

export const useTimezoneStore = defineStore('timezone', () => {
	const fetchTimezoneLists = () => {
		const date = new Date()
		const intlTimezones = Intl.supportedValuesOf('timeZone') || ['Europe/Moscow']
		const timezones: string[] = [...new Set([...intlTimezones, 'UTC'])]
		const timezoneObjects = timezones.map((name) => timezoneNameToObject(name, date))
		const options = timezonesToOptions(timezoneObjects)

		return options
	}

	const lsTZValue = localStorage.getItem(LS_TIMEZONE_KEY)

	const timezone = ref(lsTZValue ? timezoneNameToObject(lsTZValue) : defaultTimezone())
	const timezonesOptions = ref(fetchTimezoneLists())

	const saveTimezone = (name: string) => {
		const store = useDashboardsStore()
		const tz = timezoneNameToObject(name)
		timezone.value = tz
		store.blocks.getBlocks().map((block) => {
			block.messages.changeTimezone(name)
		})
		localStorage.setItem(LS_TIMEZONE_KEY, timezone.value.name)
	}

	return {
		fetchTimezoneLists,
		timezone,
		timezonesOptions,
		saveTimezone,
	}
})
