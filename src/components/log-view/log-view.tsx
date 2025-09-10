import { defineComponent } from "vue";
import type { Message } from "@/types/messages";
import { prop } from "@/lib/prop";

const props = {
  data: prop<Message>().required(),
}

export const LogView = defineComponent({
  name: 'LogView',
  props,
  setup(props) {
    return () => (
      <div class="flex flex-col gap-[4px] whitespace-normal text-sm">
        {
          Object.entries(props.data).map(([field, value]) => (
            <div key={field} class="grid grid-cols-[200px_1fr]">
              <span>{field}:</span>
              <span>{value}</span>
            </div>
          ))
        }
      </div>
    )
  }
})
