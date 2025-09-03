import { prop } from "@/lib/prop";
import { DropdownMenuSubTrigger as RekaDropdownMenuSubTrigger } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import type { DropdownMenuSubTriggerProps } from "reka-ui"
import { ChevronRight } from "lucide-vue-next"
import { cn } from "@/lib/utils"

const props = {
  as: prop<DropdownMenuSubTriggerProps['as']>().optional(),
  asChild: prop<DropdownMenuSubTriggerProps['asChild']>().optional(),
  textValue: prop<DropdownMenuSubTriggerProps['textValue']>().optional(),
  disabled: prop<DropdownMenuSubTriggerProps['disabled']>().optional(),
  inset: prop<boolean>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const DropdownMenuSubTrigger = defineComponent({
  name: 'DropdownMenuSubTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaDropdownMenuSubTrigger
        data-slot="dropdown-menu-sub-trigger"
        data-inset={props.inset ? '' : undefined}
        class={cn(
          'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
          props.class
        )}
        as={props.as}
        asChild={props.asChild}
        textValue={props.textValue}
        disabled={props.disabled}
      >
        {slots.default?.()}
        <ChevronRight class="ml-auto size-4" />
      </RekaDropdownMenuSubTrigger >
    )
  }
})
