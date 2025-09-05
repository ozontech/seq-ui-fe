import { computed, defineComponent, type HTMLAttributes } from "vue";
import {
  CalendarRoot as RekaCalendarRoot,
  type CalendarRootProps,
  type DateValue,
} from "reka-ui"
import { cn } from "@/lib/utils"
import { CalendarCell } from "./CalendarCell";
import { CalendarCellTrigger } from './CalendarCellTrigger'
import { prop } from "@/lib/prop";
import { reactiveOmit } from "@vueuse/core"
import { CalendarHeader } from "./CalendarHeader";
import { CalendarHeading } from "./CalendarHeading";
import { CalendarPrevButton } from "./CalendarPrevButton";
import { CalendarNextButton } from "./CalendarNextButton";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarGridHead } from "./CalendarGridHead";
import { CalendarGridRow } from "./CalendarGridRow";
import { CalendarHeadCell } from "./CalendarHeadCell";
import { CalendarGridBody } from "./CalendarGridBody";
import { parseDate } from "@internationalized/date"

type CalendarValue = Date | Date[] | undefined

const props = {
  value: prop<CalendarValue>().required(),
  timezone: prop<string>().required(),
  whenValueChange: prop<(value: CalendarValue) => void>().required(),

  calendarLabel: prop<CalendarRootProps['calendarLabel']>().optional(),
  defaultPlaceholder: prop<CalendarRootProps['defaultPlaceholder']>().optional(),
  defaultValue: prop<CalendarRootProps['defaultValue']>().optional(),
  dir: prop<CalendarRootProps['dir']>().optional(),
  disableDaysOutsideCurrentView: prop<CalendarRootProps['disableDaysOutsideCurrentView']>().optional(),
  disabled: prop<CalendarRootProps['disabled']>().optional(),
  fixedWeeks: prop<CalendarRootProps['fixedWeeks']>().optional(),
  initialFocus: prop<CalendarRootProps['initialFocus']>().optional(),
  isDateDisabled: prop<CalendarRootProps['isDateDisabled']>().optional(),
  isDateUnavailable: prop<CalendarRootProps['isDateUnavailable']>().optional(),
  locale: prop<CalendarRootProps['locale']>().optional(),
  maxValue: prop<CalendarRootProps['maxValue']>().optional(),
  minValue: prop<CalendarRootProps['minValue']>().optional(),
  multiple: prop<CalendarRootProps['multiple']>().optional(),
  nextPage: prop<CalendarRootProps['nextPage']>().optional(),
  numberOfMonths: prop<CalendarRootProps['numberOfMonths']>().optional(),
  pagedNavigation: prop<CalendarRootProps['pagedNavigation']>().optional(),
  placeholder: prop<CalendarRootProps['placeholder']>().optional(),
  prevPage: prop<CalendarRootProps['prevPage']>().optional(),
  preventDeselect: prop<CalendarRootProps['preventDeselect']>().optional(),
  readonly: prop<CalendarRootProps['readonly']>().optional(),
  weekStartsOn: prop<CalendarRootProps['weekStartsOn']>().optional(),
  weekdayFormat: prop<CalendarRootProps['weekdayFormat']>().optional(),
  as: prop<CalendarRootProps['as']>().optional(),
  asChild: prop<CalendarRootProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
  whenPlaceholderChange: prop<(value: DateValue) => void>().optional(),
}


type SlotParams = {
  grid: {
    value: DateValue
    rows: DateValue[][]
    cells: DateValue[]
  }[]
  weekDays: string[]
}

export const Calendar = defineComponent({
  name: 'BaseCalendar',
  props,
  setup(props) {
    const modelValue = computed(() => {
      if (Array.isArray(props.value)) {
        return props.value.map(item => parseDate(item.toISOString().split('T')[0]))
      }

      return props.value ? parseDate(props.value.toISOString().split('T')[0]) : undefined
    })

    const whenValueChange = (calendarDate?: DateValue) => {
      props.whenValueChange(calendarDate?.toDate(props.timezone))
    }

    return () => (
      <RekaCalendarRoot
        data-slot="calendar"
        class={cn('p-3', props.class)}
        modelValue={modelValue.value}
        onUpdate:modelValue={whenValueChange}
        onUpdate:placeholder={props.whenPlaceholderChange}
        {...reactiveOmit(props, 'class', 'value')}
      >
        {{
          default: ({ grid, weekDays }: SlotParams) => (
            <>
              <CalendarHeader>
                <CalendarHeading />
                <div class="flex items-center gap-1">
                  <CalendarPrevButton />
                  <CalendarNextButton />
                </div>
              </CalendarHeader>

              <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                {grid.map(month => (
                  <CalendarGrid key={month.value.toString()}>
                    <CalendarGridHead>
                      <CalendarGridRow>
                        {weekDays.map(day => (<CalendarHeadCell key={day}>{day}</CalendarHeadCell>))}
                      </CalendarGridRow>
                    </CalendarGridHead>
                    <CalendarGridBody>
                      {month.rows.map((weekDates, index) => (
                        <CalendarGridRow key={`weekDate-${index}`} class="mt-2 w-full">
                          {weekDates.map(weekDate => (
                            <CalendarCell key={weekDate.toString()} date={weekDate}>
                              <CalendarCellTrigger day={weekDate} month={month.value} />
                            </CalendarCell>
                          ))}
                        </CalendarGridRow>
                      ))}
                    </CalendarGridBody>
                  </CalendarGrid>
                ))}
              </div >
            </>
          )
        }}
      </RekaCalendarRoot >
    )
  },
})
