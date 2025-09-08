import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  style: prop<HTMLAttributes['style']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const Table = defineComponent({
  name: 'BaseTable',
  props,
  setup(props, { slots }) {
    return () => (
      <div
        data-slot="table-container"
        class="relative w-full overflow-auto">
        <table
          data-slot="table"
          class={cn('w-full caption-bottom text-sm', props.class)}
          {...{ style: props.style }}
        >
          {slots.default?.()}
        </table>
      </div>
    )
  }
})
