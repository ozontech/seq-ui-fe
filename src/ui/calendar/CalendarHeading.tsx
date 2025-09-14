import { prop } from "@fe/prop-types";
import {
  CalendarHeading as RekaCalendarHeading,
  type CalendarHeadingProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"

const props = {
  as: prop<CalendarHeadingProps['as']>().optional(),
  asChild: prop<CalendarHeadingProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarHeading = defineComponent({
  name: 'CalendarHeading',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaCalendarHeading
        data-slot="calendar-heading"
        class={cn('text-sm font-medium', props.class)}
        as={props.as}
        asChild={props.asChild}
      >
        {{
          default: ({ headingValue }: { headingValue: string }) => {
            return slots.default?.({ headingValue }) ?? headingValue
          }
        }}
      </RekaCalendarHeading>
    )
  }
})
