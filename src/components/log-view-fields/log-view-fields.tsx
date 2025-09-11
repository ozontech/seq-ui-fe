import { defineComponent } from "vue";
import type { Log } from "@/types/messages";
import { prop } from "@fe/prop-types";
import { LogField } from "@/components/log-field";
import { keys } from "ramda";

export const LogViewFields = defineComponent({
  name: 'LogViewFields',
  props: {
    log: prop<Log>().required(),
  },
  setup(props) {
    return () => (
      <div class="flex flex-col gap-[4px] whitespace-normal text-sm">
        {
          keys(props.log).map((field) => (
            <div key={field} class="grid grid-cols-[200px_1fr]">
              <span>{field}:</span>
              <LogField
                log={props.log}
                name={field}
              />
            </div>
          ))
        }
      </div>
    )
  }
})
