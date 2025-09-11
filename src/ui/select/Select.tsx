import { prop } from "@fe/prop-types";
import { SelectRoot, type AcceptableValue, type SelectRootProps } from "reka-ui";
import { defineComponent } from "vue";

const props = {
  value: prop<SelectRootProps['modelValue']>().required(),
  whenValueChange: prop<(value?: AcceptableValue | AcceptableValue[]) => void>().required(),
  whenOpenChange: prop<(open: boolean) => void>().optional(),
  autocomplete: prop<SelectRootProps['autocomplete']>().optional(),
  by: prop<SelectRootProps['by']>().optional(),
  defaultOpen: prop<SelectRootProps['defaultOpen']>().optional(),
  defaultValue: prop<SelectRootProps['defaultValue']>().optional(),
  dir: prop<SelectRootProps['dir']>().optional(),
  disabled: prop<SelectRootProps['disabled']>().optional(),
  multiple: prop<SelectRootProps['multiple']>().optional(),
  name: prop<SelectRootProps['name']>().optional(),
  open: prop<SelectRootProps['open']>().optional(),
  required: prop<SelectRootProps['required']>().optional(),
}

export const Select = defineComponent({
  name: 'BaseSelect',
  props,
  setup(props, { slots }) {
    return () => (
      <SelectRoot
        data-slot="select"
        modelValue={props.value}
        onUpdate:modelValue={props.whenValueChange}
        onUpdate:open={props.whenOpenChange}
        autocomplete={props.autocomplete}
        by={props.by}
        defaultOpen={props.defaultOpen}
        defaultValue={props.defaultValue}
        dir={props.dir}
        disabled={props.disabled}
        multiple={props.multiple}
        name={props.name}
        open={props.open}
        required={props.required}
      >
        {slots.default?.()}
      </SelectRoot>
    )
  }
})
