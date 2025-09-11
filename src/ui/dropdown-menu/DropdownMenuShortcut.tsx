import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  class: prop<HTMLAttributes['class']>().optional(),
}

export const DropdownMenuShortcut = defineComponent({
  name: 'DropdownMenuShortcut',
  props,
  setup(props, { slots }) {
    return () => (
      <span
        data-slot="dropdown-menu-shortcut"
        class={cn('text-muted-foreground ml-auto text-xs tracking-widest', props.class)}
      >
        {slots.default?.()}
      </span>
    )
  },
})
