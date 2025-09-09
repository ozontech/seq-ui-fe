import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getApi } from '@/api/client'
import { useNuxtApp } from '@/composables/use-nuxt-app'

export const useProfileStore = defineStore('profile', () => {
	const app = useNuxtApp()

	const api = getApi()
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

	return {
		isFetching,
		pinned,
		getPinned,
		username,
		showOnlyCompareWidget,
	}
})
