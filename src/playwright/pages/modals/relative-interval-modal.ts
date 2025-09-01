import { expect } from '@fe/pw-config'
import type { Locator, Page } from '@fe/pw-config'

import { INCREMENT } from '~/playwright/consts/intervals.consts'
import { DROPDOWN_ITEM } from '~/playwright/locators/common.locators'
import {
	BUTTON_DECREMENT,
	BUTTON_INCREMENT,
	DURATION_BUTTON,
	DURATION_INPUT_COUNT,
	DURATION_UNIT_SELECT,
} from '~/playwright/locators/intervals.locators'

export class RelativeIntervalModal {
	public page: Page

	public durationInput: Locator

	public unitSelect: Locator

	public dropdownItem: Locator

	public incrementButton: Locator

	public decrementButton: Locator

	constructor(page: Page) {
		this.page = page
		this.durationInput = this.page.getByTestId(DURATION_INPUT_COUNT)
		this.unitSelect = this.page.getByTestId(DURATION_UNIT_SELECT)
		this.dropdownItem = this.page.getByTestId(DROPDOWN_ITEM)
		this.incrementButton = this.page.getByTestId(BUTTON_INCREMENT)
		this.decrementButton = this.page.getByTestId(BUTTON_DECREMENT)
	}

	public async selectDuration(intervalName: string) {
		const durationButton = this.page.locator(
			`data-testid=${DURATION_BUTTON}`,
			{
				has: this.page.locator(`text="${intervalName}"`),
			},
		)

		await expect(durationButton).not.toBeDisabled()
		await durationButton.click()
	}

	public async fillDurationField(duration: string) {
		await this.durationInput.fill(duration)
	}

	public async getDurationItem(): Promise<string> {
		return await this.unitSelect.inputValue() as string
	}

	public async clearDurationField() {
		await this.durationInput.clear()
	}

	public async selectTimeUnit(unitName: string) {
		await this.unitSelect.click()

		const unitItem = this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${unitName}"`)

		await expect(unitItem).toBeVisible()
		await unitItem.click()
	}

	public async getTimeUnits(): Promise<string[]> {
		const units = []

		await this.unitSelect.click()

		for (let i = 0; i < await this.dropdownItem.count(); i++) {
			units.push(await this.dropdownItem.nth(i).textContent() as string)
		}

		return units
	}

	public async changeValue(action: string, count: number) {
		const button = action === INCREMENT
			? this.incrementButton
			: this.decrementButton

		for (let i = 0; i < count; i++) {
			await button.click()
		}
	}
}