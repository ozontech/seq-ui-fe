import { prop } from "@fe/prop-types";
import {
  NumberFieldIncrement as RekaNumberFieldIncrement,
  type NumberFieldIncrementProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"
import { Plus } from "lucide-vue-next"

const props = {
  disabled: prop<NumberFieldIncrementProps['disabled']>().optional(),
  as: prop<NumberFieldIncrementProps['as']>().optional(),
  asChild: prop<NumberFieldIncrementProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const NumberFieldIncrement = defineComponent({
  name: 'NumberFieldIncrement',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaNumberFieldIncrement
        data-slot="increment"
        disabled={props.disabled}
        as={props.as}
        asChild={props.asChild}
        class={cn('absolute top-1/2 -translate-y-1/2 right-0 disabled:cursor-not-allowed disabled:opacity-20 p-3', props.class)}
      >
        {slots.default?.() ?? <Plus class="h-4 w-4" />}
      </RekaNumberFieldIncrement>
    )
  }
})
