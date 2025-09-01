import type { Locator, Page } from '@fe/pw-config'

import { BUTTON_REMOVE } from '~/playwright/locators/common.locators'
import {
	REQUEST_ITEM,
	REQUEST_ITEM_NAME,
	REQUEST_ITEM_TEXT,
	REQUEST_ITEM_TIME,
} from '~/playwright/locators/saved-requests.locators'

export class SavedRequestsModal {
	private readonly page: Page

	public requestItem: Locator

	public requestItemName: Locator

	public requestItemText: Locator

	public requestItemTime: Locator

	public buttonDelete: Locator

	constructor(page: Page) {
		this.page = page
		this.requestItem = this.page.getByTestId(REQUEST_ITEM)
		this.buttonDelete = this.page.getByTestId(BUTTON_REMOVE)
		this.requestItemName = this.requestItem.getByTestId(REQUEST_ITEM_NAME)
		this.requestItemText = this.requestItem.getByTestId(REQUEST_ITEM_TEXT)
		this.requestItemTime = this.requestItem.getByTestId(REQUEST_ITEM_TIME)
	}

	public async getRequest(requestName: string, requestTime: string, requestText: string) {
		const item = this.page.locator(`data-testid=${REQUEST_ITEM}`, {
			has:
                this.page.locator(`data-testid=${REQUEST_ITEM_NAME} >> text="${requestName}"`) &&
				this.page.locator(`data-testid=${REQUEST_ITEM_TIME} >> text="${requestTime}"`) &&
                this.page.locator(`data-testid=${REQUEST_ITEM_TEXT} >> text="${requestText}"`),
		})

		return item
	}

	public async removeItem(item: Locator) {
		const removeButton = item.locator(this.buttonDelete)
		await removeButton.click()

		await item.waitFor({ state: 'hidden' })
	}
}