import { expect } from '@fe/pw-config'
import type { Locator, Page } from '@fe/pw-config'

import { HEADER_LOGO } from '~/playwright/locators/header.locators'

export const LOGIN_FIELD = 'login-field'
export const PASSWORD_FIELD = 'password-field'
export const REMEMBER_ME_CHECKBOX = 'remember-me-checkbox'
export const LOGIN_BUTTON = 'login-button'

const authFile = 'playwright/user.json'

export class AuthPage {
	private readonly page: Page

	public loginField: Locator

	public passwordField: Locator

	public loginButton: Locator

	public headerLogo: Locator

	constructor(page: Page) {
		this.page = page
		this.loginField = this.page.getByTestId(LOGIN_FIELD)
		this.passwordField = this.page.getByTestId(PASSWORD_FIELD)
		this.loginButton = this.page.getByTestId(LOGIN_BUTTON)
		this.headerLogo = this.page.getByTestId(HEADER_LOGO)
	}

	public async fillLogin(loginText: string) {
		await this.page.waitForEvent('domcontentloaded')
		await this.loginField.type(loginText)
	}

	public async fillPassword(passwordText: string) {
		// клик для переноса фокуса в поле
		await this.passwordField.click()
		await this.passwordField.pressSequentially(passwordText)
	}

	public async authorize() {
		await Promise.all([
			this.page.waitForEvent('requestfinished'),
			this.loginButton.click(),
		])
		await this.page.evaluate(() => window.localStorage.setItem('LOGGING_TOURS', '{"INTRO_ONBOARDING":true}'))
		await this.page.evaluate(() => window.localStorage.setItem('LOGGING_THEME', 'light'))

		// Alternatively, you can wait until the page reaches a state where all cookies are set.
		await expect(this.headerLogo).toBeVisible()

		// End of authentication steps.
		await this.page.context().storageState({ path: authFile })
	}
}
