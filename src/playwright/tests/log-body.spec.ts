import { expect, test } from '@fe/pw-config'
import type { Page } from '@fe/pw-config'
import { allure } from 'allure-playwright'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { LogBody } from '~/playwright/pages/components/log-body'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

const ONE_SECOND = '1 second'
const FIVE_SECONDS = '5 seconds'
const TEN_SECONDS = '10 seconds'
const THIRTY_SECONDS = '30 seconds'
const ONE_MINUTE = '1 minute'
const FIVE_MINUTES = '5 minutes'

test.describe('Тело лога', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Таблица логов')
		await allure.feature('Тело лога')
		await allure.label('page', 'вкладка "Таблица логов"')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-104')

		dayjs.extend(customParseFormat)

		await page.addInitScript(() => {
			const data = { text: '' }

			Object.assign(navigator, {
				clipboard: {
					writeText: async (text: string) => { data.text = text },
					readText: async () => data.text,
				},
			})
		})

		await page.goto(baseURL as string)
	})

	test.describe('Копирование ссылки в теле лога', async () => {
		test.beforeEach(async () => {
			await allure.story('Копирование ссылки в теле лога')
		})
		test('Работа кнопки "Copy permalink"', async ({ page, browserName, context }) => {
			await allure.id('4579398')

			if (browserName === 'firefox') test.skip(true, 'В Firefox нет доступа к буферу обмена')

			await context.grantPermissions(['clipboard-read', 'clipboard-write'])

			const dataSourcePage = new DataSourcePage(page)
			const logBody = new LogBody(page)
			let copiedURL: string
			const oldArr: string[] = []

			await allure.step('Вводим поисковый запрос и открываем первую запись', async () => {
				await dataSourcePage.searchMessage('message: error')
				await dataSourcePage.openLogItem(0)
			})
			await allure.step('Записываем данные лога на исходной странице', async () => {
				const rowsCount = await logBody.messageBodyRow.count()
				expect(rowsCount).toBeGreaterThan(0)
				// первые 4 поля идут в разном порядке на основной странице и по ссылке, но они всё равно есть в messageBodyRow
				for (let i = 4; i < rowsCount; i++) {
					oldArr.push(await logBody.messageBodyRow.nth(i).textContent() as string)
				}
			})

			await allure.step('Копируем данные кнопкой "Copy permalink"', async () => {
				await logBody.copyPermalink()
			})

			await allure.step('Данные в новой вкладке идентичны исходным', async () => {
				const newArr = []

				copiedURL = await page.evaluate(async () => {
					return await navigator.clipboard.readText()
				})

				await page.goto(copiedURL)

				await expect(logBody.messageBodyRow.first()).toBeVisible()

				const rowsCountNew = await logBody.messageBodyRow.count()
				expect(rowsCountNew).toBeGreaterThan(0)

				for (let j = 4; j < rowsCountNew; j++) {
					newArr.push(await logBody.messageBodyRow.nth(j).textContent())
				}

				expect(oldArr).toEqual(newArr)
			})
		})
	})

	test.describe('Открытие ссылки в новой вкладке', async () => {
		test.beforeEach(async () => {
			await allure.story('Открытие ссылки в новой вкладке')
		})

		test('Работа кнопки "Open in new tab"', async ({ page, context }) => {
			await allure.id('4588644')
			const dataSourcePage = new DataSourcePage(page)
			const logBody = new LogBody(page)
			const oldFields: string[] = []
			const newFields: string[] = []

			await allure.step('Вводим поисковый запрос и открываем первую запись', async () => {
				await dataSourcePage.searchMessage('message: error')
				await dataSourcePage.openLogItem(0)
			})

			await allure.step('Записываем данные лога на исходной странице', async () => {
				const rowsCount = await logBody.messageBodyRow.count()
				expect(rowsCount).toBeGreaterThan(0)
				// первые 4 поля идут в разном порядке на основной странице и по ссылке, но они всё равно есть в messageBodyRow
				for (let i = 4; i < rowsCount; i++) {
					oldFields.push(await logBody.messageBodyRow.nth(i).textContent() as string)
				}
			})

			await allure.step('Открываем лог в новой вкладке', async () => {
				const pageListener = async (page: Page) => {
					const logBodyNew = new LogBody(page)

					await expect(logBodyNew.messageBodyRow.first()).toBeVisible()
					const rowsCount = await logBodyNew.messageBodyRow.count()
					expect(rowsCount).toBeGreaterThan(0)

					for (let i = 4; i < rowsCount; i++) {
						newFields.push(await logBodyNew.messageBodyRow.nth(i).textContent() as string)
					}
				}

				const [newPage] = await Promise.all([
					context.waitForEvent('page'),
					logBody.openLogInNewTab(),
				])
				await pageListener(newPage)
			})

			await allure.step('Поля лога в новой вкладке идентичны исходным', async () => {
				expect(oldFields).toEqual(newFields)
			})
		})
	})

	test.describe('Работа кнопки "Show surrounding messages"', async () => {
		const testCases = [
			{ period: ONE_SECOND, allureId: '4596790', count: 1, item: 'second' },
			{ period: FIVE_SECONDS, allureId: '4601130', count: 5, item: 'second' },
			{ period: TEN_SECONDS, allureId: '4601132', count: 10, item: 'second' },
			{ period: THIRTY_SECONDS, allureId: '4601128', count: 30, item: 'second' },
			{ period: ONE_MINUTE, allureId: '4601131', count: 1, item: 'minute' },
			{ period: FIVE_MINUTES, allureId: '4601127', count: 5, item: 'minute' },
		]

		test.beforeEach(async ({ page }) => {
			await allure.story('Show surrounding messages')
		})

		testCases.forEach((testCase) => {
			test(`Выбор периода ${testCase.period}`, async ({ page, context }) => {
				await allure.id(testCase.allureId)
				const dataSourcePage = new DataSourcePage(page)
				const logBody = new LogBody(page)
				let dateTimeBefore: Dayjs
				let dateTimeAfter: Dayjs
				let checkFirstLog: (page: Page) => Promise<void>
				let checkLastLog: (page: Page) => Promise<void>

				await allure.step('Вводим поисковый запрос и открываем первую запись', async () => {
					await dataSourcePage.searchMessage('message: error')
					await dataSourcePage.openLogItem(0)
				})

				await allure.step('Нажимаем кнопку "Open surrounding messages"', async () => {
					await logBody.openSurroundingMessages()
					await expect(logBody.dropdownList).toBeVisible()
				})

				await allure.step(`Записываем дату и время исходного лога, а также на ${testCase.period} больше и меньше`, async () => {
					const originalDateTime = await dataSourcePage.getDateTime()

					dateTimeBefore = originalDateTime.subtract(testCase.count, testCase.item as dayjs.ManipulateType)
					dateTimeAfter = originalDateTime.add(testCase.count, testCase.item as dayjs.ManipulateType)
				})

				await allure.step('Проверяем, что в новой вкладке корректно отображается временной интервал и периоды в первом логе', async () => {
					checkFirstLog = async (page: Page) => {
						const dataSourcePageNew = new DataSourcePage(page)
						const actualInterval = (await dataSourcePageNew.dateTimeInterval.textContent() as string).replace(/UTC$/, '')
						expect(actualInterval).toBe(`${dateTimeBefore.format('DD.MM.YYYYHH:mm:ss')} - ${dateTimeAfter.format('DD.MM.YYYYHH:mm:ss')}`)

						// у первого лога проверяем, что он не позже верхней границы периода
						const firstLogDateTime = dayjs(`${await dataSourcePageNew.rowItemDate.nth(0).textContent()} ${await dataSourcePageNew.rowItemTime.nth(0).textContent()}`, 'YYYY-MM-DD HH:mm:ss', true)
						expect(firstLogDateTime.isAfter(dateTimeAfter)).toBeFalsy()
					}
				})
				await allure.step('Проверяем, что в новой вкладке корректно отображается временной интервал и периоды в последнем логе', async () => {
					checkLastLog = async (page: Page) => {
						const dataSourcePageNew = new DataSourcePage(page)

						// включаем пагинацию и открываем последнюю страницу
						await dataSourcePageNew.changePaginationMode()
						await dataSourcePageNew.openLastPage()

						// у последнего лога проверяем, что он не раньше нижней границы периода
						const lastLogDateTime = dayjs(`${await dataSourcePageNew.rowItemDate.last().textContent()} ${await dataSourcePageNew.rowItemTime.last().textContent()}`, 'YYYY-MM-DD HH:mm:ss', true)
						expect(lastLogDateTime.isBefore(dateTimeBefore)).toBeFalsy()
					}
				})
				await allure.step('Открываем период в новой вкладке и выполняем проверку', async () => {
					const [newPage] = await Promise.all([
						context.waitForEvent('page'),
						await dataSourcePage.openDropdownItem(testCase.period),
					])
					await checkFirstLog(newPage)
					await checkLastLog(newPage)
				})
			})
		})
	})
})