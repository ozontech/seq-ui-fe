import { defineComponent } from "vue";
import type { CheckboxRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { Check } from "lucide-vue-next"
import { CheckboxIndicator, CheckboxRoot } from "reka-ui"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types";


type CheckboxValue = boolean | 'indeterminate'

const props = {
  value: prop<CheckboxValue>().required(),
  disabled: prop<CheckboxRootProps['disabled']>().optional(),
  defaultValue: prop<CheckboxRootProps['defaultValue']>().optional(),
  id: prop<CheckboxRootProps['id']>().optional(),
  name: prop<CheckboxRootProps['name']>().optional(),
  required: prop<CheckboxRootProps['required']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
  whenChange: prop<(value: CheckboxValue) => void>().optional(),
}

export const Checkbox = defineComponent({
  name: 'BaseCheckbox',
  props,
  setup(props) {
    return () => (
      <CheckboxRoot
        data-slot="checkbox"
        class={
          cn('peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            props.class)
        }
        disabled={props.disabled}
        defaultValue={props.defaultValue}
        modelValue={props.value}
        id={props.id}
        name={props.name}
        required={props.required}
        onUpdate:modelValue={props.whenChange}
      >
        <CheckboxIndicator
          data-slot="checkbox-indicator"
          class="flex items-center justify-center text-current transition-none"
        >
          <Check class="size-3.5" />
        </CheckboxIndicator>
      </CheckboxRoot >
    )
  }
})
