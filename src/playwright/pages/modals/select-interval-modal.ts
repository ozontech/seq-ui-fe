import { expect } from '@fe/pw-config'
import type { Locator, Page } from '@fe/pw-config'

import { FILTER_CHIP_TOGGLE, SAVE_TIME_BUTTON } from '~/playwright/locators/intervals.locators'
import { RelativeIntervalModal } from '~/playwright/pages/modals/relative-interval-modal'
import { AbsoluteIntervalModal } from '~/playwright/pages/modals/absolute-interval-modal'
import { BUTTON_CANCEL } from '~/playwright/locators/common.locators'

export class SelectIntervalModal {
	private readonly page: Page

	public relativeModal: RelativeIntervalModal

	public absoluteModal: AbsoluteIntervalModal

	public saveButton: Locator

	public cancelButton: Locator

	public filterChipToggle: Locator

	constructor(page: Page) {
		this.page = page
		this.relativeModal = new RelativeIntervalModal(page)
		this.absoluteModal = new AbsoluteIntervalModal(page)
		this.saveButton = this.page.getByTestId(SAVE_TIME_BUTTON)
		this.cancelButton = this.page.getByTestId(BUTTON_CANCEL)
		this.filterChipToggle = this.page.getByTestId(FILTER_CHIP_TOGGLE)
	}

	public async closeModal() {
		await this.cancelButton.click()
	}

	public async saveModal() {
		await this.saveButton.click()
	}

	public async selectMode(mode: string) {
		const modeButton = this.filterChipToggle.locator(`text="${mode}"`)

		await expect(modeButton).not.toBeDisabled()
		await modeButton.click()
	}
}