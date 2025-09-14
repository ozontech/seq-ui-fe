import { prop } from "@fe/prop-types";
import {
  NumberFieldDecrement as RekaNumberFieldDecrement,
  type NumberFieldDecrementProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { Minus } from "lucide-vue-next"
import { cn } from "~/lib/utils"

const props = {
  disabled: prop<NumberFieldDecrementProps['disabled']>().optional(),
  as: prop<NumberFieldDecrementProps['as']>().optional(),
  asChild: prop<NumberFieldDecrementProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const NumberFieldDecrement = defineComponent({
  name: 'NumberFieldDecrement',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaNumberFieldDecrement
        data-slot="decrement"
        disabled={props.disabled}
        as={props.as}
        asChild={props.asChild}
        class={cn('absolute top-1/2 -translate-y-1/2 left-0 p-3 disabled:cursor-not-allowed disabled:opacity-20', props.class)}
      >
        {slots.default?.() ?? <Minus class="h-4 w-4" />}
      </RekaNumberFieldDecrement>
    )
  }
})
