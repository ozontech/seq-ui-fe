import { prop } from "@/lib/prop";
import {
  SelectIcon,
  SelectTrigger as RekaSelectTrigger,
  type SelectTriggerProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-vue-next";

const props = {
  as: prop<SelectTriggerProps['as']>().optional(),
  asChild: prop<SelectTriggerProps['asChild']>().optional(),
  disabled: prop<SelectTriggerProps['disabled']>().optional(),
  reference: prop<SelectTriggerProps['reference']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
  size: prop<'sm' | 'default'>().optional('default')
}

export const SelectTrigger = defineComponent({
  name: 'SelectTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectTrigger
        data-slot="select-trigger"
        data-size={props.size}
        as={props.as}
        asChild={props.asChild}
        disabled={props.disabled}
        reference={props.reference}
        class={cn(
          `border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
          props.class,
        )}
      >
        {slots.default?.()}
        <SelectIcon as-child>
          <ChevronDown class="size-4 opacity-50" />
        </SelectIcon>
      </RekaSelectTrigger>
    )
  }
})
