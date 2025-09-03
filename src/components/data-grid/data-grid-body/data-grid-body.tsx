import { prop } from "@/lib/prop";
import { Skeleton, TableBody, TableCell, TableRow } from "@/ui";
import { FlexRender } from "@tanstack/vue-table";
import type { Row, RowData, Table } from "@tanstack/vue-table";
import { defineComponent, onBeforeUnmount, ref, type VNode, watch } from "vue";

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
          </TableRow>
        ))
      }

      const renderEmpty = () => (
        <TableRow>
          <TableCell
            colspan={props.tableApi.getVisibleFlatColumns().length}
            class="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )

      const renderRow = (row: Row<T>) => (
        <>
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() ? 'selected' : undefined}
            whenClick={() => row.toggleExpanded()}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{ width: `${cell.column.getSize()}px` }}
              >
                <FlexRender
                  render={cell.column.columnDef.cell}
                  props={cell.getContext()}
                />
              </TableCell>
            ))}
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
