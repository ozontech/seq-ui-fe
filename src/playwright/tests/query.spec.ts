import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { DashboardsPage } from '~/playwright/pages/dashboards-page'
import {
	ABSOLUTE,
	LAST_15_MINUTES,
	LAST_HOUR,
} from '~/playwright/consts/intervals.consts'
import { getRandomPastDate, getRandomTime } from '~/playwright/utils'
import { DASHBOARDS_TAB } from '~/playwright/consts/table.consts'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

test.describe('Работа query-параметров', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Поиск')
		await allure.feature('Работа query-параметров')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-105')

		await page.goto(baseURL as string)
	})

	test.describe('Query-параметры в таблице логов', () => {
		test.beforeEach(async ({ page }) => {
			await allure.story('Query-параметры в таблице логов')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Отправляем текстовый запрос', async () => {
				await dataSourcePage.searchMessage('message: error')
			})

			await allure.step('Открываем модалку выбора периода', async () => {
				await dataSourcePage.openCloseDateTimePicker()
			})
		})

		test('Query-параметры запроса и относительного временного интервала', async ({ page }) => {
			await allure.id('4617973')

			const dataSourcePage = new DataSourcePage(page)
			const QUERY_15_MINUTES = '?q=message:+error&rangetype=relative&from=900'
			let copiedURL: string

			await allure.step(`Передаём в модалку относительного интервала значение ${LAST_15_MINUTES}`, async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.selectDuration(LAST_15_MINUTES)
				await dataSourcePage.selectIntervalModal.saveModal()
			})

			await allure.step('В query-параметры передано верное значение', async () => {
				await page.waitForTimeout(1000)
				const queryValue = await dataSourcePage.getURLQuery()
				expect(queryValue).toBe(QUERY_15_MINUTES)
				copiedURL = page.url()
			})

			await allure.step('Переходим по ссылке из URL', async () => {
				await page.goto(copiedURL)
			})

			await allure.step(`Значение в поле выбора интервала должно быть ${LAST_15_MINUTES}`, async () => {
				expect(await dataSourcePage.dateTimeInterval.textContent()).toContain('последние15 минут')
			})

			await allure.step('В поле поиска отображается выбранный запрос', async () => {
				const inputValue = await dataSourcePage.getInputValue()

				expect(inputValue).toMatch(/^message:.*error$/)
			})
		})

		test('Query-параметры запроса и абсолютного временного интервала', async ({ page }) => {
			await allure.id('4617975')

			// для CICD (локально будет ещё gmt+3)
			const expectedInterval = (dateFrom: string, time: string, dateTo: string) => `${dateFrom}${time} - ${dateTo}${time}UTC`
			// для CICD (локально будет ещё gmt+3)
			const expectedQuery = (dateFrom: string, time: string, dateTo: string) => `?q=message:+error&rangetype=absolute&from=${dateFrom}T${time}.000Z&to=${dateTo}T${time}.000Z`
			const dataSourcePage = new DataSourcePage(page)
			let copiedURL: string

			const time = await getRandomTime()
			const dateTo = await getRandomPastDate()
			const formattedDateToForModal = dateTo.format('DD.MM.YYYY')
			const formattedDateToForCI = dateTo.format('YYYY-MM-DD')
			const dateFrom = dateTo.subtract(1, 'month')
			const formattedDateFromForModal = dateFrom.format('DD.MM.YYYY')
			const formattedDateFromForCI = dateFrom.format('YYYY-MM-DD')

			await allure.step('Передаём значение в модалку абсолютного интервала', async () => {
				await dataSourcePage.selectIntervalModal.selectMode(ABSOLUTE)
				await dataSourcePage.selectIntervalModal.absoluteModal.fillForm(formattedDateFromForModal, time, formattedDateToForModal, time)
				await dataSourcePage.selectIntervalModal.saveModal()
			})
			await allure.step('Значение в query должно быть верным', async () => {
				await page.waitForTimeout(1000)
				const queryValue = await dataSourcePage.getURLQuery()
				copiedURL = page.url()

				expect(queryValue).toBe(expectedQuery(formattedDateFromForCI, time, formattedDateToForCI))
			})

			await allure.step('Переходим по ссылке из URL', async () => {
				await page.goto(copiedURL)
			})

			await allure.step('Значение в поле выбора интервала должно быть верным', async () => {
				expect(await dataSourcePage.dateTimeInterval.textContent()).toBe(expectedInterval(formattedDateFromForModal, time, formattedDateToForModal))
			})

			await allure.step('В поле поиска отображается выбранный запрос', async () => {
				const inputValue = await dataSourcePage.getInputValue()

				expect(inputValue).toMatch(/^message:.*error$/)
			})
		})
	})

	test.describe('Query-параметры в дашбордах', () => {
		let copiedURL: string
		let dashboardName: string

		test.beforeEach(async ({ page }) => {
			await allure.story('Query-параметры в дашбордах')
			const dataSourcePage = new DataSourcePage(page)
			const dashboardsPage = new DashboardsPage(page)

			await allure.step('Открываем вкладку "Дашборды" и закрываем всплывающее окно', async () => {
				await dataSourcePage.openTabByName(DASHBOARDS_TAB)
				await dashboardsPage.dashboardsLibrary.closeLibraryPopup()
			})

			await allure.step('Отправляем поисковый запрос и открываем модалку выбора временного периода', async () => {
				await dataSourcePage.searchMessage('message: error')
				await dataSourcePage.openCloseDateTimePicker()
			})

			await allure.step(`Передаём в модалку относительного интервала значение ${LAST_15_MINUTES}`, async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.selectDuration(LAST_15_MINUTES)
				await dataSourcePage.selectIntervalModal.saveModal()
			})

			await allure.step('Сохраняем дашборд', async () => {
				dashboardName = await dashboardsPage.saveDashboard()

				await page.waitForTimeout(1000)
				copiedURL = page.url()
			})

			await allure.step('Переходим по ссылке из URL', async () => {
				await page.goto(copiedURL)
			})
		})

		test('В query дашборда корректно подставляются значения фильтров', async ({ page }) => {
			await allure.id('4617971')

			const QUERY_1_HOUR = '?rangetype=relative&from=3600'
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Открываем модалку выбора интервала', async () => {
				await dataSourcePage.openCloseDateTimePicker()
			})

			await allure.step(`Передаём в модалку относительного интервала значение ${LAST_HOUR}`, async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.selectDuration(LAST_HOUR)
				await dataSourcePage.selectIntervalModal.saveModal()
			})
			await allure.step('В query отображаются верные значения', async () => {
				await page.waitForTimeout(1000)
				const queryValue = await dataSourcePage.getURLQuery()

				expect(queryValue).toBe(QUERY_1_HOUR)
			})

		})

		test.afterEach(async ({ page }) => {
			await allure.step('Удаляем дашборд', async () => {
				const dataSourcePage = new DataSourcePage(page)
				const dashboardsPage = new DashboardsPage(page)

				await dataSourcePage.openTabByName(DASHBOARDS_TAB)
				await dashboardsPage.dashboardsLibrary.removeDashboard(dashboardName)
			})
		})
	})
})
