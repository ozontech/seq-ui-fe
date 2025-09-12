import { isNil, median } from 'ramda'

export const getDatasetStatistic = (dataset: { timestamp: number; value: number }[]) => {
	const { min, max, values } = dataset.reduce<{
		min: number
		max: number
		values: number[]
	}>((acc, item) => {
		const value = item.value

		if (isNil(value)) {
			return acc
		}

		acc.values.push(value)

		if (value < acc.min) {
			acc.min = value
		}

		if (value > acc.max) {
			acc.max = value
		}

		return acc
	}, { min: Infinity, max: -Infinity, values: [] })

	return {
		min,
		median: median(values),
		max,
	}
}
