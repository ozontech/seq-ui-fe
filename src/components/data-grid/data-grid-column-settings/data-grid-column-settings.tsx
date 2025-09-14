import { prop } from "@fe/prop-types";
import { Checkbox, Label, Popover, PopoverContent } from "@/ui";
import { Input } from "@/ui/input";
import type { HeaderContext, RowData } from "@tanstack/vue-table";
import { Settings } from "lucide-vue-next";
import { PopoverTrigger } from "reka-ui";
import { computed, defineComponent, ref } from "vue";

export const useDataGridColumnSettings = <T extends RowData>() => {
  const DataGridColumnSettings = defineComponent({
    name: 'DataGridColumnSettings',
    props: {
      headerContext: prop<HeaderContext<T, unknown>>().required(),
    },
    setup(props) {
      const search = ref('')

      const columns = computed(() => {
        return props.headerContext.table.getAllColumns()
          .filter(column => column.getCanHide() && !['timestamp', 'message', 'actions'].includes(column.id))
          .filter(column => column.id.includes(search.value))
      })

      const whenSearchChange = (value: string, event: Event) => {
        event.preventDefault()
        event.stopPropagation()
        search.value = value
      }

      return () => (
        <Popover>
          <PopoverTrigger class="w-full flex justify-center align-middle cursor-pointer">
            <Settings size={18} />
          </PopoverTrigger>
          <PopoverContent>
            <Input
              class="mb-2"
              value={search.value}
              placeholder={'Field search'}
              whenChange={whenSearchChange}
            />
            <div class="max-h-[400px] overflow-auto flex flex-col gap-[8px]">
              {columns.value.map(column => (
                <div
                  class="flex gap-[4px] px-[0px] py-[4px] cursor-pointer"
                  onClick={() => column.toggleVisibility()}
                >
                  <Checkbox
                    id={`column-${column.id}`}
                    value={column.getIsVisible()}
                  />
                  <Label for={`column-${column.id}`}>
                    {column.id}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
  })

  return DataGridColumnSettings
}
