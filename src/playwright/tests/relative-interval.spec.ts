import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import {
	DAYS,
	DECREMENT,
	HOURS,
	INCREMENT,
	LAST_15_MINUTES,
	LAST_DAY,
	LAST_HOUR,
	LAST_WEEK,
	MINUTES,
	SECONDS,
	WEEKS,
} from '~/playwright/consts/intervals.consts'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

test.describe('Выбор относительного интервала', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Поиск')
		await allure.feature('Выбор относительного интервала')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-103')

		const dataSourcePage = new DataSourcePage(page)

		await page.goto(baseURL as string)
		await dataSourcePage.openCloseDateTimePicker()
	})

	test.describe('Ручной ввод в модалке относительного интервала', () => {
		test.beforeEach(async ({ page }) => {
			await allure.story('Ручной ввод в модалке относительного интервала')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Очищаем поле ввода модалки', async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.clearDurationField()
			})
		})

		test('Ручной ввод валидного относительного интервала в модалке', async ({ page }) => {
			await allure.id('4542849')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим значения и сохраняем модалку', async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.fillDurationField('111')
				await dataSourcePage.selectIntervalModal.relativeModal.selectTimeUnit('секунд')
				await dataSourcePage.selectIntervalModal.saveModal()
			})

			await allure.step('Значение в поле выбора интервала должно быть "последние 111 секунд"', async () => {
				// возвращается склеенное значение, т.к. состоит из нескольких локаторов
				expect(await dataSourcePage.dateTimeInterval.textContent()).toContain('последние111 секунд')
			})

			await allure.step('Интервал передан в query', async () => {
				const query = await dataSourcePage.getURLQuery()

				expect(query).toBe('?rangetype=relative&from=111')
			})
		})

		test('Ввод невалидных символов в модалке относительного интервала', async ({ page }) => {
			await allure.id('4557085')
			await allure.tag('NEGATIVE')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Ввести латинские символы в инпут', async () => {
				const latinCharactersSet = 'Hello'
				await dataSourcePage.selectIntervalModal.relativeModal.fillDurationField(latinCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()

				expect(value).toEqual('')
			})

			await allure.step('Ввести кириллицу в инпут', async () => {
				const cyrillicCharactersSet = 'Привет'
				await dataSourcePage.selectIntervalModal.relativeModal.fillDurationField(cyrillicCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()

				expect(value).toEqual('')
			})

			await allure.step('Ввести спецсимволы в инпут', async () => {
				const specialCharactersSet = '!@#$%^&*()_-=+"№;%:?[]{}|\\/\''
				await dataSourcePage.selectIntervalModal.relativeModal.fillDurationField(specialCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()

				expect(value).toEqual('')
			})
			await allure.step('Ввести 0 в инпут', async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.fillDurationField('0')
			})

			await allure.step('Значение в поле выбора интервала должно быть "1', async () => {
				const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()

				expect(value).toEqual('1')
			})
		})

		test('Доступные единицы времени', async ({ page }) => {
			await allure.id('4542846')

			const dataSourcePage = new DataSourcePage(page)
			let items: string[]

			await allure.step('Открываем список доступных единиц времени', async () => {
				items = await dataSourcePage.selectIntervalModal.relativeModal.getTimeUnits()
			})

			await allure.step(`Доступные значения: ${SECONDS}, ${MINUTES}, ${HOURS}, ${DAYS}, ${WEEKS}`, async () => {
				const units = [SECONDS, MINUTES, HOURS, DAYS, WEEKS]

				units.forEach((unit: string) => expect(items).toContain(unit))
			})
		})
	})

	test.describe('Работа кнопок +/- в модалке относительного интервала', () => {
		test.beforeEach(async () => {
			await allure.story('Работа кнопок +/- в модалке относительного интервала')
		})

		test('Увеличение и уменьшение интервала кнопками плюс/минус', async ({ page }) => {
			await allure.id('4565526')

			const dataSourcePage = new DataSourcePage(page)
			const count = 3

			await allure.step(`Увеличиваем значение в модалке относительного интервала кнопкой "+" на ${count}`, async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.changeValue(INCREMENT, 3)
			})

			await allure.step('Значение в поле выбора интервала должно быть "8"', async () => {
				const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()

				expect(value).toEqual('8')
			})

			await allure.step(`Уменьшаем значение в модалке относительного интервала кнопкой "-" на ${count}`, async () => {
				await dataSourcePage.selectIntervalModal.relativeModal.changeValue(DECREMENT, 3)
			})

			await allure.step('Значение в поле выбора интервала должно быть "5"', async () => {
				const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()

				expect(value).toEqual('5')
			})
		})
	})

	test.describe('Предустановленные интервалы в модалке выбора относительного интервала', () => {
		test.beforeEach(async () => {
			await allure.story('Предустановленные интервалы в модалке выбора относительного интервала')
		})

		const testCases = [
			{ id: '4542848', buttonValue: LAST_15_MINUTES, intervalValue: '15 минут', seconds: 900 },
			{ id: '4542851', buttonValue: LAST_HOUR, intervalValue: '1 час', seconds: 3600 },
			{ id: '4542850', buttonValue: LAST_DAY, intervalValue: '1 день', seconds: 86400 },
			{ id: '4542847', buttonValue: LAST_WEEK, intervalValue: '1 неделя', seconds: 604800 },
		]

		testCases.forEach((testCase) => {
			test(`Выбор интервала ${testCase.buttonValue}`, async ({ page }) => {
				await allure.id(testCase.id)

				const dataSourcePage = new DataSourcePage(page)

				await allure.step(`Выбираем кнопку интервала ${testCase.buttonValue}`, async () => {
					await dataSourcePage.selectIntervalModal.relativeModal.selectDuration(testCase.buttonValue)
				})

				await allure.step('В фильтре отображается значение "15 минут"', async () => {
					const value = await dataSourcePage.selectIntervalModal.relativeModal.durationInput.inputValue()
					const item = await dataSourcePage.selectIntervalModal.relativeModal.getDurationItem()

					expect(`${value} ${item}`).toEqual(testCase.intervalValue)
				})

				await allure.step('Интервал передан в query после сохранения формы', async () => {
					await dataSourcePage.selectIntervalModal.saveModal()
					const query = await dataSourcePage.getURLQuery()

					expect(query).toBe(`?rangetype=relative&from=${testCase.seconds}`)
				})
			})
		})
	})
})