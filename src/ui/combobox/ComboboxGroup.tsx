import { defineComponent } from "vue";
import { ComboboxLabel, ComboboxGroup as RekaComboboxGroup } from "reka-ui"
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { prop } from "@/lib/prop";
import { primitiveProps } from "../common-props";

const props = {
  ...primitiveProps,
  heading: prop<string>().optional(),
}

export const ComboboxGroup = defineComponent({
  name: 'ComboboxGroup',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxGroup
        data-slot="combobox-group"
        {...reactiveOmit(props, 'class', 'heading')}
        class={cn('overflow-hidden p-1 text-foreground', props.class)}
      >
        {props.heading && (
          <ComboboxLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {props.heading}
          </ComboboxLabel>
        )}
        {slots.default?.()}
      </RekaComboboxGroup>
    )
  }
})
