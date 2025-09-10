import { prop } from "@/lib/prop";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-vue-next";
import { defineComponent, type VNode } from "vue";

const props = {
  renderTitle: prop<() => VNode>().optional(),
  whenEdit: prop<() => void>().optional(),
  whenDelete: prop<() => void>().optional(),
  whenExport: prop<() => void>().optional(),
}

export const Widget = defineComponent({
  name: 'BaseWidget',
  props,
  setup(props, { slots }) {
    const renderActionsMenu = () => {
      const hasActions = props.whenDelete || props.whenEdit

      if (!hasActions) {
        return
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost">
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {props.whenEdit && (
              <DropdownMenuItem whenClick={props.whenEdit}>
                <Pencil size={16} /> Edit
              </DropdownMenuItem>
            )}
            {props.whenDelete && (
              <DropdownMenuItem whenClick={props.whenDelete}>
                <Trash2 size={16} /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return () => (
      <div class="p-4 rounded-xl border bg-card text-card-foreground shadow w-full h-[350px] flex flex-col gap-[12px]">
        <div class="flex justify-between gap-[12px]">
          {props.renderTitle?.() ?? <div />}
          <div>
            {renderActionsMenu()}
          </div>
        </div>
        {slots.default?.()}
      </div>
    )
  }
})
