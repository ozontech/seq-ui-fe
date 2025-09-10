import { defineComponent } from 'vue'
import { LogTable } from '@/components/log-table'
import { LogControls } from '@/components/log-controls'
import { useLogs } from '@/composables/use-logs'
import { SonnerToaster } from '@/ui/sonner'
import { LogWidgets } from '@/components/log-widgets/log-widgets'

export const MessagesLayout = defineComponent({
  name: 'MessagesLayout',
  setup() {
    const logs = useLogs()

    return () => (
      <div class="w-full h-[100dvh] flex flex-col gap-[20px] p-[20px]">
        <LogControls
          histogram={logs.histogram}
          aggregations={logs.aggregations}
          interval={logs.interval}
          fields={logs.keywords.value}
          functions={logs.functions}
          expression={logs.query.value}
          whenExpressionChange={logs.setQuery}
          whenSubmit={logs.submitSearch}
        />
        <LogWidgets
          histogram={logs.histogram}
          aggregations={logs.aggregations}
          interval={logs.interval}
        />
        <LogTable
          data={logs.data.value}
          keywords={logs.keywords.value}
          timeDirection={logs.timeDirection.value}
          setTimeDirection={logs.setTimeDirection}
          isLoading={logs.isLoading.value}
          loadMore={logs.loadMore}
        />
        <SonnerToaster
          richColors
          position='bottom-right'
        />
      </div>
    )
  },
})
