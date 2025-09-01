import type { Page } from '@fe/pw-config'

import { MainPage } from '~/playwright/pages/main-page'

export class ErrorGroupsPage extends MainPage {

	constructor(page: Page) {
		super(page)
		this.page = page
	}
}
