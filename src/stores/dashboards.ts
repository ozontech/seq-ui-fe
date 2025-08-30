import { computed, ref, nextTick } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { defineStore } from 'pinia'
import { equals } from 'ramda'
import { Notification } from '@/ui'
import { useNuxtApp } from '@/composables/use-nuxt-app'
import { useRoute } from 'vue-router'
import type { Optional } from 'utility-types'

import { useProfileStore } from './profile'

import { getDefaultDashboard } from '@/helpers/dashboards'
import type { Dashboard, DashboardInfo, DashboardSaved, SearchDashboardsBody } from '@/types/dashboards'
import { getApi } from '@/api/client'
import { useRouteQuery } from '@/composables/route-query'
import { DEFAULT_DASHBOARDS_LIMIT } from '@/constants/search'
import { useBlocks } from '@/composables/blocks'
import { closeDashboard, openDashboard } from '@/helpers/dashboard'
import { useCounter } from '@/composables/use-counter'

export const SAME_NAME_EXISTS_ERROR_MESSAGE = 'Дашборд с таким именем уже существует'
export const EMPTY_NAME_ERROR_MESSAGE = 'Введите название дашборда'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pickToCompare = ({ ownerName, name, ...rest }: Optional<Dashboard>) => rest

export const useDashboardsStore = defineStore('dashboards', () => {
	const api = getApi()
	const profileStore = useProfileStore()
	const routeQuery = useRouteQuery()

	const exportLimit = ref(100_000)
	const blocks = useBlocks()

	const logsLifespan = ref<number | undefined>()

	const limit = ref(DEFAULT_DASHBOARDS_LIMIT)
	const offset = ref(0)

	const hasMoreDashboards = ref(false)

	const dashboards = ref<DashboardInfo[]>([])
	const dashboard = ref<Dashboard>()
	const dashboardName = ref(getDefaultDashboard().name)
	const selectedUuid = ref(useRoute().params.id as string || '')

	const isFetching = ref(false)

	const currentDashboard = computed(() => {
		return {
			name: dashboardName.value,
			blocks,
		}
	})

	const hasDashboardChanged = computed(() => {
		const db = dashboard.value
		const current = pickToCompare(currentDashboard.value)

		if (db) {
			if (equals(pickToCompare(current), pickToCompare(getDefaultDashboard()))) {
				return false
			}
			return !equals(current, pickToCompare(db))
		}

		return !equals(current, pickToCompare(getDefaultDashboard()))
	})

	const canEdit = computed(() => {
		const owner = dashboard.value?.ownerName
		return useNuxtApp().$keycloak.username === owner
	})

	const setDefaultBlocks = () => {
		blocks.clearBlocks() // Удалить старые
		const block = blocks.addBlock(0, true) // Добавить хотя бы 1 новый
		return block
	}

	async function setDashboard(db: DashboardSaved | undefined, uuid: string) {
		selectedUuid.value = uuid
		dashboard.value = {
			name: db?.name || '',
			ownerName: db?.ownerName,
			columns: db?.columns,
		}

		blocks.clearBlocks()
		await nextTick()

		if (db?.blocks) {
			db.blocks?.forEach((block, index) => {
				const _block = blocks.addBlock(index, index === 0)
				_block.aggregations.setAggregations(block.aggregations || [])
				_block.intervalParams.setInterval(block.from, block.to)
				_block.queryParams.query.value = (block.query || '')
				_block.messages.selectedColumns.value = block.columns || []
				if (block?.name) {
          _block.setName(block?.name)
        }
				if (block.histogram ) {
					_block.messages.isHistogramVisible.value = true
				}
			})
		}

		useCounter().setDefault(db?.blocks?.length || 0)

		if (db === undefined) {
			dashboardName.value = ''
			routeQuery.clear()
			setDefaultBlocks()
			return
		}

		dashboardName.value = db?.name || ''
	}

	async function selectDashboard(uuid: string, datasource?: string) {
		if (!uuid) {
			setDashboard(undefined, uuid)
			return
		}

		const db = await api.seqUiServer.getDashboardById(uuid)

		if (!db) {
			return
		}

		openDashboard(uuid, datasource)
	}

	function renameDashboard(name: string) {
		dashboardName.value = name
		saveDashboard()
	}

	async function saveDashboard() {
		const ok = await api.seqUiServer.saveDashboard(selectedUuid.value, currentDashboard.value)
		if (!ok) {
			return
		}
		const db = dashboards.value.find(({ uuid }) => uuid === selectedUuid.value)
		if (db) {
			db.name = dashboardName.value
		}

		dashboard.value = {
			name: dashboardName.value,
			ownerName: dashboard.value?.ownerName,
		}

		routeQuery.clear()

		Notification.success({
			renderContent: `Изменения для дашборда ${dashboardName.value} успешно применены`,
		})
	}

	async function saveNewDashboard(name: string) {
		const uuid = await api.seqUiServer.createDashboard({
			...currentDashboard.value,
			name,
		})
		if (!uuid) {
			return
		}
		selectedUuid.value = uuid
		dashboards.value.push({
			name,
			uuid,
			owner_name: profileStore.username,
		})
		openDashboard(uuid)
	}

	async function deleteDashboard(uuid: string) {
		const ok = await api.seqUiServer.deleteDashboard(uuid)
		if (!ok) {
			return
		}
		closeDashboard()
		selectedUuid.value = ''
		dashboardName.value = ''
		dashboards.value = dashboards.value.filter((_) => uuid !== _.uuid)
		dashboard.value = getDefaultDashboard()
	}

	// кажется можно удалить validateRename
	const validateNewName = (newName: string) => {
		if (newName === '') {
			return EMPTY_NAME_ERROR_MESSAGE
		}
		if (dashboards.value.find(({ name }) => name === newName)) {
			return SAME_NAME_EXISTS_ERROR_MESSAGE
		}
		return ''
	}

	const validateRename = (newName: string) => {
		if (newName === '') {
			return EMPTY_NAME_ERROR_MESSAGE
		}
		if (dashboards.value.find(({ name, uuid }) => name === newName && uuid !== selectedUuid.value)) {
			return SAME_NAME_EXISTS_ERROR_MESSAGE
		}
		return ''
	}

	const getDashboardsInfo = async (isMyDashboards = true) => {
		hasMoreDashboards.value = false
		let data: DashboardInfo[]
		offset.value = 0

		if (isMyDashboards) {
			const result = await api.seqUiServer.getMyDashboards({
				limit: DEFAULT_DASHBOARDS_LIMIT + 1,
				offset: 0,
			})
			result.forEach((dashboard) => {
				dashboard.owner_name = profileStore.username
			})
			data = result

		} else {
			data = await api.seqUiServer.getAllDashboards({
				limit: DEFAULT_DASHBOARDS_LIMIT + 1,
				offset: 0,
			})
		}

		if (data.length > 10) {
			hasMoreDashboards.value = true
		}
		data.splice(10, 1)

		dashboards.value = data
	}

	const fetchMoreDashboards = async (isMyDashboards = false, query = '') => {
		if (!hasMoreDashboards.value) {
			return
		}
		isFetching.value = true

		offset.value = offset.value + limit.value
		let data: DashboardInfo[]

		if (query) {
			data = await api.seqUiServer.searchDashboards({
				query,
				filter: isMyDashboards ? {
					owner_name: profileStore.username,
				} : undefined,
				limit: limit.value + 1,
				offset: offset.value,
			})
		} else {
			if (isMyDashboards) {
				data = await api.seqUiServer.getMyDashboards({
					limit: limit.value + 1,
					offset: offset.value,
				})
			} else {
				data = await api.seqUiServer.getAllDashboards({
					limit: limit.value + 1,
					offset: offset.value,
				})
			}
		}
		// пиздец
		if (isMyDashboards) {
			data.forEach((dashboard) => {
				dashboard.owner_name = profileStore.username
			})
		}

		isFetching.value = false

		hasMoreDashboards.value = data.length > limit.value

		dashboards.value.push(...(data.length > limit.value ? data.slice(0, -1) : data))
	}

	const searchDashboards = async (body: SearchDashboardsBody, isMyDashboards = false) => {
		isFetching.value = true
		dashboards.value = []
		hasMoreDashboards.value = true

		offset.value = 0
		const result = await api.seqUiServer.searchDashboards({
			...body,
			filter: isMyDashboards ? {
				owner_name: profileStore.username,
			} : undefined,
			limit: limit.value + 1,
			offset: 0,
		})
		if (result.length <= 10) {
			hasMoreDashboards.value = false
		}
		result.splice(limit.value, 1)
		dashboards.value = result
		isFetching.value = false
	}

	const isShowSelect = ref(false)
	const toggleShowSelect = () => {
		isShowSelect.value = !isShowSelect.value
	}

	const getDashboardFromQuery = async () => {
		const uuid = useRoute().params.id
		if (!uuid || typeof uuid !== 'string') {
			isShowSelect.value = true
			return
		}
		const data = await api.seqUiServer.getDashboardById(uuid)
		if (!data) {
			return
		}
		setDashboard(data, uuid)
	}

	function getBlockIdsFromQuery(route?: RouteLocationNormalized) {
		const result = new Set<number>([])
		const keys = ['from', 'to', 'rangetype', 'q', 'service', 'page', 'fields']
		const keyRegex = new RegExp(`(?:${keys.join('|')})\\.?(\\d+)?`)

		let routeQueryValue = route?.query
		if (!routeQueryValue) {
			routeQueryValue = useRoute().query
		}

		Object.keys(routeQueryValue).forEach((key) => {
			const match = key.match(keyRegex)
			if (match) {
				const id = Number(match[1] || 0)
				result.add(id)
			}
		})

		if (result.size === 0) {
			return [0]
		}

		return Array.from(result).sort((a, b) => a - b)
	}

	return {
		dashboards,
		logsLifespan,
		exportLimit,
		blocks,
		currentDashboard,
		selectedUuid,
		hasDashboardChanged,
		canEdit,
		isFetching,
		hasMoreDashboards,
		isShowSelect,
		toggleShowSelect,

		fetchMoreDashboards,
		validateNewName,
		validateRename,
		searchDashboards,
		setDashboard,
		saveDashboard,
		saveNewDashboard,
		deleteDashboard,
		renameDashboard,
		selectDashboard,
		getDashboardsInfo,
		getDashboardFromQuery,
		getBlockIdsFromQuery,
	}
})
