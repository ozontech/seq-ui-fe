import { defineComponent } from "vue";
import { Button } from "./components/ui/button";

export const App = defineComponent({
  setup() {
    return () => (
      <div>
        <Button>
          Button
        </Button>
      </div>
    )
  }
})
