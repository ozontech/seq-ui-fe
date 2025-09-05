import { defineComponent } from 'vue'
import { isEqual } from 'lodash'

import { MessagesLayout } from '@/components/layout/messages'

import { useTokensStore } from '@/stores/tokens'
import { useProfileStore } from '@/stores/profile'
import { useDashboardsStore } from '@/stores/dashboards'
import { useConfigStore } from '@/stores/config'
import { useSearchStore } from '@/stores/search'
import { pickByIndex } from '@/helpers/search'
import { useAsyncState } from '@vueuse/core'

export default defineComponent({
  name: 'SearchPage',
  // TODO: Can't convert this object property.
  beforeRouteUpdate(toRoute, fromRoute, next) {
    const { compare: _tcompare } = toRoute.query
    const { compare: _fcompare } = fromRoute.query
    const store = useDashboardsStore()
    const block = store.blocks.blocks.get(0)!

    if (!isEqual(_tcompare, _fcompare)) {
      return next()
    }

    if (block.messages.groups.isGroupView) {
      block.messages.loadDataFromQuery({ route: toRoute }).then(block.messages.groups.fetchGroups)
      return
    }

    block.messages.loadDataFromQuery({ route: toRoute }).then((id) => {
      const searchQuery = pickByIndex(toRoute.query as Record<string, string>, id)
      const oldQuery = pickByIndex(fromRoute.query as Record<string, string>, id)
      const isNewPageClear = !Object.values(searchQuery).some((value) => value !== undefined)
      if ((isNewPageClear || isEqual(searchQuery, oldQuery))) {
        return
      }
      const keys = Object.keys(searchQuery)
      if (keys.length === 0) {
        return
      }
      if (isEqual(searchQuery.page, oldQuery.page)) {
        block.fetch()
        return
      }
      block.messages.fetchPage()
    })

    return next()
  },
  setup() {
    const configStore = useConfigStore()
    const tokensStore = useTokensStore()
    const profileStore = useProfileStore()
    const store = useDashboardsStore()

    useAsyncState(async () => {
      store.blocks.clearBlocks()
      useSearchStore().clear()
      store.blocks.addSeveralBlocks([0])
      const block = store.blocks.blocks.get(0)!

      configStore.loadConfig()
      await store.getDashboardFromQuery()

      Promise.all([
        tokensStore.fetchKeywords(),
        configStore.fetchLimits(),
        configStore.fetchLogsLifespan(),
        profileStore.getPinned(),
        profileStore.getFavoriteQueries(),
      ])

      block.messages.loadDashboardColumns()
      block.messages.loadDataFromQuery({ hard: true })

      if (!block.messages.firstSearch) {
        block.fetch()
      }
    }, null)

    return () => (<MessagesLayout />)
  },
})
