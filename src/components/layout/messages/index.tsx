import { defineComponent, toRef } from 'vue'
import { LogTable } from '@/components/log-table'
import { LogControls } from '@/components/log-controls'
import { useLogs } from '@/composables/use-logs'
import { LogWidgets } from '@/components/log-widgets/log-widgets'
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '@/ui'
import { MoonIcon, SunMedium } from 'lucide-vue-next'

export const MessagesLayout = defineComponent({
  name: 'MessagesLayout',
  setup() {
    const logs = useLogs()
    const dark = useDark()
    const toggleTheme = useToggle(dark)

    return () => (
      <div class="w-full h-[100dvh] flex flex-col gap-[20px] p-[20px]">
        <Button
          variant={'ghost'}
          size={'icon'}
          whenClick={() => toggleTheme()}
        >
          {dark.value ? <SunMedium/> : <MoonIcon/>}
        </Button>
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
