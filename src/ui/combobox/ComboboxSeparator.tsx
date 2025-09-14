import { defineComponent } from "vue";
import { ComboboxSeparator as RekaComboboxSeparator } from "reka-ui"
import { cn } from "~/lib/utils"
import { reactiveOmit } from "@vueuse/core";
import { primitiveProps } from "../common-props";

export const ComboboxSeparator = defineComponent({
  name: 'ComboboxSeparator',
  props: primitiveProps,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxSeparator
        data-slot="combobox-separator"
        {...reactiveOmit(props, 'class')}
        class={cn('bg-border -mx-1 h-px', props.class)}
      >
        {slots.default?.()}
      </RekaComboboxSeparator>
    )
  }
})
