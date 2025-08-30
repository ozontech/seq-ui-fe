import { prop } from "@/lib/prop"
import type { DrawerTriggerProps } from "vaul-vue"
import { DrawerTrigger as DT } from "vaul-vue"
import { defineComponent } from "vue"

const props = {
  as: prop<DrawerTriggerProps['as']>().optional(),
  asChild: prop<DrawerTriggerProps['asChild']>().optional(),
}

export const DrawerTrigger = defineComponent({
  name: 'DrawerTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <DT
        data-slot="drawer-trigger"
        {...props}
      >
        {slots.default?.()}
      </DT>
    )
  }
})
