import { prop } from "@/lib/prop-types/dist"
import type { TooltipProviderProps } from "reka-ui"
import { TooltipProvider as TP } from "reka-ui"
import { defineComponent } from "vue"

const props = {
  disabled: prop<TooltipProviderProps['disabled']>().optional(),
  delayDuration: prop<TooltipProviderProps['delayDuration']>().optional(0),
  skipDelayDuration: prop<TooltipProviderProps['skipDelayDuration']>().optional(),
  disableClosingTrigger: prop<TooltipProviderProps['disableClosingTrigger']>().optional(),
  disableHoverableContent: prop<TooltipProviderProps['disableHoverableContent']>().optional(),
  ignoreNonKeyboardFocus: prop<TooltipProviderProps['ignoreNonKeyboardFocus']>().optional(),
}

export const TooltipProvider = defineComponent({
  name: 'TooltipProvider',
  props,
  setup(props, { slots }) {
    return () => (
      <TP
        {...props}
      >
        {slots.default?.()}
      </TP>
    )
  }
})
