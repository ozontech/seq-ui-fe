import type { TooltipTriggerProps } from "reka-ui"
import { TooltipTrigger as TT } from "reka-ui"
import { defineComponent } from "vue"
import { primitiveProps } from "../common-props"
import { prop } from "@fe/prop-types"

const props = {
  ...primitiveProps,
  reference: prop<TooltipTriggerProps['reference']>().optional(),
}

export const TooltipTrigger = defineComponent({
  name: 'TooltipTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <TT
        data-slot="tooltip-trigger"
        {...props}
      >
        {slots.default?.()}
      </TT>
    )
  }
})
