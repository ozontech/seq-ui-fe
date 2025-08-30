import imask from 'imask'

export const IMaskOptionsWithSeconds = {
	mask: 'HH:`MM:`SS',
	blocks: {
		HH: {
			mask: imask.MaskedRange,
			from: 0,
			to: 23,
			maxLength: 2,
			overwrite: 'shift',
			autofix: true,
		},
		MM: {
			mask: imask.MaskedRange,
			from: 0,
			to: 59,
			maxLength: 2,
			overwrite: 'shift',
			autofix: true,
		},
		SS: {
			mask: imask.MaskedRange,
			from: 0,
			to: 59,
			maxLength: 2,
			overwrite: 'shift',
			autofix: true,
		},
	},
}

export interface Option<T = string> {
	readonly label: string
	readonly value: T
	readonly caption?: string
	readonly index?: number
}

export type IntervalType = 'absolute' | 'relative'

export type EditToQueryOptions = {
	type: 'add' | 'exclude'
	key: string
	value: string
}
