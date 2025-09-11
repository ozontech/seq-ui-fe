import { defineComponent } from "vue"

export const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup(_props, { slots }) {
    return () => slots.default?.()
  }
})
