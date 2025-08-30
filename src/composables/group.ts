import type { Ref } from 'vue'
import { computed, triggerRef, shallowRef, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useTimezoneStore } from '@/stores/timezone'
import { useTokensStore } from '@/stores/tokens'
import { useDashboardsStore } from '@/stores/dashboards'
import type { Message } from '@/types/messages'
import { getApi } from '@/api/client'
import { addToQuery } from '@/helpers/search'
import { normalizeMessage } from '@/normalizers/events'
import { DEFAULT_LIMIT } from '@/constants/search'
import { useSearchStore } from '@/stores/search'


export const useGroup = (id: number, messages: Ref<Message[]>) => {
	const tzStore = useTimezoneStore()
	const tokensStore = useTokensStore()
	const store = useDashboardsStore()
	const { intervalParams, queryParams } = useSearchStore().getParams(id)

	const { textFieldsMap } = storeToRefs(tokensStore)
	const { isFieldIndexed } = tokensStore

	const anyHasMore = ref(true)
	const endedGroups = ref<Map<string, boolean>>(new Map())
	const groups = ref<Record<string, Message[]>>({})
	const groupField = shallowRef<string | null>(null)

	const groupsLength = computed(() => Object.keys(groups.value).length)
	const groupsEntries = computed(() => Object.entries(groups.value))
	const isEmpty = computed(() => groupsLength.value === 0)
	const isGroupView = computed(() => groupField.value !== null)

	watch(groupField, (value) => {
		if (value) {
			if (Object.keys(textFieldsMap.value).length) {
				anyHasMore.value = (value in textFieldsMap.value)
			}
			setGroups()

			return
		}
		groups.value = {}
	})

	const setGroupField = (value: string | null) => {
		groupField.value = value
	}

	const setGroups = () => {
		endedGroups.value.clear()
		groups.value = createGroups()
	}

	const setGroupsValue = (value: Record<string, Message[]>) => {
		groups.value = value
	}

	const updateGroups = (callback: (message: Message) => void) => {
		const entries = groupsEntries.value.map(([key, messages]) => [key, messages.map(callback)])
		groups.value = Object.fromEntries(entries)
	}

	const createGroups = () => {
		return messages.value.reduce<Record<string, Message[]>>((acc, cur) => {
			const value = cur[groupField.value as keyof Message || ''] as string
			if (!value) {
				return acc
			}
			if (value in acc) {
				acc[value].push(cur)
				return acc
			}
			acc[value] = [cur]
			return acc
		}, {})
	}

	const fetchGroup = async (field: string, value: string, offset = 0) => {
		const api = getApi().seqUiServer
		const { from, to } = intervalParams.toDates()
		const { events = [] } = await api.fetchMessages({
			offset,
			limit: DEFAULT_LIMIT,
			query: addToQuery(queryParams.query.value, field, value),
			from,
			to,
		})

		if (events.length === DEFAULT_LIMIT) {
			events.pop()
		} else {
			endedGroups.value.set(value, true)
		}

		const result = events.map((event) => normalizeMessage(event, tzStore.timezone.name))
		groups.value[value] = [...groups.value[value], ...result]
		triggerRef(groups)
	}

	const fetchGroups = async () => {
		store.isFetching = true
		anyHasMore.value = true
		endedGroups.value.clear()
		groups.value = {}
		const api = getApi().seqUiServer
		const { from, to } = intervalParams.toDates()
		const { events = [] } = await api.fetchMessages({
			limit: DEFAULT_LIMIT,
			query: isFieldIndexed(groupField.value) ? addToQuery(queryParams.query.value, '_exists_', groupField.value) : queryParams.query.value,
			//order: blockIndex.value].messages.order,
			from,
			to,
		})

		if (events.length < DEFAULT_LIMIT) {
			anyHasMore.value = false
		}

		groups.value = events.reduce<Record<string, Message[]>>((acc, event, idx) => {
			if (idx === 100) {
				return acc
			}
			const normalized = normalizeMessage(event, tzStore.timezone.name)
			const value = normalized[groupField.value as keyof Message || ''] as string
			if (value && (value in acc)) {
				acc[value].push(normalized)
				return acc
			}
			acc[value] = [normalized]
			return acc
		}, {})
		triggerRef(groups)
		store.isFetching = false
	}

	return {
		anyHasMore,
		endedGroups,
		groupField,
		groups,
		groupsEntries,
		groupsLength,
		isEmpty,
		isGroupView,
		fetchGroup,
		fetchGroups,
		setGroupField,
		setGroups,
		setGroupsValue,
		updateGroups,
	}
}
