import { defineComponent } from "vue";
import type { Log } from "@/types/messages";
import { prop } from "@fe/prop-types";
import { LogViewButtons } from "@/components/log-view-buttons";
import { LogViewFields } from "@/components/log-view-fields";
import { LogViewPins } from "@/components/log-view-pins";

export const LogView = defineComponent({
  name: 'LogView',
  props: {
    log: prop<Log>().required(),
    query: prop<string>().optional(),
    pinned: prop<string[]>().optional([]),
  },
  setup(props) {
    return () => (
      <div class='flex flex-col gap-[12px]'>
        <LogViewButtons
          log={props.log}
          query={props.query}
        />
        <LogViewPins
          log={props.log}
          pinned={props.pinned}
        />
        <LogViewFields
          log={props.log}
        />
      </div>
    )
  }
})
