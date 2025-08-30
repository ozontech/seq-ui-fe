import { ref } from 'vue'
import { subSeconds } from 'date-fns'

import { durationToSeconds } from './duration'
import type { Duration } from '@/types/duration'

export const useLastRelative = () => {
	const lastRelative = ref<Duration | null>(null)

	const extractRelative = (
		from: Duration,
		refDate = new Date(),
	) => {
		if (from.date) {
			return
		}

		lastRelative.value = from

		return {
			to: refDate,
			from: subSeconds(refDate, durationToSeconds(lastRelative.value)),
		} as const
	}

	const setRelative = () => {
		if (lastRelative.value) {
			const returnValue = {
				from: { ...lastRelative.value },
			} as const

			lastRelative.value = null

			return returnValue
		}
	}

	return {
		lastRelative,
		extractRelative,
		setRelative,
	}
}
