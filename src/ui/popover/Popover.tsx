import { defineComponent } from "vue";
import { PopoverRoot } from "reka-ui"
import { prop } from "@/lib/prop";

const props = {
  defaultOpen: prop<boolean>().optional(),
  open: prop<boolean>().optional(),
  modal: prop<boolean>().optional(),
  whenOpen: prop<(open: boolean) => void>().optional(),
}

export const Popover = defineComponent({
  name: 'BasePopover',
  props,
  setup(props, { slots }) {
    return () => (
      <PopoverRoot
        data-slot="popover"
        onUpdate:open={props.whenOpen}
        {...props}
      >
        {slots.default?.()}
      </PopoverRoot>
    )
  }
})
