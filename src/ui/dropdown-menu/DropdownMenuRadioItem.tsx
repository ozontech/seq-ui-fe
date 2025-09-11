import { defineComponent, type HTMLAttributes } from "vue";
import type { DropdownMenuRadioItemProps } from "reka-ui"
import { Circle } from "lucide-vue-next"
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem as RekaDropdownMenuRadioItem,
} from "reka-ui"
import { cn } from "@/lib/utils"
import { prop } from "@fe/prop-types";

const props = {
  value: prop<DropdownMenuRadioItemProps['value']>().required(),
  disabled: prop<DropdownMenuRadioItemProps['disabled']>().optional(),
  textValue: prop<DropdownMenuRadioItemProps['textValue']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
  whenSelect: prop<(value: string) => void>().optional(),
}

export const DropdownMenuRadioItem = defineComponent({
  name: 'DropdownMenuRadioItem',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaDropdownMenuRadioItem
        data-slot="dropdown-menu-radio-item"
        class={cn(
          `focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
          props.class,
        )}
        onSelect={() => props.whenSelect?.(props.value)}
        value={props.value}
        textValue={props.textValue}
        disabled={props.disabled}
      >
        <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuItemIndicator>
            <Circle class="size-2 fill-current" />
          </DropdownMenuItemIndicator>
        </span>
        {slots.default?.()}
      </RekaDropdownMenuRadioItem >
    )
  },
})
