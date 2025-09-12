import { computed, defineComponent, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { prop } from '@fe/prop-types'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { VirtualItem } from '@tanstack/vue-virtual'

import { Messages } from '../shared/messages'

import styles from './aggregation.module.css'
import tableStyles from './table.module.css'
import rowStyles from './table-row.module.css'

import type { AggregationData } from '@/normalizers/aggregations'
import { dateToLocaleString, formatDuration, isEmptyDuration } from '@/helpers/duration'
import { SeqapiV1AggregationFuncDto } from '@/api/generated/seq-ui-server'
import { useTimezoneStore } from '@/stores/timezone'
import type { EditToQueryOptions } from '@/types/input'
import type { Duration } from '@/types/duration'
import { setAnimationInterval } from '@/helpers/timer'
import { durationToMessage } from '@/helpers/duration-locale'
import { formatNumber } from '@/helpers/format-number'
import { getDecimalPercent } from '@/helpers/percents'

export const AggregationTable = defineComponent({
	name: 'AggregationTable',
	props: {
		total: prop<number>().optional(),
		isLoading: prop<boolean>().optional(false),
		quantiles: prop<string[]>().optional([]),
		field: prop<string>().required(),
		groupBy: prop<string>().required(),
		fn: prop<string>().required(),
		data: prop<AggregationData | null>().optional(),
		error: prop<string>().optional(),
		from: prop<Duration>().optional(),
		to: prop<Duration>().optional(),
		updatedAt: prop<Date>().optional(),
		whenEditQuery: prop<(arg: EditToQueryOptions) => void>().optional(),
	},
	setup(props) {
		const updateTime = ref(props.updatedAt ?? new Date())
		const tzStore = useTimezoneStore()

		watch(() => props.data, () => {
			updateTime.value = new Date()
		})

		const timezone = computed(() => {
			return tzStore.timezone.name
		})

		const updatedAtText = ref(formatDuration(updateTime.value, timezone.value))

		setAnimationInterval(30_001, new AbortController().signal, () => {
			updatedAtText.value = formatDuration(updateTime.value, timezone.value)
		})

		const parentRef = ref<HTMLDivElement | null>(null)

		const rowVirtualizer = useVirtualizer({
			count: props.data?.length || 0,
			getScrollElement: () => parentRef.value,
			estimateSize: () => 32,
			overscan: 3,
		})

		const validQuantiles = computed(() => props.quantiles.filter(Boolean))
		const hasValidQuantiles = computed(() => validQuantiles.value.length > 0)
		const renderFnColumTitle = computed(() => `${props.fn}(${props.field})`)

		const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
		const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

		const renderSkeletons = () => {
			return (
				props.isLoading &&
					Array.from({ length: 5 }).map((_, idx) => (
						<div
							class={[
								rowStyles.tableRow, {
									[rowStyles.validQuantiles]: hasValidQuantiles.value,
									[rowStyles.noValidQuantiles]: !hasValidQuantiles.value,
								},
							]}
							style={{
								opacity: 1 - 0.1 * idx,
								'--quantiles': props.quantiles.length,
							}}
							key={`skeleton-${idx}`}
						>
							{/* <SkeletonText width="90%"/>
							{props.quantiles.map((_, id) => <SkeletonText key={id} class={styles.alignRight}/>)}
							<SkeletonText class={styles.alignRight}/>
							<SkeletonText width="90%" class={styles.alignRight}/> */}
						</div>
					))
			)
		}

		const renderHeader = () => (
			<div
				class={[
					rowStyles.tableRow,
					rowStyles.tableHead,
					{
						[rowStyles.validQuantiles]: hasValidQuantiles.value,
						[rowStyles.noValidQuantiles]: !hasValidQuantiles.value,
					},
				]}
				style={{
					'--quantiles': props.quantiles.length,
				}}
			>
				<span class={rowStyles.textCell}>{props.groupBy || 'GroupBy'}</span>

				{hasValidQuantiles.value && (
					<>
						{
							props.quantiles.map((value, i) => (
								<span key={i} class={styles.alignRight}>
									{`p${Math.floor(Number(value) * 100)}`}
								</span>
							))
						}
					</>
				)}
				<span
					class={styles.alignRight}
				>
					%
				</span>
				<span class={[styles.alignRight, styles.fnColumn]}>
					{renderFnColumTitle.value}
				</span>
			</div>
		)

		const widgetFooter = computed(() => {
			if (!updateTime.value) {
				return null
			}

			return `updated ${updatedAtText.value}`
    })

		const renderInterval = () => {
			const { from, to } = props

			let fromToText = from?.date
        ? `${dateToLocaleString(from.date, timezone.value)} - ${dateToLocaleString(new Date(to?.date || Date.now()), timezone.value)}`
        : durationToMessage(from || {})?.join(' ')

      if (isEmptyDuration(from)) {
				fromToText = ''
			}

			return (
				<div class={styles.interval}>
					<div>{fromToText}</div>
					<div>{widgetFooter.value}</div>
				</div>
			)
		}

		const measureElement = (el: Element | ComponentPublicInstance | null) => {
			if (!el) {
				return
			}

			rowVirtualizer.value.measureElement(el as Element)

			return
		}

		const renderTableBody = () => (
			<div
				ref={parentRef}
				class={tableStyles.table}
			>
				<ol style={`height: ${totalSize.value}px`} class={tableStyles.tableBody}>
					{virtualRows.value.map(renderRow)}
				</ol>
			</div>
		)

		const renderTable = () => {
			if (props.error) {
				return (
					<div class={styles.errorMessageContainer}>
						<p class={styles.error}>Во время получения данных произошла ошибка</p>
						<p class={styles.error}>Удалите или отредактируйте агрегацию если проблема в ней</p>
						<p class={styles.error}>{props.error}</p>
					</div>
				)
			}

			if (props.data?.length === 0) {
				return (
					<Messages.Empty
						firstSearch={false}
					/>
				)
			}

			return (
				<>
					{renderHeader()}
					{renderSkeletons()}
					{renderTableBody()}
					{renderInterval()}
				</>
			)
		}

		const renderRow = (virtual: VirtualItem) => {
			if (!props.data || !props.data[virtual.index]) {
				return <div/>
			}

			const { result, name, quantiles } = props.data[virtual.index]

			const percentage = getDecimalPercent(result, props.total)
			const backgroundPercentage = getDecimalPercent(result, props.data[0].result) || 0
			const background = `${backgroundPercentage}%`

			return (
				<li
					ref={measureElement}
					class={[rowStyles.tableRow, tableStyles.percentage]}
					key={`${virtual.index}`}
					data-index={virtual.index}
					style={{
						'grid-template-columns': `minmax(50px, 1fr) ${quantiles ? `repeat(${quantiles.length}, 40px)` : ''} 48px minmax(auto, 120px)`,
						transform: `translateY(${virtual.start}px)`,
						backgroundSize: background,
					}}
				>
					<span class={tableStyles.textCell}>
						{ name }
					</span>
					{quantiles?.map((value, idx) => (
						<span class={[tableStyles.quantile, tableStyles.alignRight]} key={idx}>
							{value}
						</span>
					))}

					{ props.fn === SeqapiV1AggregationFuncDto.AfUnique ? null : (
						<>
							<span
								class={[tableStyles.numberCell, tableStyles.percentCell, tableStyles.alignRight]}
							>
								{percentage}%
							</span>
							<div
								class={[tableStyles.numberCell, tableStyles.alignRight]}
							>
								{formatNumber(result)}
							</div>
						</>
					)}
				</li>
			)
		}

		return () => renderTable()
	},
})
