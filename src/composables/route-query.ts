import { ref } from 'vue'
import { mergeRight } from 'ramda'
import { useDebounceFn } from '@vueuse/core'
import type { LocationQueryRaw } from 'vue-router'
import type { Optional } from 'utility-types'
import router from '~/router'

export type LocationQuery = Optional<LocationQueryRaw>

export const useRouteQuery = () => {
	const batchQueue = ref<LocationQuery[]>([])

	const processBatchUpdate = () => {
		const result = batchQueue.value.reduce<LocationQuery>((acc, cur) => {
			return mergeRight(acc, cur)
		}, {})

		router.push({ query: mergeRight(router.currentRoute.value.query, result) })
		batchQueue.value = []
	}

	const processBatchUpdateDebounced = useDebounceFn(processBatchUpdate, 100)

	const batch = (arg: LocationQuery | LocationQuery[]) => {
		// processBatchUpdateDebounced.cancel()

		if (Array.isArray(arg)) {
			batchQueue.value.push(...arg)
		} else {
			batchQueue.value.push(arg)
		}

		processBatchUpdateDebounced()
	}

	const clear = () => {
		const clearQuery = Object.keys(router.currentRoute.value.query)
			.map((key) => [key, key === 'env' ? router.currentRoute.value.query[key] : undefined])
		batch(Object.fromEntries(clearQuery))
	}

	return {
		batch,
		clear,
	}
}
