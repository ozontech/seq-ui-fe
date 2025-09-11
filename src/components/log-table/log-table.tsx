import { computed, defineComponent, onMounted, ref, type VNode } from "vue";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import type { ColumnDef, SortingState, Table } from "@tanstack/vue-table";
import type { Message as Log } from "@/types/messages";
import { prop } from "@/lib/prop";
import { format } from "date-fns-tz";

import { useDataGrid, useDataGridColumnSettings } from "../data-grid";
import type { SortDirection } from "@/types/shared";
import { LogView } from "@/components/log-view";


const props = {
  data: prop<Log[]>().required(),
  keywords: prop<string[]>().required(),
  timeDirection: prop<SortDirection>().optional(),
  columns: prop<ColumnDef<Log>[]>().optional(),
  isLoading: prop<boolean>().optional(false),
  loadMore: prop<() => Promise<void>>().optional(),
  setTimeDirection: prop<(value: SortDirection) => void>().optional(),
  query: prop<string>().optional(),
  pinned: prop<string[]>().optional([]),
  renderCell: prop<(key: string, item: Log) => VNode>().optional(),
  renderExpanded: prop<(item: Log, tableApi: Table<Log>) => VNode>().optional(),
}

const FIXED_WIDTH = {
  TIME: 200,
  ACTIONS: 36,
  OFFSET: 200,
}

export const LogTable = defineComponent({
  name: 'LogTable',
  props,
  setup(props) {
    const wrapperRef = ref<HTMLDivElement>()
    const messageWidth = ref(300)
    const DataGrid = useDataGrid<Log>()
    const DataGridColumnSettings = useDataGridColumnSettings<Log>()

    const columns = computed((): ColumnDef<Log>[] => [
      {
        accessorKey: 'timestamp',
        header: () => <div class='text-left'>Timestamp</div>,
        sortDescFirst: true,
        enableSorting: true,
        enableResizing: false,
        enableHiding: false,
        size: FIXED_WIDTH.TIME,
        maxSize: FIXED_WIDTH.TIME,
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
        size: messageWidth.value,
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
      ...props.keywords.map((column): ColumnDef<Log> => ({
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
        minSize: FIXED_WIDTH.ACTIONS,
        size: FIXED_WIDTH.ACTIONS,
        maxSize: FIXED_WIDTH.ACTIONS,
        cell: ({ column, row }) => {
          const view = props.renderCell?.(column.id, row.original)
          if (view) {
            return view
          }

          return row.getIsExpanded()
            ? <ChevronUp class="opacity-50"/>
            : <ChevronDown class="opacity-50"/>
        }
      },
    ])

    // сортировка колонки timestamp должна быть активна всегда
    const whenSortingChange = (state: SortingState, changeState: (state: SortingState) => void) => {
      if (state.length === 0) {
        changeState([{ id: 'timestamp', desc: true }])
      }

      const direction = state.find(item => item.id === 'timestamp')?.desc ?? true ? 'desc' : 'asc'
      props.setTimeDirection?.(direction)
    }

    const initialState = computed(() => {
      const defaultColumns = ['timestamp', 'message', 'actions'].map(column => [column, true])
      const restColumns = props.keywords.map(column => [column, false])

      return {
        columnVisibility: Object.fromEntries([...defaultColumns, ...restColumns]),
        sorting: [{ id: 'timestamp', desc: true }],
        columnPinning: { left: ['timestamp', 'message'], right: ['actions'] }
      }
    })

    const renderExpanded = (item: Log, tableApi: Table<Log>) => {
      if (props.renderExpanded) {
        return props.renderExpanded(item, tableApi)
      }

      return (
        <LogView
          log={item}
          query={props.query}
          pinned={props.pinned}
        />
      )
    }

    onMounted(() => {
      if (wrapperRef.value) {
        messageWidth.value = wrapperRef.value?.offsetWidth - FIXED_WIDTH.ACTIONS - FIXED_WIDTH.TIME - FIXED_WIDTH.OFFSET
      }
    })

    return () => (
      <div ref={wrapperRef}>
        <DataGrid
          columns={props.columns ?? columns.value}
          data={props.data}
          initialState={initialState.value}
          isLoading={props.isLoading}
          loadMore={props.loadMore}
          renderExpanded={renderExpanded}
          whenSortingChange={whenSortingChange}
        />
      </div>
    )
  }
})
