import { defineComponent, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useTokensStore } from '@/stores/tokens'
import { LogTable } from '@/components/log-table'
import { LogControls } from '@/components/log-controls'
import { useLogs } from '@/composables/use-logs'

export const MessagesLayout = defineComponent({
  name: 'MessagesLayout',
  setup() {
    const tokens = useTokensStore()
    const { keywords } = storeToRefs(tokens)

    const logs = useLogs()

    const keywordOptions = computed(() => {
      return keywords.value.map(({ name }) => name || '')
    })

    return () => (
      <div class="w-full h-[100dvh] flex flex-col gap-[20px] p-[20px]">
        <LogControls
          from={logs.interval.from.value}
          to={logs.interval.to.value}
          expression={logs.query.value}
          whenExpressionChange={logs.setQuery}
          whenIntervalChange={logs.interval.setInterval}
          whenSubmit={logs.submitSearch}
        />
        <LogTable
          data={logs.data.value}
          isLoading={logs.isLoading.value}
          loadMore={logs.loadMore}
          keywords={keywordOptions.value}
        />
      </div>
    )
  },
})
