import { defineComponent } from "vue";
import { DropdownMenuSub as RekaDropdownMenuSub } from "reka-ui"
import { prop } from "@fe/prop-types";

const props = {
  open: prop<boolean>().optional(),
  defaultOpen: prop<boolean>().optional(),
  whenOpenChanged: prop<(open: boolean) => void>().optional(),
}

export const DropdownMenuSub = defineComponent({
  name: 'DropdownMenuSub',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaDropdownMenuSub
        data-slot="dropdown-menu-sub"
        open={props.open}
        defaultOpen={props.defaultOpen}
        onUpdate:open={props.whenOpenChanged}
      >
        {slots.default?.()}
      </RekaDropdownMenuSub>
    )
  }
})
