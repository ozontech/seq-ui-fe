import { defineComponent, type HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { TableCell } from "./TableCell"
import { TableRow } from "./TableRow"
import { prop } from "@fe/prop-types"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
  colspan: prop<number>().optional(1)
}

export const TableEmpty = defineComponent({
  name: 'TableEmpty',
  props,
  setup(props, { slots }) {
    const delegatedProps = reactiveOmit(props, "class")

    return () => (
      <TableRow>
        <TableCell
          class={
            cn(
              'p-4 whitespace-nowrap align-middle text-sm text-foreground',
              props.class,
            )
          }
          {...delegatedProps}
        >
          <div class="flex items-center justify-center py-10">
            {slots.default?.()}
          </div>
        </TableCell>
      </TableRow>
    )
  }
})
