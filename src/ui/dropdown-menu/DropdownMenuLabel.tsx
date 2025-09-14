import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import { DropdownMenuLabel as DropdownLabel } from "reka-ui"
import { cn } from "~/lib/utils"

const props = {
  inset: prop<boolean>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const DropdownMenuLabel = defineComponent({
  name: 'DropdownMenuLabel',
  props,
  setup(props, { slots }) {
    return () => (
      <DropdownLabel
        data-slot="dropdown-menu-label"
        data-inset={props.inset ? '' : undefined}
        class={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', props.class)}
      >
        {slots.default?.()}
      </DropdownLabel >
    )
  }
})
