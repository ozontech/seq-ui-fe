import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import {
  SelectGroup as RekaSelectGroup,
  type SelectGroupProps,
} from "reka-ui"

const props = {
  as: prop<SelectGroupProps['as']>().optional(),
  asChild: prop<SelectGroupProps['asChild']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectGroup = defineComponent({
  name: 'SelectGroup',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectGroup
        data-slot="select-group"
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaSelectGroup>
    )
  }
})
