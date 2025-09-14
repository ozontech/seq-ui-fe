import { defineComponent, computed } from 'vue'
import { prop } from '@fe/prop-types'

import { AggregationItem } from './aggregation'
import styles from './list.module.css'

import type { Aggregation, PickedAggregationKeys, SaveAggregationBody } from '~/types/aggregations'
import type { EditToQueryOptions, Option } from '~/types/input'
import { omit } from 'ramda'
import type { Duration } from '~/types/duration'

export const AggregationList = defineComponent({
  name: 'AggregationList',
  props: {
    aggregations: prop<Pick<Aggregation, PickedAggregationKeys>[]>().required(),
    data: prop<(Aggregation['data'] | null)[]>().required(),
    disable: prop<boolean>().optional(false),
    intervalParams: prop<{ from: Duration; to: Duration }>().optional(),
    firstSearch: prop<boolean>().optional(),
    field: prop<string>().optional(),
    fn: prop<string>().optional(),
    options: prop<Option[]>().required(),
    fnOptions: prop<Option[]>().required(),
    error: prop<Record<number, string | undefined> | null>().optional(),
    whenSetAggregationEditIndex: prop<(index: number) => void>().required(),
    whenEditQuery: prop<(arg: EditToQueryOptions) => void>().optional(),
    whenChangeOrder: prop<(aggs: Aggregation[]) => void>().required(),
    whenUpdate: prop<(args: (Aggregation) & { index: number }) => void>().required(),
    whenSave: prop<(args: SaveAggregationBody) => void>().required(),
    whenDelete: prop<(index: number) => void>().required(),
  },
  setup(props) {
    const aggregations = computed({
      get: () => props.aggregations.reduce<Aggregation[]>((acc, item, idx) => {
        const newItem: Aggregation = {
          ...item,
          // todo: переделать. это поле тут исключительно для работы whenChangeOrder
          data: props.data[idx],
        }

        acc.push(newItem)
        return acc
      }, []),
      set: async (aggs) => {
        props.whenChangeOrder(aggs)
      },
    })

    const setEditIndex = (index: number) => {
      props.whenSetAggregationEditIndex(index)
    }

    const getKey = (aggregation: Aggregation) => {
      return JSON.stringify(omit(['data', 'updatedAt'], aggregation))
    }

    return () => !aggregations.value.length ? null : (
      <div class={styles.container}>
        {
          aggregations.value.map((aggregation, index) => (
            <AggregationItem
              error={props.error?.[index] || null}
              total={aggregation.total}
              key={getKey(aggregation)}
              data={props.data[index]}
              index={index}
              intervalParams={props.intervalParams}
              fn={aggregation.fn}
              field={aggregation.field}
              groupBy={aggregation.groupBy}
              quantiles={aggregation.quantiles}
              firstSearch={props.firstSearch}
              options={props.options}
              fnOptions={props.fnOptions}
              query={aggregation.query}
              from={aggregation.from}
              to={aggregation.to}
              updatedAt={aggregation.updatedAt}
              showType={aggregation.showType}
              whenEditQuery={props.whenEditQuery}
              whenEdit={() => setEditIndex(index)}
              whenUpdate={props.whenUpdate}
              whenSave={props.whenSave}
              whenDelete={() => props.whenDelete(index)}
            />
          ))
        }
      </div>
    )
  },
})
