import { computed, defineComponent } from "vue";
import type { Log } from "@/types/messages";
import { prop } from "@/lib/prop";

import styles from './log-view-pins.module.css'

export const LogViewPins = defineComponent({
  name: 'LogViewPins',
  props: {
    log: prop<Log>().required(),
    pinned: prop<string[]>().optional([]),
  },
  setup(props) {
    const hasValues = computed(() => {
      return props.pinned.some(field => props.log[field as keyof Log])
    })

    return () => hasValues.value ? (
      <div class={styles.pinned}>
        {
          props.pinned.map((field) => {
            if (!props.log[field as keyof Log]) {
              return
            }

            return (
              <div class={styles.pin}>
                <div class={styles.label}>{ field }</div>
                <div>{ props.log[field] }</div>
              </div>
            )
          })
        }
      </div>
    ) : null
  }
})
