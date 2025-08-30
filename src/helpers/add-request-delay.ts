import { wait } from './wait'

export const addRequestDelay = async <T>(request: Promise<T>, delay = 500) => {
	const [data] = await Promise.all([
		request,
		wait(delay),
	])

	return data
}
