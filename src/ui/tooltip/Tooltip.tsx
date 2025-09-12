import { prop } from "@fe/prop-types"
import { TooltipRoot as TR } from "reka-ui"
import { defineComponent } from "vue"

const props = {
  open: prop<boolean>().required(),
  disabled: prop<boolean>().required(),
  defaultOpen: prop<boolean>().required(),
  disableClosingTrigger: prop<boolean>().required(),
  disableHoverableContent: prop<boolean>().required(),
  ignoreNonKeyboardFocus: prop<boolean>().required(),
  delayDuration: prop<number>().optional(),
}

const emits = {
  'update:open': (value: boolean) => {}
}

export const TooltipRoot = defineComponent({
  name: 'TooltipRoot',
  props,
  setup(props, { slots }) {
    return () => (
      <TR
        {...emits}
        {...props}
        data-slot="tooltip"
      >
        {slots.default?.()}
      </TR>
    )
  }
})
