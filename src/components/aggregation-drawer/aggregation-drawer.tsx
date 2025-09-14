import { prop } from "@fe/prop-types";
import type { Aggregation, SaveAggregationBody } from "~/types/aggregations";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/ui";
import { computed, defineComponent, ref, watch } from "vue";
import type { AggregationForm } from "./types";
import {
  getAggregationForm,
  getAggregation,
  isEqualAggregations,
  validateAggregationForm,
} from "./helpers";
import type { SeqapiV1AggregationFuncDto } from "~/api/generated/seq-ui-server";
import { AggregationDrawerContent } from "./aggregation-drawer-content";

const props = {
  index: prop<number>().required(),
  open: prop<boolean>().required(),
  fields: prop<string[]>().required(),
  functions: prop<SeqapiV1AggregationFuncDto[]>().required(),
  aggregation: prop<Aggregation>().optional(),
  isQueryChangeable: prop<boolean>().optional(false),
  isEditing: prop<boolean>().optional(),
  whenOpenChange: prop<(value: boolean) => void>().required(),
  whenSave: prop<(args: SaveAggregationBody) => void>().required(),
}

export const AggregationDrawer = defineComponent({
  name: 'AggregationDrawer',
  props,
  setup(props) {
    const form = ref<AggregationForm>(getAggregationForm(props.aggregation))
    const submitted = ref(false)

    const errors = computed(() => validateAggregationForm(form.value))
    const invalid = computed(() => {
      return submitted.value && Object.values(errors.value).some(Boolean)
    })

    watch(() => props.open, (isOpen) => {
      if (!isOpen) {
        submitted.value = false
        form.value = getAggregationForm()
      }
    })

    watch(() => props.aggregation, (curr, prev) => {
      if (isEqualAggregations(curr, prev)) {
        return
      }

      submitted.value = false
      form.value = getAggregationForm(curr)
    })

    const whenChangeForm = (state: AggregationForm) => {
      form.value = state
    }

    const whenSubmit = () => {
      submitted.value = true
      if (invalid.value) {
        return
      }

      props.whenSave(getAggregation(form.value, props.index))
      props.whenOpenChange(false)
    }

    const renderHeader = () => (
      <DrawerHeader>
        <DrawerTitle>{props.isEditing ? 'Edit' : 'Create'} aggregation</DrawerTitle>
        <DrawerDescription>{props.isEditing ? 'Edit' : 'Fill'} necessary fields for aggregation entity.</DrawerDescription>
      </DrawerHeader>
    )

    const renderContent = () => (
      <div class="px-4">
        <AggregationDrawerContent
          form={form.value}
          errors={invalid.value ? errors.value : {}}
          functions={props.functions}
          fields={props.fields}
          isQueryChangeable={props.isQueryChangeable}
          whenChange={whenChangeForm}
          whenSubmit={whenSubmit}
        />
      </div>
    )

    const renderFooter = () => (
      <DrawerFooter class="flex-row">
        <Button
          whenClick={whenSubmit}
        >
          {props.isEditing ? 'Save' : 'Create'}
        </Button>
        <Button
          variant={'secondary'}
          whenClick={() => props.whenOpenChange(false)}
        >
          Cancel
        </Button>
      </DrawerFooter>
    )

    return () => (
      <Drawer
        direction={'top'}
        open={props.open}
        whenOpenChange={props.whenOpenChange}
      >
        <DrawerContent class="w-[650px] mx-[auto]">
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </DrawerContent>
      </Drawer>
    )
  },
})
