import { defineComponent, ref } from "vue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { FlexRender, getCoreRowModel, getExpandedRowModel, useVueTable, type ColumnDef, type ExpandedState } from "@tanstack/vue-table";
import type { Log } from "@/types/log";
import { prop } from "@/lib/prop";
import { valueUpdater } from "../ui/table/utils";

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
        cell: ({ row }) => {
          const message = row.getValue('message')

          return (
            <div class='text-left font-medium'>
              {message}
            </div>
          )
        },
      }
    ]

    const expanded = ref<ExpandedState>({})

    const table = useVueTable({
      get data() { return props.data },
      get columns() { return columns },
      getExpandedRowModel: getExpandedRowModel(),
      getCoreRowModel: getCoreRowModel(),
      onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
      state: {
        get expanded() { return expanded.value },
      }
    })

    const renderHeader = () => (
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  <FlexRender
                    render={header.column.columnDef.header}
                    //v-if="!header.isPlaceholder"
                    props={header.getContext()}
                  />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
    )

    const renderBody = () => (
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                whenClick={() => row.toggleExpanded()}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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
          ))
        ) : (
          <TableRow>
            <TableCell
              colspan={columns.length}
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    )

    return () => (
      <Table>
        {renderHeader()}
        {renderBody()}
      </Table>
    )
  }
})
