import { prop } from "@/lib/prop";
import { CalendarPrev, type CalendarPrevProps } from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"
import { buttonVariants } from "../button";
import { ChevronLeft } from "lucide-vue-next";

const props = {
  prevPage: prop<CalendarPrevProps['prevPage']>().optional(),
  as: prop<CalendarPrevProps['as']>().optional(),
  asChild: prop<CalendarPrevProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const CalendarPrevButton = defineComponent({
  name: 'CalendarPrevButton',
  props,
  setup(props, { slots }) {
    return () => (
      <CalendarPrev
        data-slot="calendar-prev-button"
        class={cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-1',
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          props.class,
        )}
        prevPage={props.prevPage}
        as={props.as}
        asChild={props.asChild}
      >
        {slots.default?.() ?? <ChevronLeft class="size-4" />}
      </CalendarPrev >
    )
  }
})
