import { Copy } from "lucide-vue-next";
import { is } from "ramda";
import { computed, defineComponent } from "vue";
import { toast } from "vue-sonner";
import type { Log } from "@/types/messages";
import { prop } from "@fe/prop-types";
import { copyToClipboard } from "@/helpers/clipboard";

import styles from './log-field.module.css'
import { decorators } from './decorators'

export const LogField = defineComponent({
  name: 'LogField',
  props: {
    name: prop<keyof Log>().required(),
    log: prop<Log>().required(),
  },
  setup(props) {
    const fieldValue = computed(() => props.log[props.name])

    const handleCopy = (value: string) => {
      copyToClipboard(value)
      toast.info('Value copied')
    }

    const renderValue = () => {
      if (decorators[props.name]) {
        return decorators[props.name](props.log)
      }

      return <div>{ fieldValue.value }</div>
    }

    const renderCopyButton = () => {
      const value = fieldValue.value

      if (value && is(String, value)) {
        return (
          <Copy
            size={14}
            class={styles.copy}
            onClick={() => handleCopy(value)}
          />
        )
      }
    }

    return () => (
      <div class={styles.field}>
        { renderValue() }
        { renderCopyButton() }
      </div>
    )
  }
})
