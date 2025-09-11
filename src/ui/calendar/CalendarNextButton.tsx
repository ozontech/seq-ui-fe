import { prop } from "@fe/prop-types";
import { CalendarNext, type CalendarNextProps } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"
import { buttonVariants } from "../button";
import { ChevronRight } from "lucide-vue-next";

const props = {
  nextPage: prop<CalendarNextProps['nextPage']>().optional(),
  as: prop<CalendarNextProps['as']>().optional(),
  asChild: prop<CalendarNextProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarNextButton = defineComponent({
  name: 'CalendarNextButton',
  props,
  setup(props, { slots }) {
    return () => (
      <CalendarNext
        data-slot="calendar-next-button"
        class={cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-1',
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          props.class,
        )}
        nextPage={props.nextPage}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.() ?? <ChevronRight class="size-4" />}
      </CalendarNext>
    )
  }
})
