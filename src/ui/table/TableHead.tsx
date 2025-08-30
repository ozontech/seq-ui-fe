import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  class: prop<HTMLAttributes["class"]>().optional()
}

export const TableHead = defineComponent({
  name: 'TableHead',
  props,
  setup(props, { slots }) {
    return () => (
      <th
        data-slot="table-head"
        class={cn('text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', props.class)}
      >
        {slots.default?.()}
      </th>
    )
  }
})
