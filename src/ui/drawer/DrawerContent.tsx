/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DialogContentProps, FocusOutsideEvent, PointerDownOutsideEvent } from "reka-ui"
import { defineComponent, type HTMLAttributes } from "vue"
import { DrawerContent as DC, DrawerPortal } from "vaul-vue"
import { cn } from "~/lib/utils"
import { DrawerOverlay } from "./DrawerOverlay"
import { prop } from "@fe/prop-types"

const props = {
  as: prop<DialogContentProps['as']>().optional(),
  asChild: prop<DialogContentProps['asChild']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
  forceMount: prop<DialogContentProps['forceMount']>().optional(),
  disableOutsidePointerEvents: prop<DialogContentProps['disableOutsidePointerEvents']>().optional(),
}

const emits = {
  escapeKeyDown: (event: KeyboardEvent) => true,
  pointerDownOutside: (event: PointerDownOutsideEvent) => true,
  focusOutside: (event: FocusOutsideEvent) => true,
  interactOutside: (event: PointerDownOutsideEvent | FocusOutsideEvent) => true,
  openAutoFocus: (event: Event) => true,
  closeAutoFocus: (event: Event) => true
} as const

export const DrawerContent = defineComponent({
  name: 'DrawerContent',
  emits,
  props,
  setup(props, { slots }) {
    return () => (
      <DrawerPortal>
        <DrawerOverlay />
        <DC
          data-slot="drawer-content"
          {...props}
          {...emits}
          class={cn(
            `group/drawer-content bg-background fixed z-50 flex h-auto flex-col`,
            `data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg`,
            `data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg`,
            `data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm`,
            `data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm`,
            props.class,
          )}
        >
          <div class="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
          {slots.default?.()}
        </DC>
      </DrawerPortal>
    )
  }
})
