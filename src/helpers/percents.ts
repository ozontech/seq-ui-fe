export const getDecimalPercent = (a: number, max?: number) => {
	if (!max) {
		return
	}
	return Math.round(a / max * 10000) / 100
}
