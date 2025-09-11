import { DefaultLayout } from "@/layouts/default";
import { SonnerToaster } from "@/ui/sonner";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const App = defineComponent({
  setup() {
    return () => (
      <DefaultLayout>
        <RouterView/>
        <SonnerToaster
          richColors
          position='bottom-right'
        />
      </DefaultLayout>
    )
  }
})
