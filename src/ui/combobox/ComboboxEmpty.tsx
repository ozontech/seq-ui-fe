import { defineComponent } from "vue";
import { ComboboxEmpty as RekaComboboxEmpty } from "reka-ui"
import { cn } from "~/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { primitiveProps } from "../common-props";

export const ComboboxEmpty = defineComponent({
  name: 'ComboboxEmpty',
  props: primitiveProps,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxEmpty
        data-slot="combobox-empty"
        {...reactiveOmit(props, 'class')}
        class={cn('py-6 text-center text-sm', props.class)}
      >
        {slots.default?.()}
      </RekaComboboxEmpty>
    )
  }
})
