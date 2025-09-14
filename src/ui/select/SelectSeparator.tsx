import { prop } from "@fe/prop-types";
import {
  SelectSeparator as RekaSelectSeparator,
  type SelectSeparatorProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"

const props = {
  as: prop<SelectSeparatorProps['as']>().optional(),
  asChild: prop<SelectSeparatorProps['asChild']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectSeparator = defineComponent({
  name: 'SelectSeparator',
  props,
  setup(props) {
    return () => (
      <RekaSelectSeparator
        data-slot="select-separator"
        as={props.as}
        asChild={props.asChild}
        class={cn('bg-border pointer-events-none -mx-1 my-1 h-px', props.class)}
      />
    )
  }
})
