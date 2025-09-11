import { prop } from '@fe/prop-types';
import {
  DropdownMenuCheckboxItem as RekaDropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
} from 'reka-ui';
import { defineComponent, type HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';

const props = {
  value: prop<boolean>().required(),
  whenChange: prop<(value: boolean) => void>().required(),
  disabled: prop<boolean>().optional(false),
  textValue: prop<string>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const DropdownMenuCheckboxItem = defineComponent({
  name: 'DropdownMenuCheckboxItem',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaDropdownMenuCheckboxItem
        data-slot="dropdown-menu-checkbox-item"
        class={cn(
          `focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
          props.class,
        )}
        disabled={props.disabled}
        textValue={props.textValue}
        modelValue={props.value}
        onUpdate:modelValue={props.whenChange}
      >
        <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <DropdownMenuItemIndicator>
            <Check class="size-4" />
          </DropdownMenuItemIndicator>
        </span>
        {slots.default?.()}
      </RekaDropdownMenuCheckboxItem>
    )
  }
})
