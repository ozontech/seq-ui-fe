import type { Locator, Page } from '@fe/pw-config'

import { BUTTON_SAVE, DROPDOWN_ITEM, TEXT_AREA } from '~/playwright/locators/common.locators'
import {
	BUTTON_RESET,
	DURATION_UNIT_SELECT,
	MODAL_HEADER,
	REQUEST_NAME,
	REQUEST_PERIOD,
	REQUEST_TEXT,
} from '~/playwright/locators/favorite-modal.locators'

export class FavoriteModal {
	private readonly page: Page

	public modalHeader: Locator

	public saveButton: Locator

	public requestText: Locator

	public requestTextArea: Locator

	public requestName: Locator

	public requestPeriod: Locator

	public requestUnit: Locator

	public dropDownItem: Locator

	public buttonReset: Locator

	constructor(page: Page) {
		this.page = page
		this.modalHeader = this.page.getByTestId(MODAL_HEADER)
		this.saveButton = this.page.getByTestId(BUTTON_SAVE)
		this.requestText = this.page.getByTestId(REQUEST_TEXT)
		this.requestPeriod = this.page.getByTestId(REQUEST_PERIOD)
		this.requestUnit = this.page.getByTestId(DURATION_UNIT_SELECT)
		this.requestTextArea = this.requestText.locator(TEXT_AREA)
		this.dropDownItem = this.page.getByTestId(DROPDOWN_ITEM)
		this.requestName = this.page.getByTestId(REQUEST_NAME)
		this.buttonReset = this.page.getByTestId(BUTTON_RESET)
	}

	public async saveForm() {
		await this.saveButton.click()
	}

	public async fillRequestName(requestName: string) {
		await this.requestName.fill(requestName)
	}

	public async fillRequestPeriod(requestPeriod: string) {
		await this.buttonReset.click()
		await this.requestPeriod.clear()
		await this.requestPeriod.fill(requestPeriod)
	}

	public async clearRequestPeriod() {
		await this.buttonReset.click()
		await this.requestPeriod.clear()
	}

	public async fillRequestUnit(requestUnit: string) {
		await this.requestUnit.click()
		await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text=${requestUnit}`).click()
	}
}