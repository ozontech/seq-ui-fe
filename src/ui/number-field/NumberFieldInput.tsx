import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"
import { NumberFieldInput as RekaNumberFieldInput, type NumberFieldInputProps } from "reka-ui"
import { prop } from "@fe/prop-types";

const props = {
  placeholder: prop<string>().optional(),
  as: prop<NumberFieldInputProps['as']>().optional(),
  asChild: prop<NumberFieldInputProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const NumberFieldInput = defineComponent({
  name: 'NumberFieldInput',
  props,
  setup(props) {
    return () => (
      <RekaNumberFieldInput
        //@ts-expect-error interface doesn't have this field
        placeholder={props.placeholder}
        data-slot="input"
        as={props.as}
        asChild={props.asChild}
        class={cn('flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm text-center shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class)}
      />
    )
  }
})
