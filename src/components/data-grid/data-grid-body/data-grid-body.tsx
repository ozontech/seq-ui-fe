import { prop } from "@/lib/prop";
import { TableBody, TableCell, TableRow } from "@/ui/table";
import { FlexRender } from "@tanstack/vue-table";
import type { Row, RowData, Table } from "@tanstack/vue-table";
import { defineComponent } from "vue";

export const useDataGridBody = <T extends RowData>() => {
  const DataGridBody = defineComponent({
    name: 'DataGridBody',
    props: {
      tableApi: prop<Table<T>>().required(),
    },
    setup(props) {
      const renderEmpty = () => (
        <TableRow>
          <TableCell
            colspan={props.tableApi.getAllColumns().length}
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
          {row.getIsExpanded() && (
            <TableRow>
              <TableCell colspan={row.getAllCells().length}>
                {JSON.stringify(row.original)}
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
        </TableBody>
      )
    }
  })

  return DataGridBody
}
