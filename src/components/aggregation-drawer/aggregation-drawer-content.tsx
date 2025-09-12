import { prop } from "@fe/prop-types";
import { computed, defineComponent, type VNode } from "vue";
import { cn } from "@/lib/utils"

import type { AggregationForm, AggregationFormErrors } from './types'
import type { AggregationShowType } from "@/types/aggregations";
import { SeqapiV1AggregationFuncDto } from "@/api/generated/seq-ui-server";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/ui";
import { AGGREGATION_TYPES } from "@/constants/aggregation";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { validateQuantile } from "./helpers";

const props = {
  form: prop<AggregationForm>().required(),
  errors: prop<AggregationFormErrors>().required(),
  functions: prop<string[]>().required(),
  fields: prop<string[]>().required(),
  isQueryChangeable: prop<boolean>().optional(false),
  whenChange: prop<(form: AggregationForm) => void>().required(),
  whenSubmit: prop<() => void>().required(),
}

// TODO: use value from /limits
const QUANTILIES_LIMIT = 3

// TODO: solve focus warning in combobox and select
export const AggregationDrawerContent = defineComponent({
  name: 'AggregationDrawerContent',
  props,
  setup(props) {
    const whenChange = <Key extends keyof AggregationForm>(field: Key) =>
      (value: AggregationForm[Key]) => {
        props.whenChange({ ...props.form, [field]: value })
      }

    const whenChangeType = (value: string) => {
      const isUnique = props.form.fn === SeqapiV1AggregationFuncDto.AfUnique
      const updatedFn = value === 'linear-chart' && isUnique ? undefined : props.form.fn

      props.whenChange({
        ...props.form,
        fn: updatedFn,
        type: value as AggregationShowType,
      })
    }

    const renderTypeTabs = () => (
      <Tabs value={props.form.type} whenChange={whenChangeType}>
        <TabsList>
          {AGGREGATION_TYPES.map(({ id, Icon, name }) => (
            <TabsTrigger key={id} value={id}>
              <Icon size={16} /> {name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )

    const renderSelector = (
      fieldName: keyof AggregationForm,
      placeholder: string,
      options: string[]
    ) => (
      <Combobox
        openOnClick
        value={props.form[fieldName] as string}
        onChange={(value) => whenChange(fieldName)(value as string)}
      >
        <ComboboxAnchor class="w-full">
          <ComboboxInput
            class={cn(props.errors[fieldName] && 'text-destructive placeholder:text-destructive')}
            placeholder={placeholder}
          />
          <ComboboxTrigger class="absolute end-0 inset-y-0 flex items-center justify-center px-3">
            <ChevronsUpDown class="size-4 text-muted-foreground" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxList class="w-[var(--reka-popper-anchor-width)]">
          <ComboboxEmpty>
            No items found.
          </ComboboxEmpty>
          <ComboboxGroup>
            {options.map(item => (
              <ComboboxItem key={item} value={item}>
                {item}
                <ComboboxItemIndicator>
                  <Check class="ml-auto size-4" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </Combobox >
    )

    const functionInput = computed(() => (
      <Select
        value={props.form.fn}
        whenValueChange={(value) => whenChange('fn')(value as SeqapiV1AggregationFuncDto)}
      >
        <SelectTrigger class="w-full">
          <SelectValue
            class={cn(props.errors.fn && 'text-destructive placeholder:text-destructive')}
            placeholder={'count'}
          >{props.form.fn}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {props.functions.map(fn => (
            <SelectItem key={fn} value={fn}>
              {fn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ))

    const fieldInput = computed(() => {
      return renderSelector('field', 'service', props.fields)
    })

    const visibleGroupBy = computed(() => {
      const isCount = props.form.fn === SeqapiV1AggregationFuncDto.AfCount

      return !!props.form.fn && !isCount
    })

    const groupByInput = computed(() => {
      return renderSelector('groupBy', 'service', props.fields)
    })

    const visibleQuantilies = computed(() => {
      const isQuantile = props.form.fn === SeqapiV1AggregationFuncDto.AfQuantile

      return isQuantile
    })

    const quantiliesInput = computed(() => (
      <TagsInput
        max={QUANTILIES_LIMIT}
        value={props.form.quantiles}
        onChange={(value) => whenChange('quantiles')(value as string[])}
      >
        {props.form.quantiles.map((item, index) => (
          <TagsInputItem
            key={`${item}-${index}`}
            value={item}
            class={cn(props.errors.quantiles && validateQuantile(item) && 'text-destructive')}
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
        ))}
        <TagsInputInput
          class={cn(
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            props.errors.quantiles && props.form.quantiles.length === 0 && 'text-destructive placeholder:text-destructive'
          )}
          type="number"
          placeholder="0.01"
        />
      </TagsInput >
    ))

    const renderField = (label: string, input: VNode | null, caption?: string) => (
      <div class="flex flex-col gap-[4px]">
        <Label>{label}</Label>
        {input}
        {caption && <span class="text-sm text-muted-foreground">{caption}</span>}
      </div>
    )

    return () => (
      <div class="flex flex-col gap-[16px]">
        {renderTypeTabs()}
        <div class="flex flex-col gap-[8px]">
          {renderField('Function', functionInput.value)}
          {renderField('Field', fieldInput.value)}
          {visibleGroupBy.value && renderField('Group by', groupByInput.value)}
          {visibleQuantilies.value && renderField('Quantilies', quantiliesInput.value, 'Input number from 0.01 to 0.99')}
        </div>
      </div>
    )
  }
})
