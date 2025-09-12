export function setAnimationInterval(ms: number, signal: AbortSignal, callback: (ms: number) => void) {
	const start = document.timeline?.currentTime ? Number(document.timeline.currentTime) : performance.now()

	function frame(time: number) {
		if (signal.aborted) return
		callback(time)
		scheduleFrame(time)
	}

	function scheduleFrame(time: number) {
		const elapsed = time - start
		const roundedElapsed = Math.round(elapsed / ms) * ms
		const targetNext = start + roundedElapsed + ms
		const delay = targetNext - performance.now()
		setTimeout(() => requestAnimationFrame(frame), delay)
	}

	scheduleFrame(start)
}
