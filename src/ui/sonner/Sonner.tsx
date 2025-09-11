import { prop } from "@fe/prop-types"
import { defineComponent } from "vue"
import type { ToasterProps } from "vue-sonner"
import { Toaster } from "vue-sonner"

const props = {
  dir: prop<ToasterProps['dir']>().optional(),
  gap: prop<ToasterProps['gap']>().optional(),
  id: prop<ToasterProps['id']>().optional(),
  icons: prop<ToasterProps['icons']>().optional(),
  class: prop<ToasterProps['class']>().optional(),
  style: prop<ToasterProps['style']>().optional(),
  theme: prop<ToasterProps['theme']>().optional(),
  expand: prop<ToasterProps['expand']>().optional(),
  hotkey: prop<ToasterProps['hotkey']>().optional(),
  invert: prop<ToasterProps['invert']>().optional(),
  offset: prop<ToasterProps['offset']>().optional(),
  duration: prop<ToasterProps['duration']>().optional(),
  position: prop<ToasterProps['position']>().optional(),
  richColors: prop<ToasterProps['richColors']>().optional(),
  closeButton: prop<ToasterProps['closeButton']>().optional(),
  mobileOffset: prop<ToasterProps['mobileOffset']>().optional(),
  toastOptions: prop<ToasterProps['toastOptions']>().optional(),
  visibleToasts: prop<ToasterProps['visibleToasts']>().optional(),
  swipeDirections: prop<ToasterProps['swipeDirections']>().optional(),
  containerAriaLabel: prop<ToasterProps['containerAriaLabel']>().optional(),
}

export const SonnerToaster = defineComponent({
  name: 'SonnerToaster',
  props,
  setup(props) {
    return () => (
      <Toaster
        {...props}
        class="toaster group"
        style={{
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        }}
        toastOptions={{
          ...props.toastOptions
        }}
      />
    )
  }
})
