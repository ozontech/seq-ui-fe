import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  style: prop<HTMLAttributes['style']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
  colspan: prop<number>().optional(1),
}

export const TableCell = defineComponent({
  name: 'TableCell',
  props,
  setup(props, { slots }) {
    return () => (
      <td
        data-slot="table-cell"
        colspan={props.colspan}
        class={
          cn(
            'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            props.class,
          )
        }
        {...{ style: props.style }}
      >
        {slots.default?.()}
      </td>
    )
  }
})
