import { defineStore } from 'pinia'

import { useSearch } from '@/composables/search/use-search'

// todo: rewrite
export const useSearchStore = defineStore('search', () => {
	const paramsMap = new Map<number, ReturnType<typeof useSearch>>()

	const getParams = (id: number) => {
		if (paramsMap.has(id)) {
			return paramsMap.get(id)!
		}

		const search = useSearch()

		paramsMap.set(id, search)
		return paramsMap.get(id)!
	}

	const clear = () => {
		paramsMap.clear()
	}

	return {
		paramsMap,
		getParams,
		clear,
	}
})
