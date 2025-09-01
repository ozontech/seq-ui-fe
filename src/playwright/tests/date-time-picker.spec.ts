import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { EARLIER, LATER } from '~/playwright/consts/intervals.consts'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

test.describe('Выбор временного интервала в поиске', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Поиск')
		await allure.feature('Выбор временного интервала в поиске')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-103')

		await page.goto(baseURL as string)
	})

	test.describe('Значения по умолчанию в поле выбора интервала', () => {
		test.beforeEach(async () => {
			await allure.story('Изменение выбранного периода стрелками')
		})

		test('Значение по умолчанию в поле выбора времени должно быть "5 минут"', async ({ page }) => {
			await allure.id('4450651')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Значение в поле выбора интервала должно быть "5 минут"', async () => {
				expect(await dataSourcePage.dateTimeInterval.textContent()).toContain('5 минут')
			})
		})
	})

	test.describe('Изменение выбранного периода стрелками', () => {
		test.beforeEach(async ({ page }) => {
			await allure.story('Изменение выбранного периода стрелками')
		})

		test('Выбор более раннего интервала', async ({ page }) => {
			await allure.id('4565523')

			const dataSourcePage = new DataSourcePage(page)
			let laterPeriod: number, earlierPeriod: number

			await allure.step('Выбираем более ранний период', async () => {
				await dataSourcePage.changePeriod(EARLIER, 1)
				laterPeriod = await dataSourcePage.getFilterTime()

				await dataSourcePage.changePeriod(EARLIER, 1)
				earlierPeriod = await dataSourcePage.getFilterTime()
			})

			await allure.step('Последним отображается самый ранний период', async () => {
				expect(laterPeriod).toBeGreaterThan(earlierPeriod)
			})
		})

		test('Выбор более позднего интервала', async ({ page }) => {
			await allure.id('4565524')

			const dataSourcePage = new DataSourcePage(page)
			let laterPeriod: number, earlierPeriod: number

			await allure.step('Выбираем более поздний период', async () => {
				await dataSourcePage.changePeriod(LATER, 1)
				earlierPeriod = await dataSourcePage.getFilterTime()

				await dataSourcePage.changePeriod(LATER, 1)
				laterPeriod = await dataSourcePage.getFilterTime()
			})

			await allure.step('Последним отображается самый поздний период', async () => {
				expect(laterPeriod).toBeGreaterThan(earlierPeriod)
			})
		})
	})

	test.describe('Закрытие модалки выбора интервала', () => {

		test.beforeEach(async ({ page }) => {
			await allure.story('Закрытие модалки выбора интервала')

			const dataSourcePage = new DataSourcePage(page)
			await dataSourcePage.openCloseDateTimePicker()

			await expect(dataSourcePage.dateTimePicker).toBeVisible()
		})

		test('Модалка выбора интервала закрывается кликом вовне', async ({ page }) => {
			await allure.id('4490832')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Нажимаем на поле выбора интервала', async () => {
				await dataSourcePage.openCloseDateTimePicker()
			})

			await allure.step('Модалка выбора интервала не отображается', async () => {
				await expect(dataSourcePage.dateTimePicker).not.toBeVisible()
			})
		})

		test('Модалка выбора интервала закрывается при нажатии кнопки отмены', async ({ page }) => {
			await allure.id('4490833')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Закрываем модалку кнопкой закрытия', async () => {
				await dataSourcePage.selectIntervalModal.closeModal()
			})

			await allure.step('Модалка выбора интервала не отображается', async () => {
				await expect(dataSourcePage.dateTimePicker).not.toBeVisible()
			})
		})
	})
})
