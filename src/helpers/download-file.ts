type FileOptions = {
	suggestedName: string
	extension: string
}

export const downloadBlob = (blob: Blob, { suggestedName, extension }: FileOptions) => {
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.setAttribute('download', `${suggestedName}.${extension}`)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)

}

export async function generateAndDownloadFile({
  streamFile,
  onProgress,
  onFinish,
  onError
}: {
	streamFile: () => Promise<Response>
	onProgress?: (number: number) => void
	onFinish?: () => void
	onError?: (message: string) => void
}, {
	suggestedName,
  extension,
}: FileOptions) {
	const isStream = ('showSaveFilePicker' in window && window.isSecureContext)
	let array = new Uint8Array(0)
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-expect-error
		const newHandle = await window.showSaveFilePicker?.({
			suggestedName,
			types: [
				{
					description: 'Text file',
					accept: { '*/*': [`.${extension}`] },
				},
			],
		})

		// create a FileSystemWritableFileStream to write to
		const stream = await newHandle?.createWritable() as WritableStreamDefaultWriter
		streamFile()
			.then(async (response) => {
				if (!response.body) {
					return
				}

				const reader = response.body.getReader()
				if (response.status !== 200) {
					const str = await reader.read()
					const content = new TextDecoder().decode(str.value)
					onError?.(content)
					if (isStream) {
						await stream.close()
					}
					return
				}

				let flag = true
				while (flag) {
					const { done, value } = await reader.read()
					if (done) {
						onFinish?.()
						if (isStream) {
							await stream.close()
						} else {
							downloadBlob(new Blob([array]), {
								suggestedName,
								extension,
							})
						}
						flag = false
						break
					}

					// строка `{"id":`
					const pattern = new Uint8Array([123, 34, 105, 100, 34, 58])

					queueMicrotask(() => {
						let count = 0
						for (let i = 0; i < value.length;) {
							let j = 0
							while (j < pattern.length) {
								if (value[i + j] !== pattern[j]) {
									j = 0
									i++
									break
								} else {
									j++
									if (j === pattern.length) {
										count++
										j = 0
										i += pattern.length - 1
									}
								}
							}
						}
						onProgress?.(count)
					})

					if (isStream) {
						stream.write(value)
					} else {
						const temp = new Uint8Array(array.byteLength + value.byteLength)
						temp.set(array, 0)
						temp.set(value, array.byteLength)
						array = temp
					}
				}
			})

	} catch (err) {
		if (err instanceof Error) {
			if (err.name === 'AbortError' && err.message === 'The user aborted a request.') {
				return
			}
			console.error(err.name, err.message)
		}
		throw err
	}
}
