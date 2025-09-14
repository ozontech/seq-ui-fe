import { prop } from "@fe/prop-types";
import { cn } from "~/lib/utils"
import {
  CalendarGridRow as RekaCalendarGridRow,
  type CalendarGridRowProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";

const props = {
  as: prop<CalendarGridRowProps['as']>().optional(),
  asChild: prop<CalendarGridRowProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarGridRow = defineComponent({
  name: 'CalendarGridRow',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarGridRow
        data-slot="calendar-grid-row"
        class={cn('flex', props.class)}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarGridRow>
    )
  }
})
