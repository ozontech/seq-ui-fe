import { defineComponent, type HTMLAttributes } from "vue";
import {
  CalendarHeader as RekaCalendarHeader,
  type CalendarHeaderProps,
} from "reka-ui"
import { prop } from "@fe/prop-types";
import { cn } from "~/lib/utils"

const props = {
  as: prop<CalendarHeaderProps['as']>().optional(),
  asChild: prop<CalendarHeaderProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarHeader = defineComponent({
  name: 'CalendarHeader',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarHeader
        data-slot="calendar-header"
        class={cn('flex justify-center pt-1 relative items-center w-full', props.class)}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.()}
      </RekaCalendarHeader>
    )
  }
})
