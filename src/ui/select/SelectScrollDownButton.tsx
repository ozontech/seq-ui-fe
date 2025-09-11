import { prop } from "@fe/prop-types";
import {
  SelectScrollDownButton as RekaSelectScrollDownButton,
  type SelectScrollDownButtonProps,
} from "reka-ui";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-vue-next";

const props = {
  as: prop<SelectScrollDownButtonProps['as']>().optional(),
  asChild: prop<SelectScrollDownButtonProps['asChild']>().optional(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const SelectScrollDownButton = defineComponent({
  name: 'SelectScrollDownButton',
  props,
  setup(props, { slots }) {
    return () => (
      <RekaSelectScrollDownButton
        data-slot="select-scroll-up-button"
        as={props.as}
        asChild={props.asChild}
        class={cn('flex cursor-default items-center justify-center py-1', props.class)}
      >
        {slots.default?.() ?? <ChevronDown class="size-4" />}
      </RekaSelectScrollDownButton>
    )
  }
})
