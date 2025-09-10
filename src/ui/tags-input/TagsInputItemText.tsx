import { defineComponent } from "vue";
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { TagsInputItemText as RekaTagsInputItemText } from "reka-ui"
import { primitiveProps } from "../common-props";

export const TagsInputItemText = defineComponent({
  name: 'TagsInputItemText',
  props: primitiveProps,
  setup(props) {
    return () => (
      <RekaTagsInputItemText
        {...reactiveOmit(props, 'class')}
        class={cn('py-0.5 px-2 text-sm rounded bg-transparent', props.class)}
      />
    )
  }
})
