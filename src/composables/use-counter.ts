let DEFAULT = 0
let COUNTER = 0

export const useCounter = () => {
	const setDefault = (number: number) => {
		DEFAULT = number
		COUNTER = DEFAULT
	}

	const resetCounter = () => {
		COUNTER = DEFAULT
	}

	const getValue = () => {
		return COUNTER++
	}

	return {
		getValue,
		setDefault,
		resetCounter,
	}
}
