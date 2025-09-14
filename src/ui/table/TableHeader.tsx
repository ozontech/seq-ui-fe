import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  class: prop<HTMLAttributes["class"]>().optional()
}

export const TableHeader = defineComponent({
  name: 'TableHeader',
  props,
  setup(props, { slots }) {
    return () => (
      <thead
        data-slot="table-header"
        class={cn('[&_tr]:border-b', props.class)}
      >
        {slots.default?.()}
      </thead>
    )
  }
})
