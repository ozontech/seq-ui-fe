import { defineComponent } from "vue";
import { ComboboxAnchor as RekaComboboxAnchor } from "reka-ui"
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { popperAnchorProps } from "../common-props";

export const ComboboxAnchor = defineComponent({
  name: 'ComboboxAnchor',
  props: popperAnchorProps,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxAnchor
        data-slot="combobox-anchor"
        {...reactiveOmit(props, 'class')}
        class={cn('relative w-[200px]', props.class)}
      >
        {slots.default?.()}
      </RekaComboboxAnchor>
    )
  }
})
