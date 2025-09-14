import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Notification } from '~/ui'

import { getApi } from '~/api/client'
import type { SeqapiV1ExportRequestDto } from '~/api/generated/seq-ui-server'
import { generateAndDownloadFile } from '~/helpers/download-file'

export const useDownloadStore = defineStore('download-file', () => {
	const downloaded = ref(0)
	const limit = ref(0)

	const api = getApi()

	const onProgress = (value: number) => {
		if (downloaded.value + value > limit.value) {
			downloaded.value = limit.value
			return
		}

		downloaded.value += value
	}

	const onFinish = () => {
		Notification.success({ renderContent: 'Файл успешно скачан!' })
		downloaded.value = 0
		limit.value = 0
	}

	const onError = (message: string) => {
		Notification.negative({ renderContent: message })
		downloaded.value = 0
		limit.value = 0
	}

	const streamFile = (body: SeqapiV1ExportRequestDto) => {
		limit.value = body.limit || 100
		return api.seqUiServer.streamExport(body)
	}

	const downloadFile = (body: SeqapiV1ExportRequestDto) => {
		return generateAndDownloadFile({
			streamFile: () => streamFile(body),
			onProgress,
			onFinish,
			onError,
		}, {
			suggestedName: `${body.query}_${body.from}-${body.to}`,
			extension: body.format || 'txt',
		})
	}

	return {
		downloadFile,

		downloaded,
		limit,
	}

})
