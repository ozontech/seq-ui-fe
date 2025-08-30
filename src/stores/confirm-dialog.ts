import type { ButtonProps } from '@/ui'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { VNode } from 'vue'

type ConfirmDialogOptions = {
	title: string
	content?: VNode | string
	confirmButtonText?: string
	confirmButtonProps?: ButtonProps
	cancelButtonText?: string
	cancelButtonProps?: ButtonProps
}

export const useConfirmDialogStore = defineStore('confirm-dialog', () => {
	const isShow = ref(false)
	const options = ref<ConfirmDialogOptions | null>(null)
	const promiseResolve = ref<null | (() => void)>(null)

	const showConfirm = (customOptions: ConfirmDialogOptions) => {
		return new Promise<void>((resolve) => {
			options.value = customOptions
			isShow.value = true
			promiseResolve.value = resolve
		})
	}

	const closeConfirm = (confirmed: boolean) => {
		isShow.value = false
		options.value = null

		if (promiseResolve.value && confirmed) {
			promiseResolve.value()
			promiseResolve.value = null
		}
	}

	return {
		isShow,
		options,
		showConfirm,
		closeConfirm,
	}
})
