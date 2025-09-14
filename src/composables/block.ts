import { ref } from 'vue'
import { isEqual } from 'lodash'
import { useRoute } from 'vue-router'

import { useMessages } from './messages'
import { useCounter } from './use-counter'
import { useRouteQuery } from './route-query'

import { useSearchStore } from '~/stores/search'

export const useBlock = (_id = 0, opened = false) => {
  const route = useRoute()
	const id = _id || useCounter().getValue()

	const params = useSearchStore().getParams(id)
	const messages = useMessages(id)

	const name = ref<string | undefined>('')
	const isOpened = ref(opened)

	const fetch = async () => {
		messages.fetchMessages()
	}

	const setName = (value?: string) => name.value = value
	const toggleIsOpened = () => {
		isOpened.value = !isOpened.value
		// todo: слишком тупая проверка, будут лишние запросы
		if (isOpened.value && messages.messages.value.length === 0) {
			fetch()
		}
	}

	const saveToUrl = (object: Record<string, string | undefined>) => {
		const index = id === 0 ? '' : `.${id}`
		const query = route.query
		const objectWithTrimmedValues = Object.fromEntries(Object.entries(object).map(([key, value]) => [`${key}${index}`, value?.trim()]))
		if (isEqual(objectWithTrimmedValues, query)) {
			return
		}

		const newQuery = {
			...query,
			...objectWithTrimmedValues,
			...objectWithTrimmedValues.rangetype === 'relative' ? { to: undefined } : {},
		}

		useRouteQuery().batch({
			...newQuery,
		})
	}

	return {
		id,
		name,
		setName,
		queryParams: params.queryParams,
		intervalParams: params.intervalParams,
		messages,
		isOpened,
		toggleIsOpened,
		fetch,
		//todo: add test
		saveToUrl,
	}
}
