import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { HEADER_LOGO } from '~/playwright/locators/header.locators'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

const FEW_PAGES_DOWN_PIXELS_COUNT = 20000

test.describe('Бесконечный скролл', () => {
	test.beforeEach(async () => {
		await allure.epic('Таблица логов')
		await allure.feature('Бесконечный скролл')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.story('Кнопка скролла в начало страницы')
	})

	test('Прокрутка в начало страницы c помощью кнопки "Вверх"', async ({ page, baseURL }) => {
		await allure.id('3092337')
		const dataSourcePage = new DataSourcePage(page)

		await allure.step('Переходим на главную страницу и вводим поисковый запрос', async () => {
			await page.goto(baseURL as string)
			await dataSourcePage.searchMessage('message:error')
		})

		await allure.step('Скролим на несколько страниц вниз', async () => {
			await dataSourcePage.scrollPage(FEW_PAGES_DOWN_PIXELS_COUNT)
		})

		await allure.step('Нажимаем на кнопку "Вверх"', async () => {
			await dataSourcePage.scrollUp()
		})

		await allure.step('Проверяем, что на экране есть лого из шапки', async () => {
			await expect(page.getByTestId(HEADER_LOGO)).toBeInViewport()
		})
	})
})