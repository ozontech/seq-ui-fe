export const formatNumber = new Intl.NumberFormat('en-US').format

export const compactFormatNumber = (value: number) => {
	const formatter = Intl.NumberFormat('en', { notation: 'compact' })

	return formatter.format(value).toLocaleLowerCase()
}

export const formatPercent = (value: number, decimals = 2) => {
	const formattedNumber = parseFloat((value * 100).toFixed(decimals))

	return `${formattedNumber}%`
}
