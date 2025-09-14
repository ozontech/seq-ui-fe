import { ref, computed, defineComponent } from 'vue'
import { prop } from '@fe/prop-types'
import { Skeleton } from '~/ui'

import styles from './aggregation.module.css'
import { AggregationTable } from './table'

import { Widget } from '~/components/widget'
import type { AggregationData, AggregationTSData } from '~/normalizers/aggregations'
import type { EditToQueryOptions, Option } from '~/types/input'
import { SeqapiV1AggregationFuncDto } from '~/api/generated/seq-ui-server'
import type { Aggregation, SaveAggregationBody } from '~/types/aggregations'
import { Messages } from '~/components/shared/messages'
import { formatNumber } from '~/helpers/format-number'
import { Loader, Info } from 'lucide-vue-next'
import { AggregationPieChart } from '~/components/aggregations/pie-chart'
import { isTimeseriesAggregation } from '~/helpers/aggregations'
import { AggregationLinearChart } from '~/components/aggregations/linear-chart'
import type { LinearChartType } from '~/constants/aggregation'
import type { Duration } from '~/types/duration'

const DATA_LIMIT = 1000

export const AggregationItem = defineComponent({
  name: 'AggregationItem',
  props: {
    data: prop<AggregationData | AggregationTSData | null>().optional(),
    intervalParams: prop<{ from: Duration; to: Duration }>().optional(),
    total: prop<number>().optional(),
    firstSearch: prop<boolean>().optional(),
    error: prop<string | null>().optional(),
    field: prop<string>().optional(''),
    fn: prop<SeqapiV1AggregationFuncDto>().optional(SeqapiV1AggregationFuncDto.AfCount),
    groupBy: prop<string>().optional(''),
    quantiles: prop<number[]>().optional([]),
    index: prop<number>().required(),
    options: prop<Option[]>().required(),
    fnOptions: prop<Option[]>().required(),
    query: prop<Aggregation['query']>().optional(''),
    from: prop<Aggregation['from']>().optional({}),
    to: prop<Aggregation['to']>().optional({}),
    updatedAt: prop<Date>().optional(),
    showType: prop<Aggregation['showType']>().optional('table'),
    whenEdit: prop<() => void>().optional(),
    whenEditQuery: prop<(arg: EditToQueryOptions) => void>().optional(),
    whenUpdate: prop<(args: Aggregation & { index: number }) => void>().optional(),
    whenSave: prop<(args: SaveAggregationBody) => void>().optional(),
    whenDelete: prop<() => void>().optional(),
    whenIntervalChange: prop<(params: { from: Date; to: Date }) => void>().optional(),
  },
  setup(props) {
    const chartType = ref<LinearChartType>('default')

		const isLimited = ref(true)

    const selectedGroupBy = ref(props.groupBy)

    const tableHeaderFields = ref({
      groupBy: props.groupBy,
      field: props.field,
      fn: props.fn,
      quantiles: props.quantiles,
    })

    const name = computed(() => {
      return `${props.fn} (${props.field})`
    })

    const isLoading = computed(() => {
      return !props.firstSearch && props.data === undefined && !props.error
    })

		const limitedData = computed(() => {
			if (isLimited.value && props.showType === 'linear-chart') {
				return props.data?.slice(0, DATA_LIMIT)
			}

			return props.data
		})

    const renderCount = () => (
      <span class={styles.total}>
        { isLoading.value ? <Skeleton class="width-[40px]"/> : props.data && formatNumber(props.data.length) }
      </span>
    )


		const renderLimit = () => {
			const visible = isLimited.value && props.data && props.data.length > DATA_LIMIT

			if (props.showType !== 'linear-chart' || !visible) {
				return
			}

      return (
        <div class="self-center">
          <Info size={16}/>
        </div>
      )
			// return (
			// 	<Tooltip
			// 		class={styles.warningTooltip}
			// 		hasPaddingTop
			// 		options={{
			// 			placement: 'top-start',
			// 			interactive: true,
			// 		}}
			// 		size={400}
			// 		content={(
			// 			<>
			// 				<TextView variant={'paragraph-medium'}>
			// 					Выведено <strong>{ DATA_LIMIT }</strong>/{ props.data.length } серий
			// 					по соображениям производительности. Пожалуйста, сузьте запрос,
			// 					чтобы он возвращал меньше серий.
			// 				</TextView>
			// 				<Button
			// 					size={'sm'}
			// 					variant={'secondary'}
			// 					whenClick={() => isLimited.value = false}
			// 				>Показать все
			// 				</Button>
			// 			</>
			// 		)}
			// 		target={<Icon class={styles.warningIcon} source={ic_m_exclamation_filled} />}
			// 	/>
			// )
		}

    const renderTitle = () => {
      return (
        <div class={styles.flexContainer}>
          <span class={styles.name}>{name.value}</span>
          { renderCount() }
          { renderLimit() }
        </div>
      )
    }

    const renderError = () => (
      <div class={styles.errorMessageContainer}>
        <p class={styles.error}>An error occurred while fetching data</p>
        <p class={styles.error}>Delete or edit the aggregation if the issue is with it</p>
        <p class={styles.error}>{props.error}</p>
      </div>
    )

    const renderLoader = () => {
      return (
        <div class={styles.loader}>
          <Loader class={styles.spinner}/> Loading...
        </div>
      )
    }

    const renderEmpty = () => {
      return (
        <Messages.Empty
          firstSearch={props.firstSearch}
        />
      )
    }

    const renderTable = () => {
      if (isTimeseriesAggregation(limitedData.value)) {
        return 'Invalid data'
      }

      return (
        <AggregationTable
          isLoading={isLoading.value}
          total={props.total}
          data={limitedData.value}
          fn={props.fn}
          field={props.field}
          groupBy={selectedGroupBy.value}
          quantiles={tableHeaderFields.value.quantiles.map((quantile) => String(quantile))}
          from={props.from}
          to={props.to}
          updatedAt={props.updatedAt}
          whenEditQuery={props.whenEditQuery}
        />
      )
    }

    const renderLinearChart = () => {
      if (!isTimeseriesAggregation(limitedData.value)) {
        return 'Invalid data'
      }

      return (
        <AggregationLinearChart
					from={props.intervalParams?.from ?? props.from}
					to={props.intervalParams?.to ?? props.to}
					type={chartType.value}
					field={props.groupBy || props.field}
					data={limitedData.value}
					whenZoom={props.whenIntervalChange}
				/>
      )
    }

    const renderChart = () => {
      if (isTimeseriesAggregation(limitedData.value)) {
        return 'Invalid data'
      }

      return (
        <AggregationPieChart
          data={limitedData.value}
          total={props.total}
        />
      )
    }

    const renderContent = () => {
      if (isLoading.value) {
        return renderLoader()
      }

      if (props.error) {
        return renderError()
      }

      if (props.data?.length === 0) {
        return renderEmpty()
      }

      if (props.showType === 'table') {
        return renderTable()
      }

      if (props.showType === 'linear-chart') {
        return renderLinearChart()
      }

      return renderChart()
    }

    return () => props.field ? (
      <Widget
        renderTitle={renderTitle}
        whenDelete={props.whenDelete}
      >
        <div class={styles[props.showType]}>
          { renderContent() }
        </div>
      </Widget>
    ) : null
  },
})
