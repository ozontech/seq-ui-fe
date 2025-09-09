import { prop } from '@/lib/prop';
import { DropdownMenuRoot } from 'reka-ui';
import type { DropdownMenuRootProps } from 'reka-ui';
import { defineComponent } from 'vue';

const props = {
  open: prop<DropdownMenuRootProps['open']>().optional(),
  dir: prop<DropdownMenuRootProps['dir']>().optional(),
  modal: prop<DropdownMenuRootProps['modal']>().optional(),
  defaultOpen: prop<DropdownMenuRootProps['defaultOpen']>().optional(),
  whenOpenChange: prop<(open: boolean) => void>().optional(),
}

export const DropdownMenu = defineComponent({
  name: 'DropdownMenu',
  props,
  setup(props, { slots }) {
    return () => (
      <DropdownMenuRoot
        data-slot="dropdown-menu"
        onUpdate:open={props.whenOpenChange}
        open={props.open}
        defaultOpen={props.defaultOpen}
        modal={props.modal}
        dir={props.dir}
      >
        {slots.default?.()}
      </DropdownMenuRoot>
    )
  }
})
