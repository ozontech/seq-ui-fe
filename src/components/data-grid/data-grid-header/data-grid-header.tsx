import { prop } from "@/lib/prop";
import { TableHead, TableHeader, TableRow } from "@/ui/table";
import { _getVisibleLeafColumns, FlexRender } from "@tanstack/vue-table";
import type { Column, Header, RowData, Table } from "@tanstack/vue-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-vue-next";
import { defineComponent, ref, type VNode } from "vue";

const sortIconsMap: Record<string, VNode> = {
  asc: <ArrowDown size={16} class="inline-block ml-1" />,
  desc: <ArrowUp size={16} class="inline-block ml-1" />,
  false: <ArrowUpDown size={16} class="inline-block ml-1" />,
}

export const useDataGridHeader = <T extends RowData>() => {
  const DataGridHeader = defineComponent({
    name: 'DataGridHeader',
    props: {
      tableApi: prop<Table<T>>().required(),
      headerClass: prop<string>().optional(),
    },
    setup(props) {
      const resizingHeaderId = ref<string>()

      const isLastHeader = <T extends RowData>(header: Header<T, unknown>) => {
        const columns = _getVisibleLeafColumns(props.tableApi)
        const lastColumn = columns[columns.length - 1]
        return header.getLeafHeaders().some((x) => lastColumn.id === x.id)
      }

      const renderSortIcon = (column: Column<T>) => {
        if (!column.getCanSort()) {
          return
        }

        return sortIconsMap[String(column.getIsSorted())]
      }

      const whenResize = (header: Header<T, unknown>) => (event: MouseEvent | TouchEvent) => {
        event.stopImmediatePropagation()
        event.preventDefault()

        resizingHeaderId.value = header.id
        header.getResizeHandler()(event)
      }

      const renderResizer = (header: Header<T, unknown>) => {
        if (!header.column.getCanResize()) {
          return
        }

        return (
          <div
            onDblclick={() => header.column.resetSize()}
            onMousedown={whenResize(header)}
            onTouchstart={whenResize(header)}
            class={['resizer', {
              'hoverable': header.column.getCanResize(),
              'isResizing': header.column.getIsResizing() && resizingHeaderId.value === header.id,
              'last': isLastHeader(header),
            }]}
          />
        )
      }

      const renderCell = (header: Header<T, unknown>) => (
        <TableHead
          key={header.id}
          class={[props.headerClass, 'bg-muted']}
          style={{ width: `${header.column.getSize()}px` }}
        >
          <div
            class={[{ ['select-none cursor-pointer']: header.column.getCanSort() }]}
            onClick={header.column.getToggleSortingHandler()}
          >
            <FlexRender
              class="inline-flex"
              render={header.column.columnDef.header}
              props={header.getContext()}
            />
            {renderSortIcon(header.column)}
          </div>
          {renderResizer(header)}
        </TableHead>
      )

      return () => (
        <TableHeader>
          {props.tableApi.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map(renderCell)}
            </TableRow>
          ))}
        </TableHeader>
      )
    }
  })

  return DataGridHeader
}
