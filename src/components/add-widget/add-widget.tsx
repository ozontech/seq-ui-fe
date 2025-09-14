import { computed, defineComponent, ref } from "vue";
import { prop } from "@fe/prop-types";
import { Plus } from "lucide-vue-next";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/ui";
import type { SeqapiV1AggregationFuncDto } from "~/api/generated/seq-ui-server";
import type { AggregationsState } from "~/composables/aggregations";
import type { HistogramState } from "~/composables/use-histogram";

import { AggregationDrawer } from "../aggregation-drawer";

const props = {
  histogram: prop<HistogramState>().required(),
  aggregations: prop<AggregationsState>().required(),
  fields: prop<string[]>().required(),
  functions: prop<SeqapiV1AggregationFuncDto[]>().required(),
}

// TODO: fix "Blocked aria-hidden on an element because its descendant retained focus"
// reason: opening drawer while dropdown-menu is focused
export const AddWidget = defineComponent({
  name: 'AddWidget',
  props,
  setup(props) {
    const openAggregation = ref(false)

    const selectedAggregation = computed(() => {
      return props.aggregations.aggregations.value.find((_, index) => {
        return index === props.aggregations.aggregationEditIndex.value
      })
    })

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
            <DropdownMenuItem
              whenClick={props.histogram.addHistogram}
            >
              Histogram
            </DropdownMenuItem>
            <DropdownMenuItem
              whenClick={() => whenOpenAggregationChange(true)}
            >
              Aggregation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AggregationDrawer
          index={props.aggregations.aggregationEditIndex.value}
          open={openAggregation.value}
          fields={props.fields}
          functions={props.functions}
          aggregation={selectedAggregation.value}
          whenOpenChange={whenOpenAggregationChange}
          whenSave={props.aggregations.pushAggregation}
        />
      </>
    )
  }
})
