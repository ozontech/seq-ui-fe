import { defineComponent, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const DrawerFooter = defineComponent({
  name: 'DrawerFooter',
  props,
  setup(props, { slots }) {
    return () => (
      <div
        data-slot="drawer-footer"
        class={cn('mt-auto flex flex-col gap-2 p-4', props.class)}
      >
        {slots.default?.()}
      </div>
    )
  }
})
