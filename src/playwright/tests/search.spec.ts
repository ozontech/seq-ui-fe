import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

const OPERATOR_AND = 'AND'
const OPERATOR_OR = 'OR'
const OPERATOR_NOT = 'NOT'

test.describe('Подсказки в поиске', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Поиск')
		await allure.feature('Подсказки в поиске')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-103')

		await page.goto(baseURL as string)
	})

	test.describe('Содержание подсказок', () => {
		test.beforeEach(async () => {
			await allure.story('Содержание подсказок')
		})

		test('После ввода в поиск буквы m первые 10 подсказок в выпадающем списке начинаются с буквы m', async ({ page }) => {
			await allure.id('4437334')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('m')
			})

			await allure.step('Первые 10 хинтов начинаются с "m"', async () => {
				const suggestions = await dataSourcePage.getSuggestions(10)

				suggestions.forEach((item: string) => expect(item.startsWith('m')).toBeTruthy())
			})
		})

		test('После ввода в поиск слова message подсказки в выпадающем списке содержат слово message', async ({ page }) => {
			await allure.id('4437335')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message')
			})

			await allure.step('Первые 10 хинтов начинаются с "m"', async () => {
				const suggestions = await dataSourcePage.getSuggestions(10)

				suggestions.forEach((item: string) => expect(item).toMatch(new RegExp('message', 'i')))
			})
		})
	})

	test.describe('Выбор подсказок', () => {
		test.beforeEach(async () => {
			await allure.story('Выбор подсказок')
		})

		test('Выбор подсказки стрелками и нажатием клавиши Enter', async ({ page }) => {
			await allure.id('4450658')

			const dataSourcePage = new DataSourcePage(page)
			let suggestionText: string

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message')
				await dataSourcePage.autocompleteItem.nth(0).waitFor({ state: 'visible' })
			})

			await allure.step('Выбираем запрос стрелками и Enter', async () => {
				suggestionText = await dataSourcePage.getSuggestionText(4)
				await dataSourcePage.selectDropdownItemByKeyboard(4)
			})

			await allure.step('В поле поиска отображается выбранный запрос', async () => {
				const inputValue = await dataSourcePage.getInputValue()

				expect(inputValue).toContain(`${suggestionText}:""`)
			})
		})

		test('Выбор подсказки курсором', async ({ page }) => {
			await allure.id('4450662')

			const dataSourcePage = new DataSourcePage(page)
			let suggestionText: string

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message')
			})

			await allure.step('Выбираем запрос курсором', async () => {
				suggestionText = await dataSourcePage.getSuggestionText(4)
				await dataSourcePage.selectDropdownItemByMouse(suggestionText)
			})

			await allure.step('В поле поиска отображается выбранный запрос', async () => {
				const inputValue = await dataSourcePage.getInputValue()

				expect(inputValue).toContain(`${suggestionText}:""`)
			})
		})
	})

	test.describe('Подсказки операторов', () => {
		test.beforeEach(async () => {
			await allure.story('Подсказки операторов')
		})

		test('Появление подсказок операторов', async ({ page }) => {
			await allure.id('4450661')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error ')
			})

			await allure.step('Появились подсказки операторов', async () => {
				const suggestionsArray = await dataSourcePage.getSuggestionsArray()
				const expectedArray = [OPERATOR_AND, OPERATOR_OR, OPERATOR_NOT]

				expectedArray.forEach((item: string) => expect(suggestionsArray).toContain(item))
			})
		})

		test(`Ввод оператора ${OPERATOR_AND}: подсказка ${OPERATOR_NOT} отображается`, async ({ page }) => {
			await allure.id('4450655')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error AND NOT')
			})

			await allure.step('Нужный хинт присутствует', async () => {
				const suggestion = await dataSourcePage.getSuggestionInList(OPERATOR_NOT)

				await expect(suggestion).toBeVisible()
			})
		})

		test('Появление подсказок после ввода оператора', async ({ page }) => {
			await allure.id('4490453')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error AND ')
			})

			await allure.step('Появились подсказки', async () => {
				const suggestionsArray = await dataSourcePage.getSuggestionsArray()

				expect(suggestionsArray.length).toBeGreaterThan(0)
			})
		})

		test(`Ввод оператора ${OPERATOR_AND}: подсказка ${OPERATOR_AND} не отображается`, async ({ page }) => {
			await allure.id('4450660')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error AND AN')
			})

			await allure.step('Хинт отсутствует', async () => {
				const suggestion = await dataSourcePage.getSuggestionInList(OPERATOR_NOT)

				await expect(suggestion).not.toBeVisible()
			})
		})

		test(`Ввод оператора ${OPERATOR_AND}: подсказка ${OPERATOR_OR} не отображается`, async ({ page }) => {
			await allure.id('4450650')
			await allure.tag('NEGATIVE')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error AND O')
			})

			await allure.step('Хинт отсутствует', async () => {
				const suggestion = await dataSourcePage.getSuggestionInList(OPERATOR_NOT)

				await expect(suggestion).not.toBeVisible()
			})
		})

		test(`Ввод оператора ${OPERATOR_OR}: подсказка ${OPERATOR_NOT} отображается`, async ({ page }) => {
			await allure.id('4450654')
			test.skip(true, 'ожидается рефакторинг поиска на фронте')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error OR NOT')
			})

			await allure.step('Хинт присутствует', async () => {
				const suggestion = await dataSourcePage.getSuggestionInList(OPERATOR_NOT)

				await expect(suggestion).toBeVisible()
			})
		})

		test(`Ввод оператора ${OPERATOR_OR}: подсказка ${OPERATOR_AND} не отображается`, async ({ page }) => {
			await allure.id('4450652')
			await allure.tag('NEGATIVE')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error OR AN')
			})

			await allure.step('Хинт отсутствует', async () => {
				const suggestion = await dataSourcePage.getSuggestionInList(OPERATOR_NOT)

				await expect(suggestion).not.toBeVisible()
			})
		})

		test(`Ввод оператора ${OPERATOR_OR}: подсказка ${OPERATOR_OR} не отображается`, async ({ page }) => {
			await allure.id('4450653')
			await allure.tag('NEGATIVE')

			test.skip(true, 'ожидается рефакторинг поиска на фронте')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error OR O')
			})

			await allure.step('Хинт отсутствует', async () => {
				const suggestion = await dataSourcePage.getSuggestionInList(OPERATOR_NOT)

				await expect(suggestion).not.toBeVisible()
			})
		})
	})

	test.describe('Плейсхолдеры в поиске', () => {
		test.beforeEach(async () => {
			await allure.story('Плейсхолдеры в поиске')
		})

		test('Проверка плейсхолдера поля ввода', async ({ page }) => {
			await allure.id('4450651')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Плейсхолдер с нужным текстом отображается в поле ввода', async () => {
				const placeholder = await dataSourcePage.getPlaceholder('message:error AND zone:Z501')

				await expect(placeholder).toBeVisible()
			})
		})
	})

	test.describe('Подсказки под кнопкой лампочки', () => {
		test.beforeEach(async () => {
			await allure.story('Подсказки под кнопкой лампочки')
		})

		test('Появление подсказок после нажатия на кнопку лампочки', async ({ page }) => {
			await allure.id('4481998')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Нажимаем на кнопку подсказок', async () => {
				await dataSourcePage.openTooltipsList()
			})

			await allure.step('Список подсказок отображается', async () => {
				await expect(dataSourcePage.suggestionItem.nth(0)).toBeVisible()
			})
		})
	})
})
