import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"
import {
  SelectViewport,
  SelectContent as RekaSelectContent,
  type SelectContentProps,
  SelectPortal,
  type PointerDownOutsideEvent,
} from "reka-ui";
import { reactiveOmit } from "@vueuse/core"
import { SelectScrollUpButton } from "./SelectScrollUpButton";
import { SelectScrollDownButton } from "./SelectScrollDownButton";

const props = {
  align: prop<SelectContentProps['align']>().optional(),
  alignFlip: prop<SelectContentProps['alignFlip']>().optional(),
  alignOffset: prop<SelectContentProps['alignOffset']>().optional(),
  arrowPadding: prop<SelectContentProps['arrowPadding']>().optional(),
  as: prop<SelectContentProps['as']>().optional(),
  asChild: prop<SelectContentProps['asChild']>().optional(),
  avoidCollisions: prop<SelectContentProps['avoidCollisions']>().optional(),
  bodyLock: prop<SelectContentProps['bodyLock']>().optional(),
  collisionBoundary: prop<SelectContentProps['collisionBoundary']>().optional(),
  collisionPadding: prop<SelectContentProps['collisionPadding']>().optional(),
  disableUpdateOnLayoutShift: prop<SelectContentProps['disableUpdateOnLayoutShift']>().optional(),
  forceMount: prop<SelectContentProps['forceMount']>().optional(),
  hideWhenDetached: prop<SelectContentProps['hideWhenDetached']>().optional(),
  position: prop<SelectContentProps['position']>().optional('popper'),
  positionStrategy: prop<SelectContentProps['positionStrategy']>().optional(),
  prioritizePosition: prop<SelectContentProps['prioritizePosition']>().optional(),
  reference: prop<SelectContentProps['reference']>().optional(),
  side: prop<SelectContentProps['side']>().optional(),
  sideFlip: prop<SelectContentProps['sideFlip']>().optional(),
  sideOffset: prop<SelectContentProps['sideOffset']>().optional(),
  sticky: prop<SelectContentProps['sticky']>().optional(),
  updatePositionStrategy: prop<SelectContentProps['updatePositionStrategy']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
  onEscapeKeyDown: prop<(event: KeyboardEvent) => void>().optional(),
  onPointerDownOutside: prop<(event: PointerDownOutsideEvent) => void>().optional(),
  onCloseAutoFocus: prop<(event: Event) => void>().optional(),
}

export const SelectContent = defineComponent({
  name: 'SelectContent',
  props,
  setup(props, { slots }) {
    return () => (
      <SelectPortal>
        <RekaSelectContent
          data-slot="select-content"
          {...reactiveOmit(props, "class")}
          class={cn(
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--reka-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
            props.position === 'popper'
            && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            props.class,
          )}
        >
          <SelectScrollUpButton />
          <SelectViewport
            class={cn('p-1', props.position === 'popper' && 'h-[var(--reka-select-trigger-height)] w-full min-w-[var(--reka-select-trigger-width)] scroll-my-1')}>
            {slots.default?.()}
          </SelectViewport>
          <SelectScrollDownButton />
        </RekaSelectContent >
      </SelectPortal >
    )
  }
})
