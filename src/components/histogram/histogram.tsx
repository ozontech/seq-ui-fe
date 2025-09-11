import { prop } from "@fe/prop-types";
import { defineComponent } from "vue";

const props = {
  whenZoom: prop<(from: number, to: number) => void>().required(),
}

export const Histogram = defineComponent({
  name: 'HistogramChart',
  props,
  setup(props) {
    const renderPlaceholder = () => (
      <div class="w-full h-full flex justify-center items-center text-sm text-muted-foreground">
        Data doesn't requested
      </div>
    )

    return () => (
      <>
        {renderPlaceholder()}
      </>
    )
  }
})
