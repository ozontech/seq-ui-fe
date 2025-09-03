/* eslint-disable @typescript-eslint/no-unused-vars */
import { prop } from "@/lib/prop";
import { defineComponent, type HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core"
import type {
  DropdownMenuSubContentProps,
  FocusOutsideEvent,
  PointerDownOutsideEvent,
} from "reka-ui"
import {
  DropdownMenuSubContent as RekaDropdownMenuSubContent,
  useForwardPropsEmits,
} from "reka-ui"
import { cn } from "@/lib/utils"

const props = {
  alignFlip: prop<DropdownMenuSubContentProps['alignFlip']>().optional(),
  alignOffset: prop<DropdownMenuSubContentProps['alignOffset']>().optional(),
  arrowPadding: prop<DropdownMenuSubContentProps['arrowPadding']>().optional(),
  as: prop<DropdownMenuSubContentProps['as']>().optional(),
  asChild: prop<DropdownMenuSubContentProps['asChild']>().optional(),
  avoidCollisions: prop<DropdownMenuSubContentProps['avoidCollisions']>().optional(),
  collisionBoundary: prop<DropdownMenuSubContentProps['collisionBoundary']>().optional(),
  collisionPadding: prop<DropdownMenuSubContentProps['collisionPadding']>().optional(),
  disableUpdateOnLayoutShift: prop<DropdownMenuSubContentProps['disableUpdateOnLayoutShift']>().optional(),
  forceMount: prop<DropdownMenuSubContentProps['forceMount']>().optional(),
  hideWhenDetached: prop<DropdownMenuSubContentProps['hideWhenDetached']>().optional(),
  loop: prop<DropdownMenuSubContentProps['loop']>().optional(),
  positionStrategy: prop<DropdownMenuSubContentProps['positionStrategy']>().optional(),
  prioritizePosition: prop<DropdownMenuSubContentProps['prioritizePosition']>().optional(),
  reference: prop<DropdownMenuSubContentProps['reference']>().optional(),
  sideFlip: prop<DropdownMenuSubContentProps['sideFlip']>().optional(),
  sideOffset: prop<DropdownMenuSubContentProps['sideOffset']>().optional(),
  sticky: prop<DropdownMenuSubContentProps['sticky']>().optional(),
  updatePositionStrategy: prop<DropdownMenuSubContentProps['updatePositionStrategy']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

const emits = {
  escapeKeyDown: (event: KeyboardEvent) => { },
  pointerDownOutside: (event: PointerDownOutsideEvent) => { },
  focusOutside: (event: FocusOutsideEvent) => { },
  interactOutside: (event: PointerDownOutsideEvent | FocusOutsideEvent) => { },
  openAutoFocus: (event: Event) => { },
  closeAutoFocus: (event: Event) => { },
}

export const DropdownMenuSubContent = defineComponent({
  name: 'DropdownMenuSubContent',
  inheritAttrs: false,
  props,
  emits,
  setup(props, { attrs, slots, emit }) {
    const delegatedProps = reactiveOmit(props, 'class')
    const forwardedProps = useForwardPropsEmits({ ...attrs, ...delegatedProps }, emit)

    return () => (
      <RekaDropdownMenuSubContent
        data-slot="dropdown-menu-sub-content"
        class={cn('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg', props.class)}
        {...forwardedProps.value}
      >
        {slots.default?.()}
      </RekaDropdownMenuSubContent>
    )
  }
})
