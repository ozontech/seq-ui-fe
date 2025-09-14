import { prop } from "@fe/prop-types";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
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
  Table as TanstackTable,
  ColumnPinningState
} from "@tanstack/vue-table";
import { defineComponent, ref, toRef, watch, type VNode } from "vue";
import { useDataGridHeader } from "./data-grid-header";
import { useDataGridBody } from "./data-grid-body";
import { valueUpdater } from "~/ui/table/utils";
import { Table } from "~/ui";

// TODO: add virtualization
// https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling
export const useDataGrid = <T extends RowData>() => {
  const DataGridHeader = useDataGridHeader<T>()
  const DataGridBody = useDataGridBody<T>()

  const DataGrid = defineComponent({
    name: 'DataGrid',
    props: {
      data: prop<T[]>().required(),
      columns: prop<ColumnDef<T>[]>().required(),
      initialState: prop<InitialTableState>().optional(),
      isLoading: prop<boolean>().optional(),
      loadMore: prop<() => void>().optional(),
      renderExpanded: prop<(item: T, tableApi: TanstackTable<T>) => VNode>().optional(),
      whenSortingChange: prop<(state: SortingState, changeSorting: (state: SortingState) => void) => void>().optional(),
    },
    setup(props) {
      // TODO: use performant column sizing
      // https://tanstack.com/table/latest/docs/framework/react/examples/column-resizing-performant
      const columnSizing = ref<ColumnSizingState>(props.initialState?.columnSizing ?? {})
      const columnVisibility = ref<VisibilityState>(props.initialState?.columnVisibility ?? {})
      const columnPinning = ref<ColumnPinningState>(props.initialState?.columnPinning ?? {})
      const sorting = ref<SortingState>(props.initialState?.sorting ?? [])
      const expanded = ref<ExpandedState>(props.initialState?.expanded ?? {})

      const whenSortingChange = (updaterOrValue: Updater<SortingState>) => {
        valueUpdater(updaterOrValue, sorting)
        props.whenSortingChange?.(sorting.value, (state) => sorting.value = state)
      }
      const data = toRef(props, 'data');
      const columns = toRef(props, 'columns');

      const tableApi = useVueTable<T>({
        data,
        columns: columns.value,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnSizingChange: updaterOrValue => valueUpdater(updaterOrValue, columnSizing),
        onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
        onColumnPinningChange: updaterOrValue => valueUpdater(updaterOrValue, columnPinning),
        onSortingChange: whenSortingChange,
        onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
        state: {
          get columnSizing() { return columnSizing.value },
          get columnVisibility() { return columnVisibility.value },
          get columnPinning() { return columnPinning.value },
          get sorting() { return sorting.value },
          get expanded() { return expanded.value },
        }
      })

      watch(columns, (columns) => {
        const newVisibility = props.initialState?.columnVisibility
        if (newVisibility) {
          columnVisibility.value = newVisibility
        }

        tableApi.setOptions((prev) => ({ ...prev, columns }))
      })

      return () => (
        <Table class="table-fixed w-full border-separate border-spacing-0">
          <DataGridHeader
            tableApi={tableApi}
            isLoading={props.isLoading}
          />
          <DataGridBody
            tableApi={tableApi}
            isLoading={props.isLoading}
            loadMore={props.loadMore}
            renderExpanded={props.renderExpanded}
          />
        </Table>
      )
    }
  })

  return DataGrid
}
