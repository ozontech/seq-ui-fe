import { defineComponent, type HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { prop } from "@/lib/prop"

const props = {
  value: prop<string>().required(),
  whenChange: prop<(value: string) => void>().required(),
  class: prop<HTMLAttributes["class"]>().optional(),
}

export const Input = defineComponent({
  name: 'Input',
  props,
  setup(props) {
    return () => (
      <input
        value={props.value}
        onInput={(e) => props.whenChange((e.target as HTMLInputElement).value)}
        data-slot='input'
        class={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          props.class,
        )}
      />
    )
  }
})
