import { test as setup } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { AuthPage } from '~/playwright/pages/auth-page'
import { LOGIN, PASSWORD } from '~/playwright/config'

setup('authenticate', async ({ page, baseURL }) => {
	const authPage = new AuthPage(page)

	await allure.id('3145646')

	await page.goto(baseURL as string)

	await allure.step('Вводим логин', async () => {
		await authPage.fillLogin(LOGIN)
	})

	await allure.step('Вводим пароль', async () => {
		await authPage.fillPassword(PASSWORD)
	})

	await allure.step('Авторизуемся', async () => {
		await authPage.authorize()
	})
})