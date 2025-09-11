import { prop } from "@fe/prop-types";
import { cn } from "@/lib/utils"
import {
  CalendarHeadCell as RekaCalendarHeadCell,
  type CalendarHeadCellProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";

const props = {
  as: prop<CalendarHeadCellProps['as']>().optional(),
  asChild: prop<CalendarHeadCellProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarHeadCell = defineComponent({
  name: 'CalendarHeadCell',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarHeadCell
        data-slot="calendar-head-cell"
        class={cn('text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]', props.class)}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarHeadCell>
    )
  }
})
