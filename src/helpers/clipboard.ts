export const copyToClipboard = (string: string) => {
	navigator.clipboard.writeText(string)
}

export const copyObjectToClipboard = (object: Record<string | number | symbol, unknown>) => {
	return copyToClipboard(JSON.stringify(object, null, 4))
}
