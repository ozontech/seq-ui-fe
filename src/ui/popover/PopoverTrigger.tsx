import { defineComponent } from "vue";
import { PopoverTrigger as RekaPopoverTrigger } from "reka-ui"

export const PopoverTrigger = defineComponent({
  name: 'PopoverTrigger',
  setup(_, { slots }) {
    return () => (
      <RekaPopoverTrigger data-slot="popover-trigger">
        {slots.default?.()}
      </RekaPopoverTrigger>
    )
  },
})
