import { prop } from "@fe/prop-types";
import { defineComponent, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils"

const props = {
  class: prop<HTMLAttributes["class"]>().optional(),
}
export const Skeleton = defineComponent({
  name: 'BaseSkeleton',
  props,
  setup(props) {
    return () => (
      <div
        data-slot="skeleton"
        class={cn('animate-pulse rounded-md bg-primary/10', props.class)}
      />
    )
  }
})
