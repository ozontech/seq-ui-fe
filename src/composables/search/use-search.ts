import { useInterval } from '~/composables/search/use-interval'
import { useQuery } from '~/composables/search/use-query'

export const useSearch = () => {
	const intervalParams = useInterval({ minutes: 5 })
	const queryParams = useQuery()

	return {
		intervalParams,
		queryParams,
	}
}
