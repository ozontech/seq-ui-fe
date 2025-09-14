import { defineComponent } from "vue";
import { cn } from "~/lib/utils"
import { ComboboxTrigger as RekaComboboxTrigger, type ComboboxTriggerProps } from "reka-ui"
import { prop } from "@fe/prop-types";
import { reactiveOmit } from "@vueuse/core";
import { primitiveProps } from "../common-props";

const props = {
  ...primitiveProps,
  disabled: prop<ComboboxTriggerProps['disabled']>().optional(),
}

export const ComboboxTrigger = defineComponent({
  name: 'ComboboxTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxTrigger
        data-slot="combobox-trigger"
        {...reactiveOmit(props, 'class')}
        // @ts-expect-error doesn't have this prop in types
        tabindex="0"
        class={cn('', props.class)}
      >
        {slots.default?.()}
      </RekaComboboxTrigger>
    )
  }
})
