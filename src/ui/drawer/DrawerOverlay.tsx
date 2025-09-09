import { DialogOverlay as RekaDialogOverlay, type DialogOverlayProps } from "reka-ui"
import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  as: prop<DialogOverlayProps['as']>().optional(),
  asChild: prop<DialogOverlayProps['asChild']>().optional(),
  forceMount: prop<DialogOverlayProps['forceMount']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const DrawerOverlay = defineComponent({
  name: 'DrawerOverlay',
  props,
  setup(props) {
    return () => (
      <RekaDialogOverlay
        data-slot="drawer-overlay"
        as={props.as}
        asChild={props.asChild}
        forceMount={props.forceMount}
        class={cn(`
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50
          bg-black/80`, props.class)}
      />
    )
  }
})
