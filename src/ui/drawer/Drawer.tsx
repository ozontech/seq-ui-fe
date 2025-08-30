import type { DrawerDirection } from "vaul-vue"
import { DrawerRoot } from "vaul-vue"
import { defineComponent } from "vue"
import { prop } from "@/lib/prop"

const props = {
  activeSnapPoint: prop<number | string | null>().optional(),
  closeThreshold: prop<number>().optional(),
  shouldScaleBackground: prop<boolean>().optional(true),
  setBackgroundColorOnScale: prop<boolean>().optional(),
  scrollLockTimeout: prop<number>().optional(),
  fixed: prop<boolean>().optional(),
  dismissible: prop<boolean>().optional(),
  modal: prop<boolean>().optional(),
  open: prop<boolean>().optional(),
  defaultOpen: prop<boolean>().optional(),
  nested: prop<boolean>().optional(),
  direction: prop<DrawerDirection>().optional(),
  noBodyStyles: prop<boolean>().optional(),
  handleOnly: prop<boolean>().optional(),
  preventScrollRestoration: prop<boolean>().optional(),
}

const emits = {
  drag: (percentageDragged: number) => typeof percentageDragged === 'number',
  release: (open: boolean) => typeof open === 'boolean',
  close: () => true,
  'update:open': (open: boolean) => typeof open === 'boolean',
  'update:activeSnapPoint': (val: string | number) =>
    typeof val === 'string' || typeof val === 'number',
  animationEnd: (open: boolean) => typeof open === 'boolean',
} as const

export const Drawer = defineComponent({
  name: 'Drawer',
  emits,
  props,
  setup(props, { slots, emit }) {
    return () => (
      <DrawerRoot
        {...props}
        {...emits}
      >
        {slots.default?.()}
      </DrawerRoot>
    )
  }
})
