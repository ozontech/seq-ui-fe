import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  class: prop<HTMLAttributes["class"]>().optional()
}

export const TableBody = defineComponent({
  name: 'TableBody',
  props,
  setup(props, { slots }) {
    return () => (
      <tbody
        data-slot="table-body"
        class={cn('[&_tr:last-child]:border-0', props.class)}
      >
        <slot />
      </tbody>
    )
  }
})
