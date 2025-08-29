import { DrawerClose as DC } from "vaul-vue"
import { defineComponent } from "vue"


export const DrawerClose = defineComponent({
  name: 'DrawerClose',
  setup(props, { slots }) {
    return () => (
      <DC
        {...props}
        data-slot="drawer-close"
      >
        {slots.default?.()}
      </DC>
    )

  }
})
