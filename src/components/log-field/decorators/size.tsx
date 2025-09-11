
import { computed, defineComponent } from "vue";
import type { Log } from "@/types/messages";
import { prop } from "@/lib/prop";
import { formatNumber } from "@/helpers/format-number";
import { is } from "ramda";

export const LogSizeDecorator = defineComponent({
  name: 'LogSizeDecorator',
  props: {
    log: prop<Log>().required(),
  },
  setup(props) {
    const size = computed(() => {
      return Number(props.log.size)
    })

    const formatted = computed(() => {
      return is(Number, size.value) ? formatNumber(size.value) : '-'
    })

    return () => <div>{ formatted.value }</div>
  }
})

export const renderLogSizeDecorator = (log: Log) => {
  return <LogSizeDecorator log={log}/>
}
