import { ref } from 'vue'

interface QueryOption {
	type: 'add' | 'exclude'
	key: string
	value: string
}

function normalizeValue(value: string) {
	return value.replaceAll('"', '\\"').replaceAll(/(\t)|(\n)/g, '')
}

export const useQuery = () => {
	const query = ref<string>('')

	const editQuery = ({
		type,
		key,
		value,
	}: QueryOption) => {
		const shieldedValue = `"${normalizeValue(value)}"`
		const _query = `${key}:${shieldedValue}`
		const exclude = type === 'exclude'
		if (query.value.trim() === '') {
			query.value = `${exclude ? 'NOT ' : ''}${_query}`
		} else {
			query.value += ` AND${exclude ? ' NOT' : ''} ${_query}`
		}
	}

	return {
		query,
		editQuery,
	}

}
