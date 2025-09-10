import { defineComponent } from "vue";
import { ComboboxItemIndicator as RekaComboboxItemIndicator } from "reka-ui"
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { primitiveProps } from "../common-props";

export const ComboboxItemIndicator = defineComponent({
  name: 'ComboboxItemIndicator',
  props: primitiveProps,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxItemIndicator
        data-slot="combobox-item-indicator"
        {...reactiveOmit(props, 'class')}
        class={cn('ml-auto', props.class)}
      >
        {slots.default?.()}
      </RekaComboboxItemIndicator >
    )
  }
})
