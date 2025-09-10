import { defineComponent } from "vue";
import { ComboboxContent, ComboboxPortal, type ComboboxContentProps } from "reka-ui"
import { prop } from "@/lib/prop";
import { cn } from "@/lib/utils"
import { reactiveOmit } from "@vueuse/core";
import { dismissableLayerProps, popperContentProps } from "../common-props";

const props = {
  ...popperContentProps,
  ...dismissableLayerProps,
  align: prop<ComboboxContentProps['align']>().optional('center'),
  sideOffset: prop<ComboboxContentProps['sideOffset']>().optional(4),
  forceMount: prop<ComboboxContentProps['forceMount']>().optional(false),
  position: prop<ComboboxContentProps['position']>().optional('popper'),
  bodyLock: prop<ComboboxContentProps['bodyLock']>().optional(),
}

export const ComboboxList = defineComponent({
  name: 'ComboboxList',
  props,
  setup(props, { slots }) {
    return () => (
      <ComboboxPortal>
        <ComboboxContent
          data-slot="combobox-list"
          {...reactiveOmit(props, 'class')}
          class={cn('z-50 w-[200px] rounded-md border bg-popover text-popover-foreground origin-(--reka-combobox-content-transform-origin) overflow-hidden shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', props.class)}
        >
          {slots.default?.()}
        </ComboboxContent>
      </ComboboxPortal >
    )
  }
})
