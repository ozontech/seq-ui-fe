import { prop } from "@fe/prop-types";
import { TabsRoot, type TabsRootProps } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"

const props = {
  value: prop<string>().required(),
  whenChange: prop<(value: string) => void>().required(),
  activationMode: prop<TabsRootProps['activationMode']>().optional(),
  as: prop<TabsRootProps['as']>().optional(),
  asChild: prop<TabsRootProps['asChild']>().optional(),
  defaultValue: prop<string>().optional(),
  dir: prop<TabsRootProps['dir']>().optional(),
  orientation: prop<TabsRootProps['orientation']>().optional(),
  unmountOnHide: prop<TabsRootProps['unmountOnHide']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const Tabs = defineComponent({
  name: 'BaseTabs',
  props,
  setup(props, { slots }) {
    return () => (
      <TabsRoot
        data-slot="tabs"
        modelValue={props.value}
        activationMode={props.activationMode}
        as={props.as}
        asChild={props.asChild}
        defaultValue={props.defaultValue}
        dir={props.dir}
        orientation={props.orientation}
        unmountOnHide={props.unmountOnHide}
        onUpdate:modelValue={props.whenChange}
        class={cn('flex flex-col gap-2', props.class)}
      >
        {slots.default?.()}
      </TabsRoot >
    )
  },
})
