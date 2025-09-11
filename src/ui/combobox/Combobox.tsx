import { defineComponent } from "vue";
import { ComboboxRoot, type ComboboxRootProps } from "reka-ui"
import { reactiveOmit } from "@vueuse/core"
import { prop } from "@fe/prop-types";
import { listboxRootProps } from "../common-props";

const props = {
  ...listboxRootProps,
  open: prop<ComboboxRootProps['open']>().optional(),
  defaultOpen: prop<ComboboxRootProps['defaultOpen']>().optional(),
  resetSearchTermOnBlur: prop<ComboboxRootProps['resetSearchTermOnBlur']>().optional(),
  resetSearchTermOnSelect: prop<ComboboxRootProps['resetSearchTermOnSelect']>().optional(),
  openOnFocus: prop<ComboboxRootProps['openOnFocus']>().optional(),
  openOnClick: prop<ComboboxRootProps['openOnClick']>().optional(),
  ignoreFilter: prop<ComboboxRootProps['ignoreFilter']>().optional(),
  onOpenChange: prop<(value: boolean) => void>().optional(),
  onHighlight: prop<(value: ComboboxRootProps['modelValue']) => void>().optional(),
}

export const Combobox = defineComponent({
  name: 'BaseCombobox',
  props,
  setup(props, { slots }) {
    return () => (
      <ComboboxRoot
        data-slot="combobox"
        modelValue={props.value}
        onUpdate:modelValue={props.onChange}
        onUpdate:open={props.onOpenChange}
        {...reactiveOmit(props, 'value', 'onOpenChange', 'onChange')}
      >
        {slots.default?.()}
      </ComboboxRoot>
    )
  }
})
