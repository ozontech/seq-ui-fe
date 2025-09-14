import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getApi } from '~/api/client'

export const LS_TOURS_KEY = 'LOGGING_TOURS'
export const LS_COLUMNS_KEY = 'LOGGING_COLUMNS'

export const useConfigStore = defineStore('config', () => {
	const completedTours = ref <Record<string, boolean>>({})
	const selectedColumns = ref<string[]>([])
	const fields = ref<string[]>([])
	const logsLifespan = ref<number | undefined>()
	const exportLimit = ref(100_000)

	const setCompletedTours = (tours: Record<string, boolean>) => {
		completedTours.value = tours
	}

	const setSelectedColumns = (columns: string[], shouldAddColumn = false) => {
		if (!shouldAddColumn) {
			selectedColumns.value = fields.value.length > 0 ? fields.value : columns
			return
		}
		selectedColumns.value = columns
	}

	const setFields = (currentFields: string[]) => {
		fields.value = currentFields
	}

	const loadConfig = () => {
		const lsToursValue = localStorage.getItem(LS_TOURS_KEY)
    if (lsToursValue) {
      setCompletedTours(JSON.parse(lsToursValue))
    }
	}

	const loadDashboardColumns = () => {
		let result: string[] | undefined = fields.value
		if (!result.length) {
			result = selectedColumns.value.length ? selectedColumns.value : localStorage.getItem(LS_COLUMNS_KEY)?.split(',')
		}
		setSelectedColumns(result && result[0].length ? result : [])
	}

	const fetchLimits = async () => {
		const limits = await getApi().seqUiServer.getLimits()
		// TODO
		// useAggregations().limit.value = limits.maxAggregationsPerRequest || 1
		exportLimit.value = limits.maxExportLimit || 100_000
	}

	const fetchLogsLifespan = async () => {
		const lifespan = await getApi().seqUiServer.getLogsLifespan()
		logsLifespan.value = lifespan.lifespan
	}

	return {
		completedTours,
		selectedColumns,
		fields,
		logsLifespan,
		exportLimit,
		setCompletedTours,
		setSelectedColumns,
		setFields,
		loadConfig,
		loadDashboardColumns,
		fetchLimits,
		fetchLogsLifespan,
	}
})
