import { defineComponent } from "vue";
import {
  CalendarGridBody as RekaCalendarGridBody,
  type CalendarGridBodyProps,
} from "reka-ui"
import { prop } from "@/lib/prop";

const props = {
  as: prop<CalendarGridBodyProps['as']>().optional(),
  asChild: prop<CalendarGridBodyProps['asChild']>().optional(),
}

export const CalendarGridBody = defineComponent({
  name: 'CalendarGridBody',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarGridBody
        data-slot="calendar-grid-body"
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarGridBody>
    )
  },
})
