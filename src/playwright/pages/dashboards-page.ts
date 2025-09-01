import type { Locator, Page } from '@fe/pw-config'
import { faker } from '@faker-js/faker'

import { MainPage } from '~/playwright/pages/main-page'
import { NAME_INPUT, SAVE_AS_NEW_DASHBOARD_BUTTON } from '~/playwright/locators/dashboars.locators'
import { DashboardsLibrary } from '~/playwright/pages/modals/dashboards-library'
import { BUTTON_ACTION, BUTTON_CANCEL } from '~/playwright/locators/common.locators'

export class DashboardsPage extends MainPage {

	public dashboardsLibrary: DashboardsLibrary

	public saveAsDashboardButton: Locator

	public nameInput: Locator

	public actionButton: Locator

	public cancelButton: Locator

	constructor(page: Page) {
		super(page)
		this.page = page
		this.dashboardsLibrary = new DashboardsLibrary(page)
		this.saveAsDashboardButton = this.page.getByTestId(SAVE_AS_NEW_DASHBOARD_BUTTON)
		this.nameInput = this.page.getByTestId(NAME_INPUT)
		this.actionButton = this.page.getByTestId(BUTTON_ACTION)
		this.cancelButton = this.page.getByTestId(BUTTON_CANCEL)
	}

	public async saveDashboard(): Promise<string> {
		const dashboardName = `${faker.word.sample()}${faker.number.int({ min: 0, max: 999 }).toString().padStart(3, '0')}`

		await this.saveAsDashboardButton.click()
		await this.nameInput.fill(dashboardName)
		await this.actionButton.click()

		return dashboardName
	}
}
