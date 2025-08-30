import { useBlocks } from '@/composables/blocks'
import type { Dashboard, ImportantDashboard, DashboardExtras } from '@/types/dashboards'

export const getDefaultDashboard = (): Dashboard => {
	const blocks = useBlocks()
	return ({
		name: '',
		blocks,
		columns: [],
	})}

export const getDefaultSavedDashboard = (): DashboardExtras[] => [{
	aggregations: [],
	columns: [],
	histogram: false,
	query: undefined,
	name: undefined,
}]

export const useImportantDashboards = () => {
	const dashboards: ImportantDashboard[] = []

	return {
		dashboards: dashboards.filter(({ id }) => id.length > 0),
	}
}
