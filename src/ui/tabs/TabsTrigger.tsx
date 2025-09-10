import { prop } from "@/lib/prop";
import { TabsTrigger as RekaTabsTrigger, type TabsTriggerProps } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  value: prop<TabsTriggerProps['value']>().required(),
  as: prop<TabsTriggerProps['as']>().optional(),
  asChild: prop<TabsTriggerProps['asChild']>().optional(),
  disabled: prop<TabsTriggerProps['disabled']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const TabsTrigger = defineComponent({
  name: 'TabsTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaTabsTrigger
        data-slot="tabs-trigger"
        value={props.value}
        as={props.as}
        asChild={props.asChild}
        disabled={props.disabled}
        class={cn(
          `data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
          props.class,
        )}
      >
        {slots.default?.()}
      </RekaTabsTrigger>
    )
  },
})
