import { defineComponent } from "vue";
import { LogTable } from "./components/log-table/LogTable";

export const App = defineComponent({
  setup() {
    const data = [{
      id: '1',
      timestamp: '2025-08-29T09:32:47.356Z',
      level: 3,
      message: 'error happened',
      source: 'k8s',
      service: 'itcrowd'
    }]

    return () => (
      <div>
        <LogTable data={data}/>
      </div>
    )
  }
})
