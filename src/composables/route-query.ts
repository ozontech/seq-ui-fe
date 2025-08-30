import { ref } from 'vue'
import { mergeRight } from 'ramda'
import { useRouter, useRoute } from 'vue-router'
import { useDebounceFn} from '@vueuse/core'
import type { LocationQueryRaw } from 'vue-router'
import type { Optional } from 'utility-types'

export type LocationQuery = Optional<LocationQueryRaw>

export const useRouteQuery = () => {
	const batchQueue = ref<LocationQuery[]>([])
	const router = useRouter()
	const route = useRoute()

	const processBatchUpdate = () => {
		const result = batchQueue.value.reduce<LocationQuery>((acc, cur) => {
			return mergeRight(acc, cur)
		}, {})

		router.push({ query: mergeRight(route.query, result) })
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
		const clearQuery = Object.keys(route.query)
			.map((key) => [key, key === 'env' ? route.query[key] : undefined])
		batch(Object.fromEntries(clearQuery))
	}

	return {
		batch,
		clear,
	}
}
