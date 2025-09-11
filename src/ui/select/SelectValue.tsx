import { prop } from "@fe/prop-types";
import { SelectValue as RekaSelectValue, type SelectValueProps } from "reka-ui";
import { defineComponent } from "vue";

const props = {
  as: prop<SelectValueProps['as']>().optional(),
  asChild: prop<SelectValueProps['asChild']>().optional(),
  placeholder: prop<SelectValueProps['placeholder']>().optional(),
}

export const SelectValue = defineComponent({
  name: 'SelectValue',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectValue
        data-slot="select-value"
        as={props.as}
        asChild={props.asChild}
        placeholder={props.placeholder}
      >
        {slots.default?.()}
      </RekaSelectValue>
    )
  }
})
