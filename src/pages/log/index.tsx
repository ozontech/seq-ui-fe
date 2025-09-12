import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAsyncState } from '@vueuse/core'
import { LogView } from '@/components/log-view'
import { useTokensStore } from '@/stores/tokens'
import { useProfileStore } from '@/stores/profile'
import { useBlock } from '@/composables/block'
import router from '@/router'

export default defineComponent({
  name: 'LogPage',
  setup() {
		const route = useRoute()
		const block = useBlock()

		const tokens = useTokensStore()
		const { keywords } = storeToRefs(tokens)

		const profile = useProfileStore()
		const { pinned } = storeToRefs(profile)

    const { isLoading } = useAsyncState(async () => {
			const id = route.params.id as string
			if (
        !block?.messages.selectedMessage.value ||
        block.messages.selectedMessage.value?._id !== id
      ) {
				await block.messages.fetchMessageById(id)
			}
			if (!block.messages.selectedMessage.value) {
				router.replace('/404')
			}
			profile.getPinned()
			if (keywords.value.length === 0) {
				await tokens.fetchKeywords()
			}
		}, null)

		const message = computed(() => {
			return block.messages.selectedMessage.value!
		})

    return () => (
      <div class="p-4 border-1 rounded-md">
        {
          isLoading.value ? 'loading...' : (
            <LogView
              log={message.value}
              query={block.queryParams.query.value}
              pinned={pinned.value}
            />
          )
        }
      </div>
    )
  },
})
