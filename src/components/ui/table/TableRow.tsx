import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
  whenClick: prop<HTMLAttributes['onClick']>().optional(),
}

export const TableRow = defineComponent({
  name: 'TableRow',
  props,
  setup(props, { slots }) {
    return () => (
      <tr
        data-slot="table-row"
        // todo: add hover if props.whenClick exists
        class={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', props.class)}
        onClick={props.whenClick}
      >
        {slots.default?.()}
      </tr>
    )
  }
})
