import { defineComponent, computed, ref } from 'vue'
import { useTheme } from '@/ui'
import { storeToRefs } from 'pinia'

import styles from './index.module.css'

// import { Controls } from '~/components/v2/search'
// import { FavoriteSearchList } from '~/components/favorite-search/favorite-search-list'
// import { Table } from '~/components/v2/table'
// import { Widget } from '~/components/widget'
// import { HistogramChart } from '~/components/histogram'
// import { Messages } from '~/components/shared'
// import { ExportDrawer } from '~/components/export'
// import { AggregationList } from '~/components/aggregation'
import { getClosestPrettyTime } from '@/helpers/closest-pretty-time'
import { secondsToSingleUnitDuration, durationToSeconds } from '@/helpers/duration'
// import { ADD_AGGREGATION, SAVED_REQUESTS } from '@/playwright/locators/table.locators'
import { useDashboardsStore } from '@/stores/dashboards'
import { useProfileStore } from '@/stores/profile'
import { useDownloadStore } from '@/stores/save-file'
import { useTimezoneStore } from '@/stores/timezone'
import { useTokensStore } from '@/stores/tokens'
import type { FavoriteQuery } from '@/types/profile'
import type { EditToQueryOptions } from '@/types/input'
import type { Duration } from '@/types/duration'
import { generateTableData } from '@/helpers/generate-data'
import { LogTable } from '@/components/log-table'
import { LogControls } from '@/components/log-controls'

export const MessagesLayout = defineComponent({
  name: 'MessagesLayout',
  setup() {
    // const controlButtons = [{
    // 	label: 'Добавить агрегацию',
    // 	icon: <Icon source={ic_s_plus_sign_filled} data-testid={ADD_AGGREGATION}/>,
    // 	whenClick: () => block.aggregations.createAggregation(),
    // }, {
    // 	label: 'Сохраненные запросы',
    // 	icon: <Icon source={ic_s_star_filled} data-testid={SAVED_REQUESTS}/>,
    // 	whenClick: () => isFavoriteOpened.value = true,
    // }]

    const download = useDownloadStore()
    const timezoneStore = useTimezoneStore()
    const dashboardStore = useDashboardsStore()
    const timezone = computed(() => ({
      tz: timezoneStore.timezone.timezone,
      name: timezoneStore.timezone.name,
    }))

    const keywordOptions = computed(() => {
      return keywords.value.map(({ name }) => name || '')
    })

    // const renderExportDrawer = () => (
    // 	<ExportDrawer
    // 		blockIndex={block.id}
    // 		options={keywordOptions.value}
    // 		selectedColumns={block.messages.selectedColumns}
    // 		whenDownload={download.downloadFile}
    // 		timezone={timezone.value}
    // 		max={dashboardStore.exportLimit}
    // 	/>
    // )

    const options = computed(() => {
      return keywords.value.map(({ name = '' }) => ({
        value: name,
        label: name,
      }))
    })

    const fnOptions = computed(() => {
      return block.aggregations.aggregationFns.map((fn) => ({
        value: fn,
        label: fn,
      }))
    })

    const aggregationsRef = ref<HTMLDivElement>()

    const editToQuery = (data: EditToQueryOptions) => {
      block.queryParams.editQuery(data)
      block.saveToUrl({
        q: block.queryParams.query,
      })
    }

    // const renderAggregation = () => {
    // 	if (block.messages.groups.isGroupView) {
    // 		return
    // 	}
    // 	return (
    // 		<AggregationList
    // 			whenEditQuery={editToQuery}
    // 			fullscreenable={false}
    // 			class={{ [styles.aggregationsHidden]: block.aggregations.filteredAggregations.length === 0 }}
    // 			error={block.aggregations.error}
    // 			aggregations={block.aggregations.aggregations}
    // 			data={block.aggregations.aggregationsData}
    // 			containerRef={aggregationsRef}
    // 			options={options.value}
    // 			firstSearch={block.messages.firstSearch}
    // 			fnOptions={fnOptions.value}
    // 			aggregationEditIndex={block.aggregations.aggregationEditIndex}
    // 			whenSetAggregationEditIndex={block.aggregations.setAggregationEditIndex}
    // 			whenChangeOrder={block.aggregations.changeOrder}
    // 			whenUpdate={block.aggregations.updateAggregation}
    // 			whenSave={block.aggregations.saveAggregation}
    // 			whenDelete={block.aggregations.deleteAggregation}
    // 		/>
    // 	)
    // }

    // const renderControls = () => {
    // 	return (
    // 		<div class={styles.controls}>
    // 			{controlButtons.map(({ label, icon, whenClick }) => (
    // 				<Button
    // 					size={400}
    // 					variant="uncontained"
    // 					leftIcon={icon}
    // 					key={label}
    // 					whenClick={whenClick}
    // 				>
    // 					{label}
    // 				</Button>
    // 			))}
    // 			{renderFavoriteQueriesDrawer()}
    // 			{renderExportDrawer()}
    // 		</div>
    // 	)
    // }

    const tokens = useTokensStore()
    const { theme } = useTheme()
    const { keywords } = storeToRefs(tokens)
    const profileStore = useProfileStore()
    const {
      queries,
      isFetching: isFavoriteFetching,
    } = storeToRefs(profileStore)

    const store = useDashboardsStore()

    // todo: через getBlock выводятся неправильные типы и ломается реактивность
    const block = store.blocks.blocks.get(0)!
    const messages = computed(() => block.messages)
    const pagination = computed(() => messages.value.pagination)

    const handleSearch = (searchQuery?: string) => {
      const trimmed = (searchQuery || '').trim()

      // TODO: не запрашивать новые данные, если absolute даты не изменились
      if (searchQuery !== undefined &&
        trimmed === block.queryParams.query &&
        !messages.value.firstSearch &&
        !pagination.value.isPaginationMode
      ) {
        if (messages.value.groups.isGroupView) {
          messages.value.groups.fetchGroups()
        } else {
          block.fetch()
        }
      }
      block.queryParams.query = trimmed
      block.saveToUrl({
        q: trimmed,
        page: pagination.value.isPaginationMode ? '1' : undefined,
      })
    }

    const handleIntervalChange = (from?: Duration, to?: Duration) => {
      block.intervalParams.setInterval(from, to)
      block.saveToUrl(block.messages.intervalToQueryParams())
    }

    const isShowSaveFavoriteQuery = ref(false)
    const isFavoriteOpened = ref(false)

    const favoriteQueryExists = computed(() => {
      const query = {
        query: block.queryParams.query,
        relativeFrom: durationToSeconds(block.intervalParams.from),
      }
      return profileStore.queryExists(query)
    })

    const handleQuerySelect = (query: FavoriteQuery) => {
      if (query.relativeFrom) {
        handleIntervalChange(secondsToSingleUnitDuration(query.relativeFrom))
      }
      handleSearch(query.query)
    }

    // const renderFavoriteQueriesDrawer = () => (
    // 	<FavoriteSearchList
    // 		isShow={isFavoriteOpened.value}
    // 		isFetching={isFavoriteFetching.value}
    // 		queries={queries.value || []}
    // 		whenSelect={handleQuerySelect}
    // 		whenDelete={profileStore.deleteFavoriteQuery}
    // 		whenClose={() => isFavoriteOpened.value = false}
    // 	/>
    // )

    // const renderSearch = () => (
    // 	<Controls
    // 		class={styles.search}
    // 		id={0}
    // 		query={block.queryParams.query}
    // 		from={block.intervalParams.from}
    // 		to={block.intervalParams.to}
    // 		theme={theme.value}
    // 		keywords={keywords.value}
    // 		isTypeDisabled={
    // 			block.messages.groups.isGroupView ||
    // 			pagination.value.isPaginationMode
    // 		}
    // 		isHistogramVisible={block.messages.isHistogramVisible}
    // 		//isHistogramButtonDisabled={block.messages.groups.isGroupView || widgetInFullScreen.value.histogram}
    // 		isHistogramButtonDisabled={block.messages.groups.isGroupView}
    // 		isFavoriteFetching={isFavoriteFetching.value}
    // 		isFavoriteOpened={isShowSaveFavoriteQuery.value}
    // 		isFavoriteFilled={favoriteQueryExists.value}

    // 		// убрать в компонент favoritebutton ?
    // 		whenFavoriteOpen={() => isShowSaveFavoriteQuery.value = true}
    // 		whenFavoriteClose={() => isShowSaveFavoriteQuery.value = false}
    // 		whenFavoriteSave={profileStore.saveFavoriteQuery}
    // 		handleSearch={handleSearch}
    // 		whenHistogramClick={block.messages.toggleHistogram}
    // 		whenQueryChange={(value: string) => {
    // 			block.queryParams.query = value
    // 		}}
    // 		whenIntervalChange={handleIntervalChange}
    // 	/>
    // )

    const whenHistogramIntervalChange = (arg: {
      from: Date
      to: Date
    }) => {
      handleIntervalChange({ date: arg.from }, { date: arg.to })
    }

    // const renderHistogramWidget = () => {
    // 	if (block.messages.groups.isGroupView || !block.messages.isHistogramVisible) {
    // 		return
    // 	}

    // 	return (
    // 		<Widget
    // 			title="Messages count"
    // 		>
    // 			{
    // 				!block.messages.isEmpty
    // 					? (
    // 						<HistogramChart
    // 							theme={theme.value}
    // 							data={block.messages.histogram}
    // 							//isFullScreen={widgetInFullScreen.value.histogram}
    // 							interval={block.messages.searchInterval}
    // 							width={(
    // 								getClosestPrettyTime({
    // 									...block.messages.searchInterval,
    // 									count: 30,
    // 								})[0]
    // 							)}
    // 							timezone={useTimezoneStore().timezone.name}
    // 							whenIntervalChange={whenHistogramIntervalChange}
    // 							fetching={block.messages.isHistogramFetching}
    // 						/>
    // 					)
    // 					: <Messages.Empty firstSearch={block.messages.firstSearch}/>
    // 			}
    // 		</Widget>
    // 	)
    // }

    // const renderWidgets = () => (
    // 	<>
    // 		{renderHistogramWidget()}
    // 		{renderAggregation()}
    // 	</>
    // )

    // const renderTable = () => (
    // 	<Table
    // 		id={0}
    // 		class={styles.table}
    // 		asWidget={false}
    // 	/>
    // )

    // const renderContent = () => {
    // 	return [
    // 		renderControls(),
    // 		renderSearch(),
    // 		renderWidgets(),
    // 		renderTable(),
    // 	]
    // }

    // return () => (
    // 	<div class={styles.page}>
    // 		{/* {renderContent()} */}
    //     CONTENT
    // 	</div>
    // )

    const data = generateTableData(130)

    return () => (
      <div class="flex flex-col gap-[20px] p-[20px]">
        <LogControls
          from={block.intervalParams.from}
          to={block.intervalParams.to}
          expression={block.queryParams.query}
          whenExpressionChange={(value: string) => {
            block.queryParams.query = value
          }}
          whenIntervalChange={handleIntervalChange}
          whenSubmit={handleSearch}
        />
        <LogTable data={data} />
      </div>
    )
  },
})
