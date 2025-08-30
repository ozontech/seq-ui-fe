import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Keyword, TextFieldsMap } from '@/types/tokens'
import { getApi } from '@/api/client'

export const useTokensStore = defineStore('tokens', () => {
	const keywords = ref<Keyword[]>([])
	const textFieldsMap = ref<TextFieldsMap>({})

	const isFieldIndexed = (field: string | null): field is string => {
		return Boolean(field && textFieldsMap.value[field])
	}

	const setKeywords = (newKeywords: Keyword[]) => {
		const sortedKeywords = [...newKeywords].sort((a, b) => a.name!.localeCompare(b.name!))

		keywords.value = sortedKeywords
		textFieldsMap.value = sortedKeywords.reduce<TextFieldsMap>((acc, {
			name = '',
			type = '',
		}) => {
			return type !== 'text' && type !== 'keyword'
				? acc
				: {
					...acc,
					[name]: type,
				}
		}, {})
	}

	const fetchKeywords = async () => {
		if (keywords.value.length) {
			return
		}
		const result = await getApi().seqUiServer.fetchKeywords()
		setKeywords(result)
	}

	return {
		keywords,
		textFieldsMap,

		isFieldIndexed,
		fetchKeywords,
	}
})
