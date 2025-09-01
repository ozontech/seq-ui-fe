import type { Locator, Page } from '@fe/pw-config'

import { BUTTON_CLOSE, BUTTON_CONFIRM_REMOVE, BUTTON_REMOVE } from '~/playwright/locators/common.locators'
import {
	DASHBOARD_ITEM,
	DASHBOARD_ITEM_NAME,
} from '~/playwright/locators/dashboars.locators'

export class DashboardsLibrary {
	private readonly page: Page

	public closeButton: Locator

	public dashboardItem: Locator

	public dashboardItemName: Locator

	public removeButton: Locator

	public confirmRemoveButton: Locator

	constructor(page: Page) {
		this.page = page
		this.closeButton = this.page.getByTestId(BUTTON_CLOSE)
		this.dashboardItem = this.page.getByTestId(DASHBOARD_ITEM)
		this.dashboardItemName = this.page.getByTestId(DASHBOARD_ITEM_NAME)
		this.removeButton = this.page.getByTestId(BUTTON_REMOVE)
		this.confirmRemoveButton = this.page.getByTestId(BUTTON_CONFIRM_REMOVE)
	}

	public async closeLibraryPopup() {
		await this.closeButton.click()
	}

	public async removeDashboard(dashboardName: string) {
		const item = this.page.locator(
			`data-testid=${DASHBOARD_ITEM}`,
			{ has: this.page.locator(`data-testid=${DASHBOARD_ITEM_NAME} >> text=${dashboardName}`) },
		)

		await item.locator(this.removeButton).click()
		await this.confirmRemoveButton.click()
		await this.page.waitForEvent('requestfinished')
	}
}