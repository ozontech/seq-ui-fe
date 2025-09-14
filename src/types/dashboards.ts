import type { Duration } from '~/types/duration'
import type { Aggregation } from './aggregations'
import type { Order } from './messages'

import type { DashboardsV1GetAllRequestDto, DashboardsV1SearchRequestDto } from '~/api/generated/seq-ui-server'
import type { useBlocks } from '~/composables/blocks'

export type Blocks = ReturnType<typeof useBlocks>

export type CombinedDashboard = {
	name: string
	ownerName?: string
	blocks?: DashboardExtras[]
}

export type DashboardExtras = {
	histogram?: boolean
	aggregations?: Aggregation[]
	query?: string
	from?: Duration
	to?: Duration
	name?: string
	order?: Order
	columns?: string[]
}

export type Dashboard = {
	name: string
	ownerName?: string
	blocks?: Blocks
	columns?: string[]
}

export type DashboardExtended = Dashboard & {
	histogram?: boolean
	aggregations?: Aggregation[]
	query?: string
}

export type DashboardSaved = Omit<Dashboard, 'blocks'> & {
	blocks: DashboardExtras[]
}

export type DashboardBlock = {
	name: string
	histogram: boolean
	aggregations: Aggregation[]

	ownerName?: string
	query?: string
	columns?: string[]
}

export type ImportantDashboard = {
	name: string
	id: string
	datasource: string
}

export type SaveDashboardVariant = 'rename' | 'create' | 'add'

export type DashboardInfo = {
	name: string
	uuid: string
	owner_name?: string
}

export type SearchDashboardsBody = DashboardsV1SearchRequestDto
export type FetchDashboardsBody = DashboardsV1GetAllRequestDto

export type DashboardsFilters = {
	label: string
	value: string
}
