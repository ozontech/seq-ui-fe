import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"
import { NumberFieldRoot, type NumberFieldRootProps } from "reka-ui"

const props = {
  value: prop<NumberFieldRootProps['modelValue']>().required(),
  whenChange: prop<(value: number) => void>().required(),
  as: prop<NumberFieldRootProps['as']>().optional(),
  asChild: prop<NumberFieldRootProps['asChild']>().optional(),
  defaultValue: prop<NumberFieldRootProps['defaultValue']>().optional(),
  disableWheelChange: prop<NumberFieldRootProps['disableWheelChange']>().optional(),
  disabled: prop<NumberFieldRootProps['disabled']>().optional(),
  formatOptions: prop<NumberFieldRootProps['formatOptions']>().optional(),
  id: prop<NumberFieldRootProps['id']>().optional(),
  invertWheelChange: prop<NumberFieldRootProps['invertWheelChange']>().optional(),
  locale: prop<NumberFieldRootProps['locale']>().optional(),
  min: prop<NumberFieldRootProps['min']>().optional(),
  max: prop<NumberFieldRootProps['max']>().optional(),
  name: prop<NumberFieldRootProps['name']>().optional(),
  readonly: prop<NumberFieldRootProps['readonly']>().optional(),
  required: prop<NumberFieldRootProps['required']>().optional(),
  step: prop<NumberFieldRootProps['step']>().optional(),
  stepSnapping: prop<NumberFieldRootProps['stepSnapping']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const NumberField = defineComponent({
  name: 'NumberField',
  props,
  setup(props, { slots }) {
    return () => (
      <NumberFieldRoot
        class={cn('grid gap-1.5', props.class)}
        modelValue={props.value}
        onUpdate:modelValue={props.whenChange}
        as={props.as}
        asChild={props.asChild}
        defaultValue={props.defaultValue}
        disableWheelChange={props.disableWheelChange}
        disabled={props.disabled}
        formatOptions={props.formatOptions}
        id={props.id}
        invertWheelChange={props.invertWheelChange}
        locale={props.locale}
        min={props.min}
        max={props.max}
        name={props.name}
        readonly={props.readonly}
        required={props.required}
        step={props.step}
        stepSnapping={props.stepSnapping}
      >
        {slots.default?.()}
      </NumberFieldRoot>
    )
  },
})
