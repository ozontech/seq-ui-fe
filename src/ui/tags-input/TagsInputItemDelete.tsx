import { defineComponent } from "vue";
import { TagsInputItemDelete as RekaTagsInputItemDelete } from "reka-ui"
import { cn } from "~/lib/utils"
import { reactiveOmit } from "@vueuse/core"
import { X } from "lucide-vue-next";
import { primitiveProps } from "../common-props";

export const TagsInputItemDelete = defineComponent({
  name: 'TagsInputItemDelete',
  props: primitiveProps,
  setup(props, { slots }) {
    return () => (
      <RekaTagsInputItemDelete
        {...reactiveOmit(props, 'class')}
        class={cn('flex rounded bg-transparent mr-1 cursor-pointer', props.class)}
      >
        {slots.default?.() ?? <X class="w-4 h-4" />}
      </RekaTagsInputItemDelete>
    )
  }
})
