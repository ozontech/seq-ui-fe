export const pluralize = (count: number, [one, two, five]: [string, string, string]) => {
	let num = Math.abs(count) % 100

	if (num >= 5 && num <= 20) {
		return five
	}

	num %= 10
	if (num === 1) {
		return one
	}

	if (num >= 2 && num <= 4) {
		return two
	}

	return five
}
