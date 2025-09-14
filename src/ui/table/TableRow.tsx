import { defineComponent, type HTMLAttributes, type Ref } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  innerRef: prop<Ref<HTMLTableRowElement | undefined>>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
  whenClick: prop<HTMLAttributes['onClick']>().optional(),
}

export const TableRow = defineComponent({
  name: 'TableRow',
  props,
  setup(props, { slots }) {
    return () => (
      <tr
        ref={props.innerRef}
        data-slot="table-row"
        class={cn('group data-[state=selected]:bg-muted border-b transition-colors', props.whenClick ? 'hover:cursor-pointer hover:bg-muted/50' : '', props.class)}
        onClick={props.whenClick}
      >
        {slots.default?.()}
      </tr>
    )
  }
})
