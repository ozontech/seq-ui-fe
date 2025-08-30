import { useRoute } from 'vue-router'
import { QUERY_KEYS } from '@/constants/search'

export const addToQuery = (query: string, key: string, value: string) => {
	const existsRegexpString = `${key}:\\s*"?${value}"?`
	const existsRegexp = new RegExp(existsRegexpString)
	const hasOppositeRegexp = new RegExp(`(?:(AND|OR)\\s+)?NOT\\s+${existsRegexpString}`)

	const oppositeMatches = hasOppositeRegexp.exec(query)
	const quote = value.includes(' ') ? '"' : ''
	const result = `${key}:${quote}${value}${quote}`
	if (query.trim() === '') {
		return result
	}

	if (oppositeMatches) {
		const [match, conjunction] = oppositeMatches
		return query.replaceAll(match, `${conjunction} ${result}`).trim()
	}

	if (existsRegexp.test(query)) {
		return query
	}

	// TODO: доработать логику, добавить условие на то, что OR находится не в скобках
	// TODO: если уже есть ключ с другим значением мб добавлять новое как OR ?
	if (query.includes(' OR ') && !query.startsWith('(') && !query.endsWith(')')) {
		return `(${query}) AND ${result}`
	}
	return `${query} AND ${result}`
}

export const getQueryUrl = (query: string) => {
	const { from, to, rangetype, env } = useRoute().query
	const originalQuery = {} as Record<string, string>

	if (from) {
		originalQuery.from = from.toString()
	}

	if (to) {
		originalQuery.to = to.toString()
	}

	if (rangetype) {
		originalQuery.rangetype = rangetype.toString()
	}

	if (env) {
		originalQuery.env = env.toString()
	}

	const params = new URLSearchParams({
		q: query,
		...originalQuery,
	})

	return new URL(`/?${params}`, document.location.origin).toString()
}

export const indexKey = (id = 0, key: string) => {
	if (id === 0) {
		return key
	}
	return `${key}.${id}`

}

export const indexQueryKeys = (id = 0, keys = QUERY_KEYS) => {
	if (id === 0) {
		return keys
	}
	return keys.map((key) => indexKey(id, key))
}

export const pickByIndex = (query: Record<string, string | undefined>, index = 0, keys: string[] = QUERY_KEYS) => {
	const entries = keys.reduce<[string, string | undefined][]>((acc, key) => {
		const _key = indexKey(index, key)
		const value = query[_key]
		acc.push([key, value])
		return acc
	}, [])
	return Object.fromEntries(entries)
}
