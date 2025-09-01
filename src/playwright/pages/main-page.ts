import type { Locator, Page } from '@fe/pw-config'

import {
	BUTTON_ENV_SELECT,
	DASHBOARD,
	DATASOURCE,
	ENV_ITEM,
	ERROR_GROUPS,
	NOTIFICATION_CONTAINER,
} from '~/playwright/locators/header.locators'
import { DASHBOARDS_TAB, DATATABLE_TAB, SERVICE_ERRORS_TAB } from '~/playwright/consts/table.consts'

export class MainPage {
	public page: Page
	public envSelectButton: Locator
	public envItem: Locator

	constructor(page: Page) {
		this.page = page
		this.envSelectButton = this.page.getByTestId(BUTTON_ENV_SELECT)
		this.envItem = this.page.getByTestId(ENV_ITEM)
	}

	public async openTabByName(tabName: string) {
		let tab

		switch (tabName) {
			case DATATABLE_TAB: {
				tab = DATASOURCE
				break
			}
			case DASHBOARDS_TAB: {
				tab = DASHBOARD
				break
			}
			case SERVICE_ERRORS_TAB: {
				tab = ERROR_GROUPS
				break
			}
			default: {
				throw new Error('Unknown tab name')
			}
		}
		await this.page.getByTestId(tab).click()
	}

	public async checkCSPReports(url: string): Promise<boolean> {
		let cspReportExists = false

		this.page.on('request', (request) => {
			const url = new URL(request.url())
			if (`${url.origin}${url.pathname}` === `${url}/csp-report` && request.method() === 'POST') {
				cspReportExists = true
			}
		})

		await this.page.goto(url, {
			waitUntil: 'domcontentloaded',
		})
		await this.page.waitForTimeout(3000)

		return cspReportExists
	}

	public async getNotification(expectedText: string): Promise<Locator> {
		const notification = this.page.locator(NOTIFICATION_CONTAINER, { hasText: expectedText })

		return notification
	}

	public async getURLQuery(): Promise<string> {
		await this.page.waitForURL(/.*\?.*/)

		const url = this.page.url()
		const urlObj = new URL(url)
		const queryString = urlObj.search

		return queryString
	}

	public async getEnvList(): Promise<string[]> {
		const list: string[] = []

		await this.envSelectButton.click()

		for (let i = 0; i < await this.envItem.count(); i++) {
			list.push(await this.envItem.nth(i).textContent() as string)
		}

		return list
	}
}
