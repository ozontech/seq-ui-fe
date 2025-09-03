import { defineComponent } from "vue";
import type { DropdownMenuTriggerProps } from "reka-ui"
import { DropdownMenuTrigger as RekaDropdownMenuTrigger } from "reka-ui"
import { prop } from "@/lib/prop";

const props = {
  as: prop<DropdownMenuTriggerProps['as']>().optional(),
  asChild: prop<DropdownMenuTriggerProps['asChild']>().optional(),
  disabled: prop<DropdownMenuTriggerProps['disabled']>().optional(),
}

export const DropdownMenuTrigger = defineComponent({
  name: 'DropdownMenuTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaDropdownMenuTrigger
        data-slot="dropdown-menu-trigger"
        as={props.as}
        asChild={props.asChild}
        disabled={props.disabled}
      >
        {slots.default?.()}
      </RekaDropdownMenuTrigger>
    )
  }
})
