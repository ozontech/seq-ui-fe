import { prop } from "@/lib/prop";
import {
  SelectLabel as RekaSelectLabel,
  type SelectLabelProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  as: prop<SelectLabelProps['as']>().optional(),
  asChild: prop<SelectLabelProps['asChild']>().optional(),
  for: prop<SelectLabelProps['for']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectLabel = defineComponent({
  name: 'SelectLabel',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectLabel
        data-slot="select-label"
        as={props.as}
        asChild={props.asChild}
        class={cn('px-2 py-1.5 text-sm font-medium', props.class)}
      >
        {slots.default?.()}
      </RekaSelectLabel>
    )
  }
})
