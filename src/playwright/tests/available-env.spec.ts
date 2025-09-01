import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'
import { DEV, STG } from '~/playwright/consts/environment.consts'

test.describe('Выбор окружения', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Авторизация')
		await allure.feature('Выбор окружения')
		await allure.story('Доступное окружение')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)

		await page.goto(baseURL as string)
	})

	test('В списке окружений только то, на котором задеплоен стенд', async ({ page, baseURL }) => {
		await allure.id('4617972')
		const dataSourcePage = new DataSourcePage(page)
		const envList = await dataSourcePage.getEnvList()
		expect(envList.length).toBe(1)

		// в CICD будет одно окружение везде, кроме прода
		if (baseURL?.includes(DEV)) {
			expect(envList[0]).toBe(DEV)
		} else if (baseURL?.includes(STG)) {
			expect(envList[0]).toBe(STG)
		} else {
			test.skip(true, 'Unknown environment')
		}
	})
})