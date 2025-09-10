import { defineComponent } from "vue";
import type { Log } from "@/types/messages";
import { prop } from "@/lib/prop";

export const LogViewFields = defineComponent({
  name: 'LogViewFields',
  props: {
    log: prop<Log>().required(),
  },
  setup(props) {
    return () => (
      <div class="flex flex-col gap-[4px] whitespace-normal text-sm">
        {
          Object.entries(props.log).map(([field, value]) => (
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
