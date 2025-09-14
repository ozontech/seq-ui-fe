import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import {
  SelectItem as RekaSelectItem,
  type SelectItemProps,
  SelectItemIndicator,
  SelectItemText,
  type AcceptableValue,
} from "reka-ui"
import { Check } from "lucide-vue-next"
import { cn } from "~/lib/utils"

const props = {
  value: prop<SelectItemProps['value']>().required(),
  whenSelect: prop<(value: AcceptableValue) => void>().optional(),
  as: prop<SelectItemProps['as']>().optional(),
  asChild: prop<SelectItemProps['asChild']>().optional(),
  disabled: prop<SelectItemProps['disabled']>().optional(),
  textValue: prop<SelectItemProps['textValue']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectItem = defineComponent({
  name: 'SelectItem',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectItem
        data-slot="select-item"
        value={props.value}
        as={props.as}
        asChild={props.asChild}
        disabled={props.disabled}
        textValue={props.textValue}
        onSelect={props.whenSelect}
        class={
          cn(
            `focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2`,
            props.class,
          )
        }
      >
        <span class="absolute right-2 flex size-3.5 items-center justify-center">
          <SelectItemIndicator>
            <Check class="size-4" />
          </SelectItemIndicator>
        </span>

        <SelectItemText>
          {slots.default?.()}
        </SelectItemText>
      </RekaSelectItem>
    )
  }
})
