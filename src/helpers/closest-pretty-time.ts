import { msToShortUnits } from './duration'

const MS = 1
const SECOND = MS * 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const generatePrettiestForUnit = (unit: 'ms' | 'second' | 'minute' | 'hour' | 'day') => {
	if (unit === 'ms') {
		return [
			1,
			2,
			4,
			5,
			10,
			20,
			25,
			50,
			100,
			200,
			250,
			500,
			1000,
		]
	}
	if (unit === 'hour') {
		return [
			Number(HOUR),
			1.5 * HOUR,
			2 * HOUR,
			3 * HOUR,
			4 * HOUR,
			6 * HOUR,
			8 * HOUR,
			12 * HOUR,
			24 * HOUR,
		]
	}

	if (unit === 'day') {
		return [
			Number(DAY),
			1.5 * DAY,
			2 * DAY,
			3 * DAY,
			4 * DAY,
			6 * DAY,
			7 * DAY,
			14 * DAY,
			30 * DAY,
		]
	}

	const multiplier = unit === 'second' ? SECOND : MINUTE

	return [
		Number(multiplier),
		2 * multiplier,
		3 * multiplier,
		4 * multiplier,
		5 * multiplier,
		6 * multiplier,
		10 * multiplier,
		12 * multiplier,
		15 * multiplier,
		20 * multiplier,
		30 * multiplier,
		60 * multiplier,
	]
}

const prettyTimes = [
	...generatePrettiestForUnit('ms'),
	...generatePrettiestForUnit('second'),
	...generatePrettiestForUnit('minute'),
	...generatePrettiestForUnit('hour'),
	...generatePrettiestForUnit('day'),
]

export const getClosestPrettyTime = ({ from, to, count }: { from: string | undefined; to: string; count: number }): [number, string] => {
	if (!from) {
		return [prettyTimes[prettyTimes.length - 1], '24h']
	}
	if (count < 1) {
		return [1, msToShortUnits(1)]
	}
	const diff = new Date(to).getTime() - (from ? new Date(from) : new Date()).getTime()
	const size = diff / count

	let start = 0
	let end = prettyTimes.length - 1
	while (start <= end) {
		const middle = Math.floor((start + end) / 2)
		const next = prettyTimes[middle + 1]
		const cur = prettyTimes[middle]

		if (next === undefined) {
			return [cur, msToShortUnits(cur)]
		}

		if (size > cur && size < next) {
			return [next, msToShortUnits(next)]
		}

		if (size >= cur) {
			start = middle + 1
		} else {
			end = middle - 1
		}
	}
	const ms = prettyTimes[start > 1 ? start - 1 : 0]
	return [ms, msToShortUnits(ms)]
}
