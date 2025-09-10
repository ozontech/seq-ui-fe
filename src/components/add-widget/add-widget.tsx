import { prop } from "@/lib/prop";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui";
import { Plus } from "lucide-vue-next";
import { defineComponent, ref } from "vue";
import { AggregationDrawer } from "../aggregation-drawer";
import type { SeqapiV1AggregationFuncDto } from "@/api/generated/seq-ui-server";

const props = {
  fields: prop<string[]>().required(),
  functions: prop<SeqapiV1AggregationFuncDto[]>().required(),
  whenHistogramClick: prop<() => void>().optional(),
}

// TODO: fix "Blocked aria-hidden on an element because its descendant retained focus"
// reason: opening drawer while dropdown-menu is focused
export const AddWidget = defineComponent({
  name: 'AddWidget',
  props,
  setup(props) {
    const openAggregation = ref(false)

    const whenOpenAggregationChange = (value: boolean) => {
      openAggregation.value = value
    }

    return () => (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
            >
              <Plus size={16} /> Add widget
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {props.whenHistogramClick && (
              <DropdownMenuItem
                whenClick={props.whenHistogramClick}
              >
                Histogram
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              whenClick={() => whenOpenAggregationChange(true)}
            >
              Aggregation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AggregationDrawer
          index={-1}
          fields={props.fields}
          functions={props.functions}
          open={openAggregation.value}
          whenOpenChange={whenOpenAggregationChange}
          whenSave={() => { console.log('save') }}
        />
      </>
    )
  }
})
