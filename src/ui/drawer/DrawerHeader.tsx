import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const DrawerHeader = defineComponent({
  name: 'DrawerHeader',
  props,
  setup(props, { slots }) {
    return () => (
      <div
        data-slot="drawer-header"
        class={cn('flex flex-col gap-1.5 p-4', props.class)}
      >
        {slots.default?.()}
      </div>
    )
  }
})
