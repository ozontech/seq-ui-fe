import { defineComponent, type HTMLAttributes } from "vue";
import type { CalendarCellProps } from "reka-ui"
import { CalendarCell as RekaCalendarCell } from "reka-ui"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types";


const props = {
  date: prop<CalendarCellProps['date']>().required(),
  as: prop<CalendarCellProps['as']>().optional(),
  asChild: prop<CalendarCellProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarCell = defineComponent({
  name: 'CalendarCell',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarCell
        data-slot="calendar-cell"
        class={cn('relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent', props.class)}
        date={props.date}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarCell>
    )
  },
})
