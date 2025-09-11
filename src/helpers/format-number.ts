export const formatNumber = (number: number, options: Intl.NumberFormatOptions = {
	maximumFractionDigits: 2,
}) => {
	if (number === undefined) {
		return ''
	}

	const formatter = new Intl.NumberFormat('ru', options)

	return formatter.format(number)
}
