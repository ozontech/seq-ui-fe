import { prop } from "@fe/prop-types";
import {
  CalendarCellTrigger as RekaCalendarCellTrigger,
  type CalendarCellTriggerProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { buttonVariants } from "../button";
import { cn } from "~/lib/utils"

const props = {
  month: prop<CalendarCellTriggerProps['month']>().required(),
  day: prop<CalendarCellTriggerProps['day']>().required(),
  asChild: prop<CalendarCellTriggerProps['asChild']>().optional(),
  as: prop<CalendarCellTriggerProps['as']>().optional('button'),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const CalendarCellTrigger = defineComponent({
  name: 'CalendarCellTrigger',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarCellTrigger
        data-slot="calendar-cell-trigger"
        class={cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100 cursor-default',
          '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
          // Selected
          'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground',
          // Disabled
          'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
          // Unavailable
          'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
          // Outside months
          'data-[outside-view]:text-muted-foreground',
          props.class,
        )}
        month={props.month}
        day={props.day}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarCellTrigger >
    )
  }
})
