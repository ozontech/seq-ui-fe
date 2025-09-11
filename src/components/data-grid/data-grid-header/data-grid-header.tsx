import { prop } from "@fe/prop-types";
import { TableHead, TableHeader, TableRow } from "@/ui";
import { _getVisibleLeafColumns, FlexRender } from "@tanstack/vue-table";
import type { Column, Header, RowData, Table } from "@tanstack/vue-table";
import { ArrowDown, ArrowUp, ArrowUpDown, type LucideProps } from "lucide-vue-next";
import { defineComponent, ref, type FunctionalComponent } from "vue";
import { addPx } from "../utils";
import { cn } from "@/lib/utils"

const sortIconsMap: Record<string, FunctionalComponent<LucideProps>> = {
  asc: ArrowDown,
  desc: ArrowUp,
  false: ArrowUpDown,
}

// используется для красивого растягивания таблицы по ширине
const columnPlaceholder = [null]

export const useDataGridHeader = <T extends RowData>() => {
  const DataGridHeader = defineComponent({
    name: 'DataGridHeader',
    props: {
      tableApi: prop<Table<T>>().required(),
    },
    setup(props) {
      const resizingHeaderId = ref<string>()

      const getVisibleColumns = () => [
        props.tableApi.getLeftVisibleLeafColumns(),
        props.tableApi.getCenterVisibleLeafColumns(),
        columnPlaceholder,
        props.tableApi.getRightVisibleLeafColumns(),
      ].flat()

      const getHeaders = (rowIndex: number) => [
        props.tableApi.getLeftHeaderGroups()[rowIndex].headers,
        props.tableApi.getCenterHeaderGroups()[rowIndex].headers,
        columnPlaceholder,
        props.tableApi.getRightHeaderGroups()[rowIndex].headers,
      ].flat()

      const isLastHeader = <T extends RowData>(header: Header<T, unknown>) => {
        const columns = _getVisibleLeafColumns(props.tableApi)
        const lastColumn = columns[columns.length - 1]
        return header.getLeafHeaders().some((x) => lastColumn.id === x.id)
      }

      const renderSortIcon = (column: Column<T>) => {
        if (!column.getCanSort()) {
          return
        }

        const Icon = sortIconsMap[String(column.getIsSorted())]

        return <Icon size={16} class="inline-block ml-1" />
      }

      const whenResize = (header: Header<T, unknown>) => (event: MouseEvent | TouchEvent) => {
        event.stopImmediatePropagation()
        event.preventDefault()

        resizingHeaderId.value = header.id
        header.getResizeHandler()(event)
      }

      const renderResizer = (header: Header<T, unknown>) => {
        const canResize = header.column.getCanResize()
        const isResizing = header.column.getIsResizing() && resizingHeaderId.value === header.id

        if (!canResize) {
          return
        }

        return (
          <div
            onDblclick={() => header.column.resetSize()}
            onMousedown={whenResize(header)}
            onTouchstart={whenResize(header)}
            class={cn(
              'resizer',
              canResize && 'hoverable',
              isResizing && 'isResizing',
              isLastHeader(header) && 'last',
            )}
          />
        )
      }

      const renderCell = (header: Header<T, unknown> | null) => {
        if (!header) {
          return (
            <TableHead
              key={'placeholder'}
              class="bg-muted sticky top-0 z-2"
            />
          )
        }

        const position = header.column.getIsPinned()
        const hasCenterColumns = props.tableApi.getCenterVisibleLeafColumns().length > 0
        const canSort = header.column.getCanSort()

        const lastLeft = hasCenterColumns && position === 'left' && header.column.getIsLastColumn(position)
        const firstRight = hasCenterColumns && position === 'right' && header.column.getIsFirstColumn(position)

        return (
          <TableHead
            key={header.id}
            class={cn(
              'bg-muted sticky top-0 z-2',
              position && 'pinned-cell z-3',
              lastLeft && 'last-left',
              firstRight && 'first-right',
            )}
            style={{
              width: addPx(header.column.getSize()),
              left: position === 'left' ? addPx(header.column.getStart(position)) : undefined,
              right: position === 'right' ? addPx(header.column.getAfter(position)) : undefined,
            }}
          >
            <div
              class={cn(canSort && 'select-none cursor-pointer')}
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
      }

      return () => (
        <>
          {getVisibleColumns().map((column) => (
            <col
              key={column ? column.id : 'placeholder'}
              style={{
                width: column ? addPx(column.getSize()) : undefined,
              }}
            />
          ))}
          <TableHeader>
            {props.tableApi.getHeaderGroups().map((group, index) => (
              <TableRow key={group.id}>
                {getHeaders(index).map(renderCell)}
              </TableRow>
            ))}
          </TableHeader>
        </>
      )
    }
  })

  return DataGridHeader
}
