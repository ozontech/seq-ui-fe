import { prop } from "@/lib/prop"
import { DrawerClose as VaulDrawerClose, type DrawerCloseProps } from "vaul-vue"
import { defineComponent } from "vue"

const props = {
  as: prop<DrawerCloseProps['as']>().optional(),
  asChild: prop<DrawerCloseProps['asChild']>().optional(),
}

export const DrawerClose = defineComponent({
  name: 'DrawerClose',
  props,
  setup(props, { slots }) {
    return () => (
      <VaulDrawerClose
        data-slot="drawer-close"
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </VaulDrawerClose>
    )

  }
})
