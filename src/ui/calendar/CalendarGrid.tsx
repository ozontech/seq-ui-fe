import { defineComponent, type HTMLAttributes } from "vue";
import { CalendarGrid as RekaCalendarGrid, type CalendarGridProps } from "reka-ui"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types";

const props = {
  as: prop<CalendarGridProps['as']>().optional(),
  asChild: prop<CalendarGridProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarGrid = defineComponent({
  name: 'CalendarGrid',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarGrid
        data-slot="calendar-grid"
        class={cn('w-full border-collapse space-x-1', props.class)}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarGrid >
    )
  }
})
