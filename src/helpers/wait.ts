export const wait = (ms = 500) => {
	return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
