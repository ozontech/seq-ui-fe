import { defineComponent } from "vue"
import { DropdownMenuRadioGroup as RekaDropdownMenuRadioGroup } from "reka-ui"
import { prop } from "@/lib/prop"

const props = {
  value: prop<string>().required(),
  whenChange: prop<(value: string) => void>().required(),
}

export const DropdownMenuRadioGroup = defineComponent({
  name: 'DropdownMenuRadioGroup',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaDropdownMenuRadioGroup
        data-slot="dropdown-menu-radio-group"
        modelValue={props.value}
        onUpdate:modelValue={props.whenChange}
      >
        {slots.default?.()}
      </RekaDropdownMenuRadioGroup>
    )
  }
})
