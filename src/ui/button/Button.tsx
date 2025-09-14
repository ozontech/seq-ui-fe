import type { PrimitiveProps } from "reka-ui"
import { defineComponent, type HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { cn } from "~/lib/utils"
import { buttonVariants } from "."
import { prop } from "@fe/prop-types"

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  whenClick?: HTMLAttributes['onClick']
}

const props = {
  disabled: prop<boolean>().optional(),
  variant: prop<Props['variant']>().optional(),
  size: prop<Props['size']>().optional(),
  class: prop<Props['class']>().optional(),
  as: prop<Props['as']>().optional('button'),
  asChild: prop<Props['asChild']>().optional(),
  whenClick: prop<Props['whenClick']>().optional(),
}

export const Button = defineComponent({
  name: 'BaseButton',
  props,
  setup(props, { slots }) {
    return () => (
      <Primitive
        data-slot="button"
        as={props.as}
        asChild={props.asChild}
        class={cn('cursor-pointer', buttonVariants({ variant: props.variant, size: props.size }), props.class)}
        //@ts-expect-error interface doesn't have this field
        disabled={props.disabled}
        {...{ onclick: props.whenClick }}
      >
        {slots.default?.()}
      </Primitive>
    )
  }
})
