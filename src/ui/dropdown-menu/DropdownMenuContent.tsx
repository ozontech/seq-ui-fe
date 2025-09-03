/* eslint-disable @typescript-eslint/no-unused-vars */
import { prop } from '@/lib/prop';
import { reactiveOmit } from '@vueuse/core';
import {
  DropdownMenuPortal,
  DropdownMenuContent as RekaDropdownMenuContent,
} from 'reka-ui';
import type { DropdownMenuContentProps, FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui';
import { defineComponent, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils'

const props = {
  align: prop<DropdownMenuContentProps['align']>().optional(),
  alignFlip: prop<DropdownMenuContentProps['alignFlip']>().optional(),
  alignOffset: prop<DropdownMenuContentProps['alignOffset']>().optional(),
  arrowPadding: prop<DropdownMenuContentProps['arrowPadding']>().optional(),
  as: prop<DropdownMenuContentProps['as']>().optional(),
  asChild: prop<DropdownMenuContentProps['asChild']>().optional(),
  avoidCollisions: prop<DropdownMenuContentProps['avoidCollisions']>().optional(),
  collisionBoundary: prop<DropdownMenuContentProps['collisionBoundary']>().optional(),
  collisionPadding: prop<DropdownMenuContentProps['collisionPadding']>().optional(),
  disableUpdateOnLayoutShift: prop<DropdownMenuContentProps['disableUpdateOnLayoutShift']>().optional(),
  forceMount: prop<DropdownMenuContentProps['forceMount']>().optional(),
  hideWhenDetached: prop<DropdownMenuContentProps['hideWhenDetached']>().optional(),
  loop: prop<DropdownMenuContentProps['loop']>().optional(),
  positionStrategy: prop<DropdownMenuContentProps['positionStrategy']>().optional(),
  prioritizePosition: prop<DropdownMenuContentProps['prioritizePosition']>().optional(),
  reference: prop<DropdownMenuContentProps['reference']>().optional(),
  side: prop<DropdownMenuContentProps['side']>().optional(),
  sideFlip: prop<DropdownMenuContentProps['sideFlip']>().optional(),
  sideOffset: prop<DropdownMenuContentProps['sideOffset']>().optional(4),
  sticky: prop<DropdownMenuContentProps['sticky']>().optional(),
  updatePositionStrategy: prop<DropdownMenuContentProps['updatePositionStrategy']>().optional(),
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

export const DropdownMenuContent = defineComponent({
  name: 'DropdownMenuContent',
  inheritAttrs: false,
  props,
  emits,
  setup(props, { attrs, slots }) {
    const delegatedProps = reactiveOmit(props, 'class')

    return () => (
      <DropdownMenuPortal>
        <RekaDropdownMenuContent
          data-slot="dropdown-menu-content"
          class={cn('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md', props.class)}
          {...attrs}
          {...delegatedProps}
          {...emits}
        >
          {slots.default?.()}
        </RekaDropdownMenuContent>
      </DropdownMenuPortal >
    )
  }
})
