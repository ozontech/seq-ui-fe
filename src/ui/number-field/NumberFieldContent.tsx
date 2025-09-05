import { prop } from "@/lib/prop";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  class: prop<HTMLAttributes['class']>().optional(),
}

export const NumberFieldContent = defineComponent({
  name: 'NumberFieldContent',
  props,
  setup(props, { slots }) {
    return () => (
      <div class={cn('relative [&>[data-slot=input]]:has-[[data-slot=increment]]:pr-5 [&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-5', props.class)}>
        {slots.default?.()}
      </div >
    )
  }
})
