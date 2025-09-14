import { prop } from "@fe/prop-types";
import {
  SelectScrollUpButton as RekaSelectScrollUpButton,
  type SelectScrollUpButtonProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils"
import { ChevronUp } from "lucide-vue-next";

const props = {
  as: prop<SelectScrollUpButtonProps['as']>().optional(),
  asChild: prop<SelectScrollUpButtonProps['asChild']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectScrollUpButton = defineComponent({
  name: 'SelectScrollUpButton',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectScrollUpButton
        data-slot="select-scroll-up-button"
        as={props.as}
        asChild={props.asChild}
        class={cn('flex cursor-default items-center justify-center py-1', props.class)}
      >
        {slots.default?.() ?? <ChevronUp class="size-4" />}
      </RekaSelectScrollUpButton>
    )
  }
})
