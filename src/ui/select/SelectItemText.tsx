import { prop } from "@fe/prop-types";
import {
  SelectItemText as RekaSelectItemText,
  type SelectItemTextProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";

const props = {
  as: prop<SelectItemTextProps['as']>().optional(),
  asChild: prop<SelectItemTextProps['asChild']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectItemText = defineComponent({
  name: 'SelectItemText',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectItemText
        data-slot="select-item-text"
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaSelectItemText>
    )
  }
})
