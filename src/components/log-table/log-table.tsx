import { computed, defineComponent, type VNode } from "vue";
import type { ColumnDef, SortingState, Table } from "@tanstack/vue-table";
import type { Log } from "@/types/log";
import { prop } from "@/lib/prop";

import { useDataGrid, useDataGridColumnSettings } from "../data-grid";
import { format } from "date-fns-tz";

const DataGrid = useDataGrid<Log>()
const DataGridColumnSettings = useDataGridColumnSettings<Log>()

const props = {
  data: prop<Log[]>().optional([]),
  columns: prop<ColumnDef<Log>[]>().optional(),
  renderCell: prop<(key: string, item: Log) => VNode>().optional(),
  renderExpanded: prop<(item: Log, tableApi: Table<Log>) => VNode>().optional(),
}

const allColumns = [
  'channel',
  'source',
  'service',
  'level',
  'id'
]

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
        enableHiding: false,
        size: 200,
        cell: ({ column, row }) => {
          const view = props.renderCell?.(column.id, row.original)
          if (view) {
            return view
          }

          const timestamp = row.getValue<string>(column.id)
          const [date, time] = format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss.SSS').split(' ')


          return (
            <div class="text-left">
              <span class="font-medium">{date}</span>{' '}
              <span>{time}</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'message',
        header: () => <div class='text-left'>Message</div>,
        enableSorting: false,
        enableResizing: true,
        enableHiding: false,
        minSize: 300,
        maxSize: 1000,
        cell: ({ column, row }) => {
          const view = props.renderCell?.(column.id, row.original)
          if (view) {
            return view
          }

          return (
            <div class='text-left text-ellipsis overflow-hidden'>
              {row.getValue<string>(column.id)}
            </div>
          )
        },
      },
      ...allColumns.map((column): ColumnDef<Log> => ({
        accessorKey: column,
        header: () => <div class='text-left'>{column}</div>,
        enableSorting: false,
        enableResizing: true,
        cell: ({ column, row }) => {
          const view = props.renderCell?.(column.id, row.original)
          if (view) {
            return view

          }

          return <>{row.getValue(column.id)}</>
        }
      })),
      {
        accessorKey: 'actions',
        header: (headerContext) => (
          <DataGridColumnSettings headerContext={headerContext} />
        ),
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 34,
        cell: ({ column, row }) => {
          const view = props.renderCell?.(column.id, row.original)
          if (view) {
            return view
          }

          return <div />
        }
      },
    ]

    // сортировка колонки timestamp должна быть активна всегда
    const whenSortingChange = (state: SortingState, changeState: (state: SortingState) => void) => {
      if (state.length === 0) {
        changeState([{ id: 'timestamp', desc: true }])
      }
    }

    const initialState = computed(() => {
      const defaultColumns = ['timestamp', 'message', 'actions'].map(column => [column, true])
      const restColumns = allColumns.map(column => [column, false])

      return {
        columnVisibility: Object.fromEntries([...defaultColumns, ...restColumns]),
        sorting: [{ id: 'timestamp', desc: true }],
      }
    })

    const renderExpanded = (item: Log, tableApi: Table<Log>) => {
      if (props.renderExpanded) {
        return props.renderExpanded(item, tableApi)
      }

      return (
        <div class="flex flex-col gap-[4px] whitespace-normal">
          {Object.entries(item).map(([field, value]) => (
            <div key={field} class="grid grid-cols-[200px_1fr]">
              <span>{field}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )
    }

    return () => (
      <DataGrid
        headerClass="sticky top-0 z-2"
        columns={props.columns ?? columns}
        data={props.data}
        initialState={initialState.value}
        isLoading={false}
        loadMore={() => { console.log('load more') }}
        renderExpanded={renderExpanded}
        whenSortingChange={whenSortingChange}
      />
    )
  }
})
