import type { Locator, Page } from '@fe/pw-config'

import { DROPDOWN_ITEM, DROPDOWN_LIST } from '~/playwright/locators/common.locators'
import {
	COPY_JSON_BUTTON,
	COPY_PERMALINK_BUTTON,
	MESSAGE_BODY,
	MESSAGE_BODY_ROW,
	OPEN_IN_NEW_TAB_BUTTON,
	PINNED_FIELDS,
	SERVICE_ERRORS_BUTTON,
	SHOW_SURROUNDING_MESSAGES,
} from '~/playwright/locators/table.locators'

export class LogBody {

	public page: Page

	public newTabButton: Locator

	public copyPermalinkButton: Locator

	public serviceErrorsButton: Locator

	public copyJSONButton: Locator

	public showSurroundingMessagesButton: Locator

	public messageBody: Locator

	public messageBodyRow: Locator

	public pinnedFields: Locator

	public dropdownList: Locator

	public dropdownItem: Locator

	constructor(page: Page) {
		this.page = page
		this.newTabButton = this.page.getByTestId(OPEN_IN_NEW_TAB_BUTTON)
		this.copyPermalinkButton = this.page.getByTestId(COPY_PERMALINK_BUTTON)
		this.serviceErrorsButton = this.page.getByTestId(SERVICE_ERRORS_BUTTON)
		this.copyJSONButton = this.page.getByTestId(COPY_JSON_BUTTON)
		this.showSurroundingMessagesButton = this.page.getByTestId(SHOW_SURROUNDING_MESSAGES)
		this.messageBody = this.page.getByTestId(MESSAGE_BODY)
		this.messageBodyRow = this.page.getByTestId(MESSAGE_BODY_ROW)
		this.pinnedFields = this.page.getByTestId(PINNED_FIELDS)
		this.dropdownList = this.page.getByTestId(DROPDOWN_LIST)
		this.dropdownItem = this.page.getByTestId(DROPDOWN_ITEM)
	}

	public async copyPermalink() {
		await this.copyPermalinkButton.click()
	}

	public async openSurroundingMessages() {
		await this.showSurroundingMessagesButton.click()
	}

	public async openLogInNewTab() {
		await this.newTabButton.click()
	}
}