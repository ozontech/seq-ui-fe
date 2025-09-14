import { defineComponent, type HTMLAttributes, type InputHTMLAttributes } from "vue"
import { cn } from "~/lib/utils"
import { prop } from "@fe/prop-types"

const props = {
  value: prop<string>().required(),
  whenChange: prop<(value: string, event: Event) => void>().required(),
  class: prop<HTMLAttributes["class"]>().optional(),
  type: prop<InputHTMLAttributes['type']>().optional(),
  autofocus: prop<InputHTMLAttributes['autofocus']>().optional(),
  placeholder: prop<string>().optional(),
}

export const Input = defineComponent({
  name: 'BaseInput',
  props,
  setup(props) {
    return () => (
      <input
        value={props.value}
        placeholder={props.placeholder}
        onInput={(e) => props.whenChange((e.target as HTMLInputElement).value, e)}
        data-slot='input'
        type={props.type}
        autofocus={props.autofocus}
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
