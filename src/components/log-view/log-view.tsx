import { defineComponent } from "vue";
import type { Log } from "@/types/messages";
import { prop } from "@/lib/prop";
import { LogViewButtons } from "@/components/log-view-buttons";
import { LogViewFields } from "@/components/log-view-fields";

export const LogView = defineComponent({
  name: 'LogView',
  props: {
    log: prop<Log>().required(),
    query: prop<string>().optional(),
  },
  setup(props) {
    return () => (
      <div class='flex flex-col gap-[8px]'>
        <LogViewButtons log={props.log}/>
        <LogViewFields log={props.log}/>
      </div>
    )
  }
})
