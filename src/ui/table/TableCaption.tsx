import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  class: prop<HTMLAttributes["class"]>().optional()
}

export const TableCaption = defineComponent({
  name: 'TableCaption',
  props,
  setup(props, { slots }) {
    return () => (
      <caption
        data-slot="table-caption"
        class={cn('text-muted-foreground mt-4 text-sm', props.class)}
      >
        {slots.default?.()}
      </caption>
    )
  }
})
