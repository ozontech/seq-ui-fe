import { prop } from "@/lib/prop";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger, TimeField } from "@/ui";
import { formatInTimeZone } from "date-fns-tz";
import { CalendarIcon } from "lucide-vue-next";
import { computed, defineComponent, ref } from "vue";
import { cn } from "@/lib/utils"

const props = {
  value: prop<Date>().optional(),
  timezone: prop<string>().required(),
  invalid: prop<boolean>().optional(),
  whenChange: prop<(value?: Date) => void>().required(),
}

export const DateTimePicker = defineComponent({
  name: 'DateTimePicker',
  props,
  setup(props) {
    const open = ref(false)

    const preview = computed(() => {
      if (!props.value) {
        return 'дд.мм.гггг'
      }

      return formatInTimeZone(props.value, props.timezone, 'dd.MM.yyyy')
    })

    const time = computed(() => {
      return props.value ? `${props.value.getHours()}:${props.value.getMinutes}:${props.value.getSeconds}` : ''
    })

    const whenOpenChange = (value: boolean) => {
      open.value = value
    }

    const whenDateChange = (value?: Date | Date[]) => {
      props.whenChange(Array.isArray(value) ? value[0] : value)
      whenOpenChange(false)
    }

    const whenTimeChange = (value: string) => {
      const date = props.value ?? new Date()
      const [h, m, s] = (value || '0:0:0').split(':').map(Number)

      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, 0)
      props.whenChange(newDate)
    }

    return () => (
      <div class="flex gap-[8px]">
        <Popover open={open.value} whenOpenChange={whenOpenChange}>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              class={cn(
                'w-[140px] font-normal',
                !props.value && 'text-muted-foreground',
                props.invalid && 'text-destructive',
              )}
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              {preview.value}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              locale="ru-RU"
              value={props.value}
              timezone={props.timezone}
              whenValueChange={whenDateChange}
            />
          </PopoverContent>
        </Popover>
        <TimeField
          class={cn(
            'text-foreground hover:text-foreground',
            !props.value && 'text-muted-foreground',
            props.invalid && 'text-destructive'
          )}
          locale="ru-RU"
          value={time.value}
          placeholder={'чч:мм:сс'}
          granularity="second"
          whenChange={whenTimeChange}
        />
      </div>
    )
  },
})
