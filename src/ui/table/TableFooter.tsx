import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  class: prop<HTMLAttributes["class"]>().optional()
}

export const TableFooter = defineComponent({
  name: 'TableFooter',
  props,
  setup(props, { slots }) {
    return () => (
      <tfoot
        data-slot="table-footer"
        class={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', props.class)}
      >
        {slots.default?.()}
      </tfoot>
    )
  }
})
