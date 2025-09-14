import { defineComponent } from "vue";
import { ComboboxViewport as RekaComboboxViewport, type ComboboxViewportProps } from "reka-ui"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types";
import { reactiveOmit } from "@vueuse/core";
import { primitiveProps } from "../common-props";

const props = {
  ...primitiveProps,
  nonce: prop<ComboboxViewportProps['nonce']>().optional(),
}

export const ComboboxViewport = defineComponent({
  name: 'ComboboxViewport',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxViewport
        data-slot="combobox-viewport"
        {...reactiveOmit(props, 'class')}
        class={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', props.class)}
      >
        {slots.default?.()}
      </RekaComboboxViewport>
    )
  }
})
