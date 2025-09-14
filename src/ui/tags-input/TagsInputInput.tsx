import { defineComponent, type InputHTMLAttributes } from "vue";
import {
  TagsInputInput as RekaTagsInputInput,
  type TagsInputInputProps,
} from "reka-ui"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types";
import { reactiveOmit } from "@vueuse/core"
import { primitiveProps } from "../common-props";

const props = {
  ...primitiveProps,
  type: prop<InputHTMLAttributes['type']>().optional(),
  placeholder: prop<TagsInputInputProps['placeholder']>().optional(),
  autoFocus: prop<TagsInputInputProps['autoFocus']>().optional(),
  maxLength: prop<TagsInputInputProps['maxLength']>().optional(),
}

export const TagsInputInput = defineComponent({
  name: 'TagsInputInput',
  props,
  setup(props) {
    return () => (
      <RekaTagsInputInput
        v-bind="forwardedProps"
        {...reactiveOmit(props, 'class')}
        class={cn('text-sm min-h-5 focus:outline-none flex-1 bg-transparent px-1', props.class)}
      />
    )
  }
})
