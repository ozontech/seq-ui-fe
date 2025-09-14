import { prop } from '@fe/prop-types';
import { DropdownMenuItem as DropdownItem } from 'reka-ui';
import type { DropdownMenuItemProps } from 'reka-ui'
import { defineComponent, type HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

const props = {
  disabled: prop<DropdownMenuItemProps['disabled']>().optional(),
  textValue: prop<DropdownMenuItemProps['textValue']>().optional(),
  variant: prop<'default' | 'destructive'>().optional('default'),
  inset: prop<boolean>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
  whenClick: prop<(event: Event) => void>().optional(),
}

export const DropdownMenuItem = defineComponent({
  name: 'DropdownMenuItem',
  props,
  setup(props, { slots }) {
    return () => (
      <DropdownItem
        data-slot="dropdown-menu-item"
        data-inset={props.inset ? '' : undefined}
        data-variant={props.variant}
        class={cn(`focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`, props.class)}
        disabled={props.disabled}
        textValue={props.textValue}
        onSelect={props.whenClick}
      >
        {slots.default?.()}
      </DropdownItem >
    )
  }
})
