import type { TooltipContentProps } from "reka-ui"
import { defineComponent } from "vue"
import { TooltipArrow as TA, TooltipContent as TC, TooltipPortal as TP } from "reka-ui"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop-types/dist"
import { primitiveProps } from "../common-props"

const props = {
  ...primitiveProps,
  sideOffset: prop<number>().optional(4),
  side: prop<TooltipContentProps['side']>().optional(),
  align: prop<TooltipContentProps['align']>().optional(),
  sticky: prop<TooltipContentProps['sticky']>().optional(),
  ariaLabel: prop<TooltipContentProps['ariaLabel']>().optional(),
  forceMount: prop<TooltipContentProps['forceMount']>().optional(),
  alignOffset: prop<TooltipContentProps['alignOffset']>().optional(),
  arrowPadding: prop<TooltipContentProps['arrowPadding']>().optional(),
  avoidCollisions: prop<TooltipContentProps['avoidCollisions']>().optional(),
  collisionPadding: prop<TooltipContentProps['collisionPadding']>().optional(),
  hideWhenDetached: prop<TooltipContentProps['hideWhenDetached']>().optional(),
  positionStrategy: prop<TooltipContentProps['positionStrategy']>().optional(),
  collisionBoundary: prop<TooltipContentProps['collisionBoundary']>().optional(),
  updatePositionStrategy: prop<TooltipContentProps['updatePositionStrategy']>().optional(),
}

const emits = {
  escapeKeyDown: (event: KeyboardEvent) => {},
  pointerDownOutside: (event: PointerEvent) => {}
}

export const TooltipContent = defineComponent({
  name: 'TooltipContent',
  inheritAttrs: false,
  props,
  setup(props, { slots, attrs }) {
    return () => (
      <TP>
        <TC
          data-slot="tooltip-content"
          {...props}
          {...emits}
          {...attrs}
          class={cn(`
            bg-primary text-primary-foreground animate-in fade-in-0
            zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0
            data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance`,
            props.class
          )}
        >
          {slots.default?.()}
          <TA class="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
        </TC>
      </TP>
    )
  }
})
