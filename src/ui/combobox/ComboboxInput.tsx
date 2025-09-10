import { defineComponent } from "vue";
import { ComboboxInput as RekaComboboxInput, type ComboboxInputProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { prop } from "@/lib/prop";
import { listboxFilterProps } from "../common-props";

const props = {
  ...listboxFilterProps,
  placeholder: prop<string>().optional(),
  displayValue: prop<ComboboxInputProps['displayValue']>().optional(),
}

export const ComboboxInput = defineComponent({
  name: 'ComboboxInput',
  inheritAttrs: false,
  props,
  setup(props, { slots, attrs }) {
    return () => (
      <RekaComboboxInput
        data-slot="command-input"
        {...reactiveOmit(props, 'class', 'value', 'onChange')}
        {...attrs}
        modelValue={props.value}
        onUpdate:modelValue={props.onChange}
        class={cn(
          'placeholder:text-muted-foreground flex h-9 w-full rounded-md border border-input file:border-0 bg-transparent px-3 py-1 text-sm file:text-sm shadow-xs outline-hidden disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow]',
          props.class,
        )}
      >
        {slots.default?.()}
      </RekaComboboxInput>
    )
  }
})
