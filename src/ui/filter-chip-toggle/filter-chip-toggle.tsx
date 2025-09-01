import type { PrimitiveProps } from "reka-ui"
import { defineComponent, type HTMLAttributes } from "vue"
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"

import { prop } from "@/lib/prop"
import { iconVariants, type IconVariants } from "@/ui/icon"

interface Props extends PrimitiveProps {
  variant?: IconVariants["variant"]
  size?: IconVariants["size"]
  class?: HTMLAttributes["class"]
  whenClick?: HTMLAttributes['onClick']
}

const props = {
  variant: prop<Props['variant']>().optional(),
  size: prop<Props['size']>().optional(),
  class: prop<Props['class']>().optional(),
  as: prop<Props['as']>().optional('button'),
  asChild: prop<Props['asChild']>().optional(),
  whenClick: prop<Props['whenClick']>().optional(),
}

export const FilterChipToggle = defineComponent({
  name: 'FilterChipToggle',
  props,
  setup(props, { slots }) {
    return () => (
      <Primitive
        data-slot="button"
        as={props.as}
        asChild={props.asChild}
        class={cn(iconVariants({ variant: props.variant, size: props.size }), props.class)}
        {...{onclick: props.whenClick}}

      >
        {slots.default?.()}
      </Primitive>
    )
  }
})
