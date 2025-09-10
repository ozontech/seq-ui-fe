import { defineComponent } from "vue";
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { TagsInputItem as RekaTagsInputItem, type TagsInputItemProps } from "reka-ui"
import { prop } from "@/lib/prop";
import { primitiveProps } from "../common-props";

const props = {
  ...primitiveProps,
  value: prop<TagsInputItemProps['value']>().required(),
  disabled: prop<TagsInputItemProps['disabled']>().optional(),
}

export const TagsInputItem = defineComponent({
  name: 'TagsInputItem',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaTagsInputItem
        {...reactiveOmit(props, 'class')}
        class={cn('flex h-5 items-center rounded-md bg-secondary data-[state=active]:ring-ring data-[state=active]:ring-2 data-[state=active]:ring-offset-2 ring-offset-background', props.class)}
      >
        {slots.default?.()}
      </RekaTagsInputItem>
    )
  }
})
