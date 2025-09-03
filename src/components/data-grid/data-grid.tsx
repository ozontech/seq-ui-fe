import { prop } from "@/lib/prop";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import type {
  ColumnDef,
  ColumnSizingState,
  ExpandedState,
  InitialTableState,
  RowData,
  SortingState,
  Updater,
  VisibilityState,
  Table as TanstackTable
} from "@tanstack/vue-table";
import { defineComponent, nextTick, onMounted, ref, watch, type VNode } from "vue";
import { useDataGridHeader } from "./data-grid-header";
import { useDataGridBody } from "./data-grid-body";
import { getExpandedColumnSizingState } from "./utils";
import { valueUpdater } from "@/ui/table/utils";
import { Table } from "@/ui";

export const useDataGrid = <T extends RowData>() => {
  const DataGridHeader = useDataGridHeader<T>()
  const DataGridBody = useDataGridBody<T>()

  const DataGrid = defineComponent({
    name: 'DataGrid',
    props: {
      data: prop<T[]>().required(),
      columns: prop<ColumnDef<T>[]>().required(),
      initialState: prop<InitialTableState>().optional(),
      headerClass: prop<string>().optional(),
      isLoading: prop<boolean>().optional(),
      loadMore: prop<() => void>().optional(),
      renderExpanded: prop<(item: T, tableApi: TanstackTable<T>) => VNode>().optional(),
      whenSortingChange: prop<(state: SortingState, changeSorting: (state: SortingState) => void) => void>().optional(),
    },
    setup(props, { expose }) {
      const wrapperRef = ref<HTMLDivElement | null>(null)
      const initialized = ref(false)

      const columnSizing = ref<ColumnSizingState>(props.initialState?.columnSizing ?? {})
      const columnVisibility = ref<VisibilityState>(props.initialState?.columnVisibility ?? {})
      const sorting = ref<SortingState>(props.initialState?.sorting ?? [])
      const expanded = ref<ExpandedState>(props.initialState?.expanded ?? {})

      const whenSortingChange = (updaterOrValue: Updater<SortingState>) => {
        valueUpdater(updaterOrValue, sorting)
        props.whenSortingChange?.(sorting.value, (state) => sorting.value = state)
      }

      const tableApi = useVueTable({
        data: props.data,
        columns: props.columns,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnSizingChange: updaterOrValue => valueUpdater(updaterOrValue, columnSizing),
        onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
        onSortingChange: whenSortingChange,
        onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
        state: {
          get columnSizing() { return columnSizing.value },
          get columnVisibility() { return columnVisibility.value },
          get sorting() { return sorting.value },
          get expanded() { return expanded.value },
        }
      })

      const reinitialize = () => {
        initialized.value = false
      }

      const updateColumnsWidth = async () => {
        await nextTick()

        const columns = [
          ...tableApi.getLeftVisibleLeafColumns(),
          ...tableApi.getCenterVisibleLeafColumns(),
          ...tableApi.getRightVisibleLeafColumns(),
        ].map((leaf) => leaf.id)

        const updatedState = getExpandedColumnSizingState(
          columns,
          wrapperRef.value,
        )

        columnSizing.value = updatedState
      }

      expose({ reinitialize })

      watch(initialized, (isReady) => {
        if (!isReady) return

        updateColumnsWidth()
      })

      onMounted(() => {
        updateColumnsWidth()
      })

      return () => (
        <div class="w-full" ref={wrapperRef}>
          <Table class="table-fixed">
            <DataGridHeader
              tableApi={tableApi}
              headerClass={props.headerClass}
            />
            <DataGridBody
              tableApi={tableApi}
              isLoading={props.isLoading}
              loadMore={props.loadMore}
              renderExpanded={props.renderExpanded}
            />
          </Table>
        </div>
      )
    }
  })

  return DataGrid
}
