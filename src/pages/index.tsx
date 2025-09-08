import { defineComponent } from 'vue'
import { isEqual } from 'lodash'

import { MessagesLayout } from '@/components/layout/messages'

import { useTokensStore } from '@/stores/tokens'
import { useProfileStore } from '@/stores/profile'
import { useConfigStore } from '@/stores/config'
import { useSearchStore } from '@/stores/search'
import { pickByIndex } from '@/helpers/search'
import { useAsyncState } from '@vueuse/core'
import { useBlock } from '@/composables/block'

export default defineComponent({
  name: 'SearchPage',
  // TODO: Can't convert this object property.
  beforeRouteUpdate(toRoute, fromRoute, next) {
    const { compare: _tcompare } = toRoute.query
    const { compare: _fcompare } = fromRoute.query
    const block = useBlock()

    if (!isEqual(_tcompare, _fcompare)) {
      return next()
    }

    block.messages.loadDataFromQuery({ route: toRoute }).then((id) => {
      const searchQuery = pickByIndex(toRoute.query as Record<string, string>, id)
      const oldQuery = pickByIndex(fromRoute.query as Record<string, string>, id)
      if (isEqual(searchQuery, oldQuery)) {
        return
      }
      const keys = Object.keys(searchQuery)
      if (keys.length === 0) {
        return
      }
      block.fetch()
    })

    return next()
  },
  setup() {
    const configStore = useConfigStore()
    const tokensStore = useTokensStore()
    const profileStore = useProfileStore()

    useAsyncState(async () => {
      useSearchStore().clear()
      const block = useBlock()

      configStore.loadConfig()

      Promise.all([
        tokensStore.fetchKeywords(),
        configStore.fetchLimits(),
        configStore.fetchLogsLifespan(),
        profileStore.getPinned(),
      ])

      block.messages.loadDataFromQuery({ hard: true })

      if (!block.messages.firstSearch) {
        block.fetch()
      }
    }, null)

    return () => (<MessagesLayout />)
  },
})
