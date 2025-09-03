import { defineComponent } from 'vue';
import { DropdownMenuGroup as DropdownGroup } from 'reka-ui'

export const DropdownMenuGroup = defineComponent({
  name: 'DropdownMenuGroup',
  setup(_, { slots }) {
    return () => (
      <DropdownGroup data-slot="dropdown-menu-group">
        {slots.default?.()}
      </DropdownGroup>
    )
  }
})
