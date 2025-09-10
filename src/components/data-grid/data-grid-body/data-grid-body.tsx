import { prop } from "@/lib/prop";
import { Skeleton, TableBody, TableCell, TableRow } from "@/ui";
import { FlexRender } from "@tanstack/vue-table";
import type { Cell, Row, RowData, Table } from "@tanstack/vue-table";
import { defineComponent, onBeforeUnmount, ref, type VNode, watch } from "vue";
import { addPx } from "../utils";
import { cn } from "@/lib/utils";

export const useDataGridBody = <T extends RowData>() => {
  const DataGridBody = defineComponent({
    name: 'DataGridBody',
    props: {
      tableApi: prop<Table<T>>().required(),
      loadMore: prop<() => void>().optional(),
      isLoading: prop<boolean>().optional(),
      renderExpanded: prop<(item: T, tableApi: Table<T>) => VNode>().optional(),
    },
    setup(props) {
      const lastRowRef = ref<HTMLTableRowElement>()
      const observer = ref<IntersectionObserver>()
      const onIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (!props.isLoading && entry.isIntersecting) {
            props.loadMore?.()
          }
        })
      }

      watch(() => lastRowRef.value, () => {
        observer.value = new IntersectionObserver(onIntersection)
        if (lastRowRef.value) {
          observer.value.observe(lastRowRef.value)
        }
      })

      onBeforeUnmount(() => {
        observer.value?.disconnect()
      })

      const renderSkeleton = () => {
        return Array.from({ length: 20 }, (_, index) => (
          <TableRow key={`skeleton-${index}`}>
            {props.tableApi.getVisibleFlatColumns().map((column) => (
              <TableCell
                key={column.id}
              >
                <Skeleton class="w-full h-[20px]" />
              </TableCell>
            ))}
            <TableCell>
              <Skeleton class="w-full h-[20px]" />
            </TableCell>
          </TableRow>
        ))
      }

      const renderEmpty = () => (
        <TableRow>
          <TableCell
            colspan={props.tableApi.getVisibleFlatColumns().length + 1}
            class="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )

      const renderCell = (cell: Cell<T, unknown> | null) => {
        if (!cell) {
          return (
            <TableCell
              key={'placeholder'}
              class="bg-background border-b-1 border-b-border border-b-solid"
            />
          )
        }

        const position = cell.column.getIsPinned()
        const hasCenterColumns = props.tableApi.getCenterVisibleLeafColumns().length > 0

        const lastLeft = hasCenterColumns && position === 'left' && cell.column.getIsLastColumn(position)
        const firstRight = hasCenterColumns && position === 'right' && cell.column.getIsFirstColumn(position)

        return (
          <TableCell
            key={cell.id}
            class={cn(
              'bg-background border-b-1 border-b-border border-b-solid text-ellipsis overflow-hidden',
              position && 'pinned-cell sticky z-1',
              lastLeft && 'last-left',
              firstRight && 'first-right',
            )}
            style={{
              width: addPx(cell.column.getSize()),
              left: position === 'left' ? addPx(cell.column.getStart(position)) : undefined,
              right: position === 'right' ? addPx(cell.column.getAfter(position)) : undefined,
            }}
          >
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </TableCell>
        )
      }

      const renderRow = (row: Row<T>) => {
        const cells = [
          row.getLeftVisibleCells(),
          row.getCenterVisibleCells(),
          [null],
          row.getRightVisibleCells()
        ].flat()

        return (
          <>
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? 'selected' : undefined}
              whenClick={() => row.toggleExpanded()}
            >
              {cells.map(renderCell)}
            </TableRow>
            {row.getIsExpanded() && props.renderExpanded && (
              <TableRow data-nonhoverable="true">
                <TableCell
                  colspan={props.tableApi.getVisibleFlatColumns().length}
                >
                  {props.renderExpanded(row.original, props.tableApi)}
                </TableCell>
              </TableRow>
            )}
          </>
        )
      }

      return () => (
        <TableBody>
          {props.tableApi.getRowModel().rows?.length
            ? props.tableApi.getRowModel().rows.map(renderRow)
            : renderEmpty()
          }
          {props.isLoading && renderSkeleton()}
          <TableRow innerRef={lastRowRef} />
        </TableBody>
      )
    }
  })

  return DataGridBody
}
