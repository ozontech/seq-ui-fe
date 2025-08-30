import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getApi } from '@/api/client'
import type { FavoriteQuery, SaveQueryParams } from '@/types/profile'
import { useNuxtApp } from '@/composables/use-nuxt-app'

type HashableQuery = { query: string; relativeFrom: number | undefined }

export const getQueryHash = (q: HashableQuery) => {
	return `${q.query}${q.relativeFrom}`
}

export const useProfileStore = defineStore('profile', () => {
	const app = useNuxtApp()

	const api = getApi()
	const queries = ref<FavoriteQuery[]>([])
	const querySet = ref<Set<string>>(new Set())
	const isFetching = ref(false)
	const username = computed(() => (app.$keycloak && app.$keycloak.username) || '')
	const pinned = ref<string[]>([])
	const showOnlyCompareWidget = ref<boolean>(false)

	const getPinned = async () => {
		if (pinned.value.length) {
			return
		}
		pinned.value = await api.seqUiServer.getPinnedFields()
	}

	const getFavoriteQueries = async () => {
		if (querySet.value.size) {
			return
		}
		isFetching.value = true
		const data = await api.seqUiServer.getFavoriteQueries()
		isFetching.value = false
		queries.value = data
		for (const q of data) {
			querySet.value.add(getQueryHash({
				query: q.query,
				relativeFrom: q.relativeFrom,
			}))
		}
	}

	const saveFavoriteQuery = async (query: SaveQueryParams) => {
		isFetching.value = true
		const id = await api.seqUiServer.saveFavoriteQuery(query)
		isFetching.value = false
		if (!id) {
			return false
		}
		const q: FavoriteQuery = {
			name: query.name,
			query: query.query,
			relativeFrom: Number(query.relativeFrom) || undefined,
			id,
		}
		queries.value.push(q)
		querySet.value.add(getQueryHash({
      query: q.query,
      relativeFrom: q.relativeFrom
    }))
		return true
	}

	const deleteFavoriteQuery = async (id: string) => {
		isFetching.value = true
		const ok = await api.seqUiServer.deleteFavoriteQuery(id)

		isFetching.value = false
		if (!ok) {
			return
		}
		const queryIndex = queries.value.findIndex((q) => q.id === id)
		const query = queries.value[queryIndex]
		queries.value.splice(queryIndex, 1)
		querySet.value.delete(getQueryHash({
			query: query.query,
			relativeFrom: query.relativeFrom,
		}))
	}

	const queryExists = (q: HashableQuery) => querySet.value.has(getQueryHash(q))

	return {
		queries,
		querySet,
		isFetching,
		queryExists,
		getFavoriteQueries,
		saveFavoriteQuery,
		deleteFavoriteQuery,
		pinned,
		getPinned,
		username,
		showOnlyCompareWidget,
	}
})
