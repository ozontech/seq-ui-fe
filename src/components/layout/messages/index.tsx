import { defineComponent } from 'vue'
import { LogTable } from '~/components/log-table'
import { LogControls } from '~/components/log-controls'
import { useLogs } from '~/composables/use-logs'
import { LogWidgets } from '~/components/log-widgets/log-widgets'

export const MessagesLayout = defineComponent({
  name: 'MessagesLayout',
  setup() {
    const logs = useLogs()

    return () => (
      <div class="w-full flex flex-col gap-[20px]">
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
          query={logs.query.value}
          keywords={logs.keywords.value}
          timeDirection={logs.timeDirection.value}
          setTimeDirection={logs.setTimeDirection}
          isLoading={logs.isLoading.value}
          loadMore={logs.loadMore}
          pinned={logs.pinned.value}
        />
      </div>
    )
  },
})
