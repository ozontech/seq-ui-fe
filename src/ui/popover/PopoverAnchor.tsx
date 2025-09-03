import { defineComponent } from "vue";
import { PopoverAnchor as RekaPopoverAnchor } from "reka-ui"

export const PopoverAnchor = defineComponent({
  name: 'PopoverAnchor',
  setup(_, { slots }) {
    return () => (
      <RekaPopoverAnchor data-slot="popover-anchor">
        {slots.default?.()}
      </RekaPopoverAnchor>
    )
  }
})
