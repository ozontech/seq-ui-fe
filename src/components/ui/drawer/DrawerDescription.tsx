import type { DrawerDescriptionProps } from "vaul-vue"
import { defineComponent, type HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { DrawerDescription as DD } from "vaul-vue"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
  as: prop<DrawerDescriptionProps['as']>().optional(),
  asChild: prop<DrawerDescriptionProps['asChild']>().optional(),
}

export const DrawerDescription = defineComponent({
  name: 'DrawerDescription',
  props,
  setup(props, { slots }) {
    const delegatedProps = reactiveOmit(props, 'class')
    return () => (
      <DD
        {...delegatedProps}
        data-slot="drawer-description"
        class={cn('text-muted-foreground text-sm', props.class)}
      >
        {slots.default?.()}
      </DD>
    )
  }
})
