import type { DrawerTitleProps } from "vaul-vue"
import { defineComponent, type HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { DrawerTitle as DT } from "vaul-vue"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
  as: prop<DrawerTitleProps['as']>().optional(),
  asChild: prop<DrawerTitleProps['asChild']>().optional(),
}

export const DrawerTitle = defineComponent({
  name: 'DrawerTitle',
  props,
  setup(props, { slots }) {
    const delegatedProps = reactiveOmit(props, "class")

    return () => (
      <DT
        {...delegatedProps}
        data-slot="drawer-title"
        class={cn('text-foreground font-semibold', props.class)}
      >
        {slots.default?.()}
      </DT>
    )
  }
})
