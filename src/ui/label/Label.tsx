import { defineComponent } from "vue";
import type { LabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { Label as RekaLabel } from "reka-ui"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop";

const props = {
  as: prop<LabelProps['as']>().optional(),
  asChild: prop<LabelProps['asChild']>().optional(),
  for: prop<LabelProps['for']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const Label = defineComponent({
  name: 'BaseLabel',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaLabel
        data-slot="label"
        class={
          cn(
            'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            props.class,
          )
        }
        as={props.as}
        asChild={props.asChild}
        for={props.for}
      >
        {slots.default?.()}
      </RekaLabel >
    )
  }
})
