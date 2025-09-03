import { defineComponent, type HTMLAttributes } from "vue";
import { DropdownMenuSeparator as RekaDropdownMenuSeparator } from "reka-ui"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop";

const props = {
  class: prop<HTMLAttributes['class']>().optional(),
}

export const DropdownMenuSeparator = defineComponent({
  name: 'DropdownMenuSeparator',
  props,
  setup(props) {
    return () => (
      <RekaDropdownMenuSeparator
        data-slot="dropdown-menu-separator"
        class={cn('bg-border -mx-1 my-1 h-px', props.class)}
      />
    )
  },
})
