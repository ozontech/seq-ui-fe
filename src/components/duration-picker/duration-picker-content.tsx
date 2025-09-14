import { prop } from "@fe/prop-types";
import type { Duration } from "~/types/duration";
import type { Timezone } from "~/types/timezone";
import { Button } from "~/ui";
import { computed, defineComponent, ref } from "vue";
import { RelativeDuration } from "./relative-duration";
import { getUnitFromDuration } from "~/helpers/duration";
import { AbsolutePicker } from "./absolute-duration";

const props = {
  from: prop<Duration>().required(),
  to: prop<Duration>().required(),
  timezone: prop<Timezone>().required(),
  whenChange: prop<(from: Duration, to: Duration) => void>().required(),
  whenClose: prop<() => void>().required(),
}

export const DurationPickerContent = defineComponent({
  name: 'DurationPickerContent',
  props,
  setup(props) {
    const from = ref(props.from)
    const to = ref(props.to)
    const unit = computed(() => getUnitFromDuration(from.value, 'first'))
    const amount = computed(() => unit.value ? from.value[unit.value] : 0)

    const invalid = computed(() => {
      const partialAbsolute = !!from.value.date && !to.value.date || !from.value.date && !!to.value.date
      const invalidAbsolute = from.value.date && to.value.date && from.value.date > to.value.date
      const sameAbsolute = from.value.date && to.value.date && from.value.date === to.value.date

      return partialAbsolute || invalidAbsolute || sameAbsolute
    })

    const whenRelativeSelect = (value: Duration) => {
      from.value = value
      to.value = {}
    }

    const whenAbsoluteChange = (fromDate: Duration, toDate: Duration) => {
      from.value = fromDate
      to.value = toDate
    }

    const whenSubmit = () => {
      if (invalid.value) {
        return
      }

      props.whenChange(from.value, to.value)
      props.whenClose()
    }


    return () => (
      <>
        <div class="grid grid-cols-[45%_55%]">
          <div class="flex flex-col p-[8px_12px]">
            <AbsolutePicker
              from={from.value}
              to={to.value}
              timezone={props.timezone}
              whenChange={whenAbsoluteChange}
            />
          </div>
          <div class="flex flex-col p-[8px_12px] gap-[12px] border-l border-l-solid border-l-border">
            <RelativeDuration
              from={from.value}
              amount={amount.value}
              unit={unit.value}
              whenSelect={whenRelativeSelect}
            />
          </div>
        </div>
        <div class="flex flex-row-reverse gap-[12px] p-[12px] border-t border-t-solid border-t-border">
          <Button
            disabled={invalid.value}
            whenClick={whenSubmit}
          >
            Submit
          </Button>
          <Button
            variant="secondary"
            whenClick={props.whenClose}
          >
            Cancel
          </Button>
        </div>
      </>
    )
  }
})
