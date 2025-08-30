import { useRouter } from 'vue-router'

export const openDashboard = (id: string, datasource?: string) => {
	const router = useRouter()

	router.push({
		name: 'datasource-dashboard-id',
		params: {
			datasource: datasource || router.currentRoute.value.params.datasource,
			id,
		},
		query: {
			env: router.currentRoute.value.query.env,
		},
	})
}

export const closeDashboard = () => {
	const router = useRouter()

	router.push({
		name: 'datasource-dashboard-id',
		params: {
			datasource: router.currentRoute.value.params.datasource,
			id: undefined,
		},
		query: {
			env: router.currentRoute.value.query.env,
		},
	})
}
