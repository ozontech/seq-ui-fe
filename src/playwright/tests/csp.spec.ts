import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { MainPage } from '~/playwright/pages/main-page'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

test.describe('Отчёты CSP', () => {
	test.beforeEach(async () => {
		await allure.epic('Отчёты')
		await allure.feature('Отчёты CSP')
	})
	test('После загрузки страницы не отправляются отчеты об ошибках CSP', async ({
		page,
		baseURL,
	}) => {
		await allure.story('Отчёты об ошибках CSP')
		await allure.id('3145647')
		await allure.tag('NEGATIVE')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)

		const mainPage = new MainPage(page)
		const assertCSPReport = await mainPage.checkCSPReports(baseURL as string)

		// Проверяем, что не было ни одного запроса на ручку /csp-report
		expect(assertCSPReport).toEqual(false)
	})
})
