import { prop } from "@/lib/prop";
import { TabsList as RekaTabsList, type TabsListProps } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  as: prop<TabsListProps['as']>().optional(),
  asChild: prop<TabsListProps['asChild']>().optional(),
  loop: prop<TabsListProps['loop']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const TabsList = defineComponent({
  name: 'TabsList',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaTabsList
        data-slot="tabs-list"
        as={props.as}
        asChild={props.asChild}
        loop={props.loop}
        class={cn(
          'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
          props.class,
        )}
      >
        {slots.default?.()}
      </RekaTabsList>
    )
  },
})
