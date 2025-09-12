import {
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Notification,
} from '@/ui'
import { prop } from '@fe/prop-types'
import type { ChartPublicApi, ExtendedSeries } from '@ozon-o11y-ui/charts'
import type { Cell, Column, ColumnDef } from '@tanstack/table-core'
import { computed, defineComponent, ref, toRefs, watch } from 'vue'
import { debounce } from 'lodash'

import styles from './chart.module.css'

import type { AggregationTSData } from '@/normalizers/aggregations'
import type { LinearChartType } from '@/constants/aggregation'
import { copyToClipboard } from '@/helpers/clipboard'
import { formatNumber } from '@/helpers/format-number'
import { getDatasetStatistic } from '@/helpers/get-dataset-statistic'
import { Copy, Funnel, Minus } from 'lucide-vue-next'
import { useDataGrid } from '@/components/data-grid'

type DataItem = AggregationTSData[0]
type ColumnDataItem = ColumnDef<DataItem>

const props = {
  field: prop<string>().required(),
  data: prop<AggregationTSData>().required(),
  chartApi: prop<ChartPublicApi>().required(),
  type: prop<LinearChartType>().optional('default'),
}

const allSeriesIndexes = (series: ExtendedSeries[]) => {
  return new Set(series.map((_, index) => index))
}

export const AggregationLinearChartLegend = defineComponent({
  name: 'AggregationLinearChartLegend',
  props,
  setup(props) {
    const { data, type } = toRefs(props)

    const DataGrid = useDataGrid<DataItem>()

    const { chartSeries, selectSeries, setAllSeriesVisible } = props.chartApi

    const selectedSeries = ref(allSeriesIndexes(chartSeries.value))

    const allSelected = computed(() => selectedSeries.value.size === props.data.length)

    const fieldValues = computed(() => data.value.map((item) => item.name))

    const stats = computed(() => {
      const entries: [
        string,
        { min: number; median: number; max: number },
      ][] = props.data.map((item) => [
        item.name,
        getDatasetStatistic(item.result),
      ])

      return Object.fromEntries(entries)
    })

    const renderStatCell = (cell: Cell<DataItem, unknown>) => {
      return formatNumber(cell.getValue() as number)
    }

    const columns = computed<ColumnDataItem[]>(() => {
      const checkbox: ColumnDataItem = {
        id: 'checkbox',
        header: () => (
          <Checkbox
            class={styles.legendCheckbox}
            value={allSelected.value ? true : selectedSeries.value.size > 0 ? 'indeterminate' : false}
            whenChange={toggleAllSeries}
          />
        ),
        size: 40,
        enableSorting: false,
        enableResizing: false,
        cell: ({ row: { index } }) => (
          <Checkbox
            class={styles.legendCheckbox}
            value={selectedSeries.value.has(index)}
            whenChange={(value) => toggleSeries(index, value === true)}
          />
        ),
      }

      const color: ColumnDataItem = {
        id: 'color',
        header: '',
        accessorFn: (_, index) => chartSeries.value[index]?.stroke,
        size: 40,
        enableSorting: false,
        enableResizing: false,
        cell: ({ cell }) => (
          <div class={styles.legendColor}>
            <Minus style={{ color: cell.getValue() as string }}/>
          </div>
        ),
      }

      const label: ColumnDataItem = {
        id: 'label',
        enableColumnFilter: true,
        header: () => (
          <>
            <span class="pr-[4px]">{props.field}</span>
            <Copy
              class="cursor-pointer"
              size={16}
              onClick={whenCopyFields}
            />
          </>
        ),
        accessorFn: (item) => item.name,
        filter: (column: Column<DataItem>) => (
          <DropdownMenu>
            <DropdownMenuTrigger class="cursor-pointer">
              <Funnel size={16} class={column.getIsFiltered() ? styles.active : null}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='start'
              class={styles.legendFilter}
            >
              <Input
                autofocus
                value={(column.getFilterValue() ?? '') as string}
                whenChange={debounce(column.setFilterValue, 200)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        filterFn: (row, columnId, filterValue: string) => {
          const cellValue = (row.getValue(columnId) as string).toLocaleLowerCase()
          return cellValue.includes(filterValue.toLocaleLowerCase())
        },
        cell: ({ cell }) => cell.getValue(),
      }

      const min: ColumnDataItem = {
        id: 'min',
        header: 'min',
        accessorFn: (item) => stats.value[item.name].min,
        size: 120,
        cell: ({ cell }) => renderStatCell(cell),
      }

      const median: ColumnDataItem = {
        id: 'median',
        header: 'median',
        accessorFn: (item) => stats.value[item.name].median,
        size: 120,
        cell: ({ cell }) => renderStatCell(cell),
      }

      const max: ColumnDataItem = {
        id: 'max',
        header: 'max',
        accessorFn: (item) => stats.value[item.name].max,
        size: 120,
        cell: ({ cell }) => renderStatCell(cell),
      }

      const actions: ColumnDataItem = {
        id: 'actions',
        header: () => '',
        size: 40,
        enableResizing: false,
        cell: ({ row: { index } }) => (
          <Copy
            class={styles.copyButton}
            size={16}
            onClick={whenCopyRow(index)}
          />
        ),
      }

      return [
        checkbox,
        color,
        label,
        min,
        median,
        max,
        actions
      ]
    })

    const initialState = computed(() => {
      return {
        columnPinning: {
          right: ['min', 'median', 'max', 'actions'],
        }
      }
    })

    const redrawChart = () => {
      setAllSeriesVisible(false)
      selectedSeries.value.forEach((seriesIndex) => {
        selectSeries(seriesIndex)
      })
    }

    const toggleAllSeries = () => {
      const indexes = allSelected.value ? [] : allSeriesIndexes(chartSeries.value)
      selectedSeries.value = new Set(indexes)

      redrawChart()
    }

    const toggleSeries = (index: number, value: boolean) => {
      if (value) {
        selectedSeries.value.add(index)
      } else {
        selectedSeries.value.delete(index)
      }

      redrawChart()
    }

    const whenCopyRow = (index: number) => () => {
      const item = props.data[index]

      copyToClipboard(JSON.stringify({
        [props.field]: item.name,
        ...stats.value[item.name],
      }))

      Notification.success({
        renderContent: 'Copied successfully',
      })
    }

    const whenCopyFields = (event: MouseEvent) => {
    	event.stopPropagation()
    	copyToClipboard(JSON.stringify(fieldValues.value))
    	Notification.success({
    		renderContent: 'Column values copied to clipboard',
    	})
    }

    watch(data, (next, prev) => {
      if (prev.length === next.length) {
        redrawChart()
      } else {
        selectedSeries.value = new Set(allSeriesIndexes(chartSeries.value))
      }
    })

    watch([type, chartSeries], () => {
      selectedSeries.value = new Set(allSeriesIndexes(chartSeries.value))
    })

    return () => (
      <div class={styles.linearLegend}>
        <DataGrid
          key={chartSeries.value.length}
          class={styles.linearLegendTable}
          columns={columns.value}
          data={data.value}
          initialState={initialState.value}
        />
      </div>
    )
  },
})
