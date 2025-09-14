import { defineComponent } from "vue";
import { ComboboxItem as RekaComboboxItem, type ComboboxItemProps } from "reka-ui"
import { prop } from "@fe/prop-types";
import { cn } from "~/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { listboxItemProps } from "../common-props";

const props = {
  ...listboxItemProps,
  textValue: prop<ComboboxItemProps['textValue']>().optional(),
}

export const ComboboxItem = defineComponent({
  name: 'ComboboxItem',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaComboboxItem
        data-slot="combobox-item"
        {...reactiveOmit(props, 'class')}
        class={cn(`data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`, props.class)}
      >
        {slots.default?.()}
      </RekaComboboxItem >
    )
  }
})
