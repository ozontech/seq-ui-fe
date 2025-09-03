/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent, type HTMLAttributes } from 'vue'
import {
  PopoverPortal,
  PopoverContent as RekaPopoverContent,
  type PopoverContentProps,
  type PointerDownOutsideEvent,
  type FocusOutsideEvent,
} from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { prop } from '@/lib/prop'

const props = {
  class: prop<HTMLAttributes['class']>().optional(),
  align: prop<PopoverContentProps['align']>().optional('center'),
  sideOffset: prop<PopoverContentProps['sideOffset']>().optional(4),
}

const emits = {
  escapeKeyDown: (event: KeyboardEvent) => { },
  pointerDownOutside: (event: PointerDownOutsideEvent) => { },
  focusOutside: (event: FocusOutsideEvent) => { },
  interactOutside: (event: PointerDownOutsideEvent | FocusOutsideEvent) => { },
  openAutoFocus: (event: Event) => { },
  closeAutoFocus: (event: Event) => { },
}

export const PopoverContent = defineComponent({
  name: 'PopoverContent',
  inheritAttrs: false,
  props,
  emits,
  setup(props, { attrs, slots }) {
    const delegatedProps = reactiveOmit(props, 'class')

    return () => (
      <PopoverPortal>
        <RekaPopoverContent
          data-slot="popover-content"
          class={cn(
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md origin-(--reka-popover-content-transform-origin) outline-hidden',
            props.class
          )}
          {...attrs}
          {...delegatedProps}
          {...emits}
        >
          {slots.default?.()}
        </RekaPopoverContent>
      </PopoverPortal>
    )
  },
})
