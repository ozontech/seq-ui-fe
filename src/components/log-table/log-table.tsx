import { defineComponent } from "vue";
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import type { Log } from "@/types/log";
import { prop } from "@/lib/prop";
import { Settings } from "lucide-vue-next";

import { useDataGrid } from "../data-grid";

const DataGrid = useDataGrid<Log>()

const props = {
  data: prop<Log[]>().optional([])
}

export const LogTable = defineComponent({
  name: 'LogTable',
  props,
  setup(props) {
    const columns: ColumnDef<Log>[] = [
      {
        accessorKey: 'timestamp',
        header: () => <div class='text-left'>Timestamp</div>,
        sortDescFirst: true,
        enableSorting: true,
        enableResizing: false,
        size: 200,
        cell: ({ row }) => {
          const timestamp = row.getValue('timestamp')

          return (
            <div class='text-left font-medium'>
              {timestamp}
            </div>
          )
        },
      },
      {
        accessorKey: 'message',
        enableSorting: false,
        enableResizing: true,
        minSize: 300,
        maxSize: 1000,
        cell: ({ row }) => {
          const message = row.getValue('message')

          return (
            <div class='text-left'>
              {message}
            </div>
          )
        },
      },
      {
        accessorKey: 'actions',
        // TODO: add settings
        header: () => (
          <div class="w-full justify-center align-middle">
            <Settings size={18} />
          </div>
        ),
        enableSorting: false,
        size: 34,
        enableResizing: false,
        cell: () => <div />
      }
    ]

    // сортировка колонки timestamp должна быть активна всегда
    const whenSortingChange = (state: SortingState, changeState: (state: SortingState) => void) => {
      if (state.length === 0) {
        changeState([{ id: 'timestamp', desc: true }])
      }
    }

    return () => (
      <DataGrid
        headerClass="sticky top-0 z-2"
        columns={columns}
        data={props.data}
        initialState={{ sorting: [{ id: 'timestamp', desc: true }] }}
        whenSortingChange={whenSortingChange}
      />
    )
  }
})
