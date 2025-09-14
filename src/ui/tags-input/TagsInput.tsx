import { defineComponent } from "vue";
import { TagsInputRoot, type TagsInputRootProps, type TagsInputRootEmits, type AcceptableInputValue } from "reka-ui"
import { prop } from "@fe/prop-types";
import { cn } from "~/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { formFieldProps, primitiveProps } from "../common-props";

const props = {
  ...primitiveProps,
  ...formFieldProps,
  value: prop<TagsInputRootProps['modelValue']>().required(),
  onChange: prop<(value: TagsInputRootEmits['update:modelValue'][0]) => void>().required(),
  defaultValue: prop<TagsInputRootProps['defaultValue']>().optional(),
  addOnPaste: prop<TagsInputRootProps['addOnPaste']>().optional(),
  addOnTab: prop<TagsInputRootProps['addOnTab']>().optional(),
  addOnBlur: prop<TagsInputRootProps['addOnBlur']>().optional(),
  duplicate: prop<TagsInputRootProps['duplicate']>().optional(),
  disabled: prop<TagsInputRootProps['disabled']>().optional(),
  delimiter: prop<TagsInputRootProps['delimiter']>().optional(),
  dir: prop<TagsInputRootProps['dir']>().optional(),
  max: prop<TagsInputRootProps['max']>().optional(),
  id: prop<TagsInputRootProps['id']>().optional(),
  convertValue: prop<TagsInputRootProps['convertValue']>().optional(),
  displayValue: prop<TagsInputRootProps['displayValue']>().optional(),
  onInvalid: prop<(value: AcceptableInputValue) => void>().optional(),
  onAddTag: prop<(value: AcceptableInputValue) => void>().optional(),
  onRemoveTag: prop<(value: AcceptableInputValue) => void>().optional(),
}

export const TagsInput = defineComponent({
  name: 'TagsInput',
  props,
  setup(props, { slots }) {
    return () => (
      <TagsInputRoot
        {...reactiveOmit(props, 'class', 'value', 'onChange')}
        modelValue={props.value}
        onUpdate:modelValue={props.onChange}
        class={cn('flex flex-wrap gap-2 items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm', props.class)}
      >
        {slots.default?.()}
      </TagsInputRoot>
    )
  }
})
