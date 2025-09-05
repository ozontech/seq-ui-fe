import { defineComponent, type HTMLAttributes } from "vue";
import { prop } from "@/lib/prop";
import {
  CalendarGridHead as RekaCalendarGridHead,
  type CalendarGridHeadProps
} from "reka-ui";

const props = {
  as: prop<CalendarGridHeadProps['as']>().optional(),
  asChild: prop<CalendarGridHeadProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarGridHead = defineComponent({
  name: 'CalendarGridHead',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarGridHead
        data-slot="calendar-grid-head"
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarGridHead>
    )
  },
})
