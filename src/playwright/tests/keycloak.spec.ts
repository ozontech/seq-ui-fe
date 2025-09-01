import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { AuthPage } from '~/playwright/pages/auth-page'
import { LOGIN, PASSWORD } from '~/playwright/config'

test.use({
	storageState: {
		cookies: [],
		origins: [],
	},
})

test.describe('Авторизация через keycloak', () => {
	test.beforeEach(async () => {
		await allure.epic('Авторизация')
		await allure.feature('Авторизация через keycloak')
	})

	test('Проверка авторизации через keycloack', async ({
		page,
		baseURL,
	}) => {
		await allure.story('Проверка авторизации через keycloack')
		await allure.id('3145645')

		const authPage = new AuthPage(page)

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

		await allure.step('Проверяем отсутствие ошибки', async () => {
			await page.waitForURL(baseURL as string)

			expect(page.url()).not.toContain('/login-error')
		})
	})
})