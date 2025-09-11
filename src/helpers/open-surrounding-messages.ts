import { addSeconds, subSeconds } from 'date-fns'

import type { Message } from '@/types/messages'
import router from '@/router'

export const openSurroundingMessages = (
	message: Message,
	secondsString: string,
	query?: string | null,
) => {
	const seconds = Number(secondsString)
	const from = subSeconds(message.timestamp, seconds).toISOString()
	const to = addSeconds(message.timestamp, seconds).toISOString()
	let q = query || ''
	const oldQuery = router.currentRoute.value.query
	if (message.service) {
		if (q.includes(':')) {
			q = q.trim() + ` AND service:"${message.service}"`
		} else {
			q = `service:"${message.service}"`
		}
	}

	const routeQuery: Record<string, string> = {
		...oldQuery,
		from,
		to,
		rangetype: 'absolute',
	}

  if (q) {
    routeQuery.q = q
  }

	const origin = window.location.origin
	const params = new URLSearchParams(routeQuery).toString()

  open(`${origin}/?${params}`)
}
