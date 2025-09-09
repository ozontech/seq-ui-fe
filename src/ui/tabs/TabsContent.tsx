import { prop } from "@/lib/prop";
import { TabsContent as RekaTabsContent, type TabsContentProps } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  value: prop<TabsContentProps['value']>().required(),
  as: prop<TabsContentProps['as']>().optional(),
  asChild: prop<TabsContentProps['asChild']>().optional(),
  forceMount: prop<TabsContentProps['forceMount']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const TabsContent = defineComponent({
  name: 'TabsContent',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaTabsContent
        data-slot="tabs-content"
        class={cn('flex-1 outline-none', props.class)}
        value={props.value}
        as={props.as}
        asChild={props.asChild}
        forceMount={props.forceMount}
      >
        {slots.default?.()}
      </RekaTabsContent>
    )
  }
})
