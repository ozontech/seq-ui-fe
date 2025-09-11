import { durationToMessage } from "@/helpers/duration-locale";
import { prop } from "@fe/prop-types";
import type { Duration } from "@/types/duration";
import type { Timezone } from "@/types/timezone";
import { Button } from "@/ui";
import { formatInTimeZone } from "date-fns-tz";
import { defineComponent } from "vue";

const props = {
  from: prop<Duration>().required(),
  to: prop<Duration>().required(),
  timezone: prop<Timezone>().required(),
}

export const DurationPickerTrigger = defineComponent({
  name: 'DurationPickerTrigger',
  props,
  setup(props) {
    const renderAbsolute = (_date: Date) => {
      const [date, time] = formatInTimeZone(_date, props.timezone.name, 'dd.MM.yyyy HH:mm:ss').split(' ')
      return (
        <>
          <span class="text-base">{date}</span>{' '}
          <span class="text-base text-muted-foreground">{time}</span>
        </>
      )
    }

    const renderDate = (duration: Duration) => {
      const message = durationToMessage(duration)
      if (!message) {
        return renderAbsolute(duration.date!)
      }

      const [last, amount, unit] = message
      return (
        <>
          <span class="text-base text-muted-foreground">{last}</span>{' '}
          <span class="text-base">{amount} {unit}</span>
        </>
      )
    }

    const durationNotEmpty = (value?: Duration): value is Duration => {
      return Boolean(value && Object.keys(value).length)
    }

    const renderInterval = () => (
      <span>
        {durationNotEmpty(props.from) && renderDate(props.from)}
        {durationNotEmpty(props.to) && props.from?.date && (
          <>
            <span class="text-base text-muted-foreground"> - </span>
            {renderDate(props.to)}
          </>
        )}
      </span>
    )

    return () => (
      <Button class="rounded-none" variant="outline">
        {renderInterval}
      </Button>
    )
  }
})
