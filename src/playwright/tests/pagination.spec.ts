import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import {
	PAGINATION_NEXT_PAGE,
	PAGINATION_PREV_PAGE,
} from '~/playwright/consts/table.consts'
import { DECREMENT } from '~/playwright/consts/intervals.consts'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

const MESSAGES_COUNT_ON_ONE_PAGE = 100
const FEW_PAGES_DOWN_PIXELS_COUNT = 20000

test.describe('Пагинация', () => {
	test.beforeEach(async () => {
		await allure.epic('Таблица логов')
		await allure.feature('Пагинация')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREUI-133')
	})

	test.describe('Включение и выключение пагинация', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			await page.goto(baseURL as string)
			await allure.story('Включение и выключение пагинация')
		})

		test('Пагинация отключена по умолчанию', async ({ page }) => {
			await allure.id('3094560')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Поле с элементами управления пагинацией скрыто', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeHidden()
			})

			await allure.step('Тогл пагинации выключен', async () => {
				await expect(dataSourcePage.paginationCheckbox).toBeVisible()
				await expect(dataSourcePage.paginationCheckbox).not.toBeChecked()
			})
		})

		test('Включение пагинации', async ({ page }) => {
			await allure.id('3092340')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Включить пагинацию нажатием на тогл', async () => {
				await dataSourcePage.changePaginationMode()
			})

			await allure.step('Появилось поле с элементами управления пагинацией', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeVisible()
			})

			await allure.step('Появился инпут для ввода номера страницы', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toBeVisible()
				await expect(dataSourcePage.paginationPageNumberInput).toBeVisible()
			})

			await allure.step(`В таблице сообщений [${MESSAGES_COUNT_ON_ONE_PAGE}] строк`, async () => {
				const messagesCount = await dataSourcePage.getMessagesCount()

				expect(messagesCount).toEqual(MESSAGES_COUNT_ON_ONE_PAGE)
				await expect(page).toHaveURL(new RegExp('page=1'))
			})
		})

		test('Отключение пагинации', async ({ page }) => {
			await allure.id('3159314')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Включить пагинацию нажатием на тогл', async () => {
				await dataSourcePage.changePaginationMode()
			})

			await allure.step('Появилось поле с элементами управления пагинацией', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeVisible()
			})

			await allure.step('Появился инпут для ввода номера страницы', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toBeVisible()
			})

			await allure.step('Отключить пагинацию нажатием на тогл', async () => {
				await dataSourcePage.changePaginationMode()
			})

			await allure.step('Поле с элементами управления пагинацией пропало', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeHidden()
			})

			await allure.step('Инпут для ввода номера страницы пропал', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toBeHidden()
			})
		})
	})

	test.describe('Переключение страниц с помощью input', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			const dataSourcePage = new DataSourcePage(page)
			await allure.story('Перемещение между страницами с помощью input')

			await allure.step('Включить пагинацию', async () => {
				await page.goto(baseURL as string)
				await dataSourcePage.changePaginationMode()
				await page.waitForLoadState('domcontentloaded')
			})
		})

		test('Включение пагинации', async ({ page }) => {
			await allure.id('3092340')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Появилось поле с элементами управления пагинацией', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeVisible()
			})

			await allure.step('Появился инпут для ввода номера страницы', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toBeVisible()
			})

			await allure.step(`В таблице сообщений [${MESSAGES_COUNT_ON_ONE_PAGE}] строк`, async () => {
				await dataSourcePage.getMessagesCount()
			})

			await allure.step('Проверяем, что в url появилась пагинация', async () => {
				await expect(page).toHaveURL(new RegExp('page=1'))
			})
		})

		test('Отключение пагинации', async ({ page }) => {
			await allure.id('4395605')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Появилось поле с элементами управления пагинацией', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeVisible()
			})

			await allure.step('Появился инпут для ввода номера страницы', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toBeVisible()
			})

			await allure.step('Отключить пагинацию нажатием на тогл', async () => {
				await dataSourcePage.changePaginationMode()
			})

			await allure.step('Поле с элементами управления пагинацией пропало', async () => {
				await expect(dataSourcePage.paginationNumbersBlock).toBeHidden()
			})

			await allure.step('Инпут для ввода номера страницы пропал', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toBeHidden()
			})
		})
	})

	test.describe('Переключение страниц с помощью input', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			const dataSourcePage = new DataSourcePage(page)
			await allure.story('Перемещение между страницами с помощью input')

			await allure.step('Включить пагинацию', async () => {
				await page.goto(baseURL as string)
				await dataSourcePage.changePaginationMode()
			})
		})

		test('Ввод числа в инпут', async ({ page }) => {
			await allure.id('3092338')
			const dataSourcePage = new DataSourcePage(page)
			const testPageNumber = '10'
			let firstRowContent: string
			let newFirstRowContent: string

			await allure.step('Записываем содержание первой и последней страниц', async () => {
				firstRowContent = await dataSourcePage.getFirstMessageContent()
				await dataSourcePage.goToPageWithInput(testPageNumber)
				newFirstRowContent = await dataSourcePage.getFirstMessageContent()
			})

			await allure.step('Первая строка в таблице изменилась', async () => {
				expect(firstRowContent).not.toEqual(newFirstRowContent)
			})

			await allure.step(`Кнопка с номером страницы [${testPageNumber}] появилась на панели пагинации`, async () => {
				const pageButton = await dataSourcePage.getPageButtonByNumber(testPageNumber)

				await expect(pageButton).toBeVisible()

			})

		})

		test('Ввод числа равного номеру последней страницы', async ({ page }) => {
			test.slow()
			await allure.id('3094559')
			const dataSourcePage = new DataSourcePage(page)
			let firstRowContent: string
			let newFirstRowContent: string
			let lastPageNumber = ''

			await allure.step('Выключаем пагинацию', async () => {
				await page.waitForLoadState('networkidle')
				await dataSourcePage.changePaginationMode()
			})

			await allure.step('Вводим запрос', async () => {
				await dataSourcePage.searchTextArea.pressSequentially('message:error')
			})

			await allure.step('В модалке выбора интервала уменьшаем интервал до 1 и сохраняем модалку', async () => {
				await dataSourcePage.openCloseDateTimePicker()
				await dataSourcePage.selectIntervalModal.relativeModal.changeValue(DECREMENT, 4)
				await dataSourcePage.selectIntervalModal.saveModal()
			})

			await allure.step('Включаем пагинацию', async () => {
				await dataSourcePage.changePaginationMode()
			})

			await allure.step('Считываем контент из первого сообщения', async () => {
				firstRowContent = await dataSourcePage.getFirstMessageContent()
			})

			await allure.step('Переходим на последнюю страницу', async () => {
				lastPageNumber = await dataSourcePage.getButtonText(5)
				await dataSourcePage.goToPageWithInput(lastPageNumber)
			})

			await allure.step('Считываем контент из первого сообщения', async () => {
				newFirstRowContent = await dataSourcePage.getFirstMessageContent()
			})

			await allure.step('Первая строка в таблице изменилась', async () => {
				expect(firstRowContent).not.toEqual(newFirstRowContent)
			})

			await allure.step(`Кнопка с номером страницы [${lastPageNumber}] присутствует на панели пагинации`, async () => {
				const pageButton = await dataSourcePage.getPageButtonByNumber(lastPageNumber)

				await expect(pageButton).toBeVisible()
			})

			await allure.step('Кнопка "Следующая страница" неактивна', async () => {
				await expect(dataSourcePage.paginationNextButton).toHaveAttribute('disabled')
			})
		})

		test('Ввод числа "0"', async ({ page }) => {
			await allure.id('3094561')
			await allure.tag('NEGATIVE')
			await allure.issue('SREUI-148', 'https://jit.o3.ru/browse/SREUI-148')

			test.skip(true, 'Ждём пока исправят баг https://jit.o3.ru/browse/SREUI-148')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Ввести число [0] в инпут', async () => {
				await dataSourcePage.paginationPageNumberInput.fill('0')
			})

			await allure.step('Нельзя ввести [0], проверяем что поле остаётся пустым', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toHaveValue('')
			})
		})

		test('Ввод числа больше, чем номер последней страницы', async ({ page }) => {
			await allure.id('3127880')
			await allure.tag('NEGATIVE')

			const dataSourcePage = new DataSourcePage(page)
			const lastPageNumber = await dataSourcePage.getButtonText(5)
			const lastPageNumberPlusOne = String(Number(lastPageNumber) + 1)
			const lastPageNumberSlicedLastDigit = lastPageNumberPlusOne.slice(0, lastPageNumberPlusOne.length - 1)

			await allure.step('Вввести в инпут номер страницы на 1 больше максимального', async () => {
				await dataSourcePage.paginationPageNumberInput.pressSequentially(lastPageNumberPlusOne)
			})

			await allure.step('Проверяем, что инпут не позволил ввести последнюю цифру', async () => {
				await expect(dataSourcePage.paginationPageNumberInput).toHaveValue(lastPageNumberSlicedLastDigit)
			})
		})

		test('Ввод невалидных символов в инпут', async ({ page }) => {
			await allure.id('3127879')
			await allure.tag('NEGATIVE')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Ввести латинские символы в инпут', async () => {
				const latinCharactersSet = 'Hello'
				await dataSourcePage.paginationPageNumberInput.pressSequentially(latinCharactersSet)
			})

			await allure.step('Проверяем что поле остаётся пустым', async () => {
				const input = await dataSourcePage.paginationPageNumberInput.inputValue()

				expect(input).toEqual('')
			})

			await allure.step('Ввести кириллицу в инпут', async () => {
				const cyrillicCharactersSet = 'Привет'
				await dataSourcePage.paginationPageNumberInput.pressSequentially(cyrillicCharactersSet)
			})

			await allure.step('Проверяем что поле остаётся пустым', async () => {
				const input = await dataSourcePage.paginationPageNumberInput.inputValue()

				expect(input).toEqual('')
			})

			await allure.step('Ввести спецсимволы в инпут', async () => {
				const specialCharactersSet = '!@#$%^&*()_-=+"№;%:?[]{}|\\/\''
				await dataSourcePage.paginationPageNumberInput.pressSequentially(specialCharactersSet)
			})

			await allure.step('Проверяем что поле остаётся пустым', async () => {
				const input = await dataSourcePage.paginationPageNumberInput.inputValue()

				expect(input).toEqual('')
			})
		})
	})

	test.describe('Переключение страниц с помощью стрелок', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			await allure.story('Переключение страниц с помощью стрелок')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Включить пагинацию', async () => {
				await page.goto(baseURL as string)
				await dataSourcePage.changePaginationMode()
			})
		})

		test('Переключить страницу используя стрелку "Вправо"', async ({ page }) => {
			await allure.id('3092339')

			const dataSourcePage = new DataSourcePage(page)
			const testPageNumber = '2'
			//изначально находимся на 1-й странице
			await allure.step('Кнопка "Предыдущая страница" неактивна', async () => {
				await expect(dataSourcePage.paginationPrevButton).toHaveAttribute('disabled')
			})

			await allure.step('Нажать на стрелку "Вправо"', async () => {
				await dataSourcePage.clickArrowButton(PAGINATION_NEXT_PAGE)
			})

			await allure.step('Проверяем, что перешли на следующую страницу', async () => {
				const pageButton = await dataSourcePage.getPageButtonByNumber(testPageNumber)

				await expect(pageButton).toHaveAttribute('disabled')
				await expect(page).toHaveURL(new RegExp(`page=${testPageNumber}`))
			})

			await allure.step('Кнопка "Предыдущая страница" активна', async () => {
				await expect(dataSourcePage.paginationPrevButton).not.toHaveAttribute('disabled')
			})
		})

		test('Переключить страницу используя стрелку "Влево"', async ({ page }) => {
			await allure.id('3092335')
			const testPageNumber = 10
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Переходим на страницу 10', async () => {
				await dataSourcePage.goToPageWithInput(String(testPageNumber))
			})

			await allure.step('Нажать на стрелку "Влево"', async () => {
				await dataSourcePage.clickArrowButton(PAGINATION_PREV_PAGE)
			})

			await allure.step('Проверяем, что перешли на предыдущую страницу', async () => {
				await expect(page).toHaveURL(new RegExp(`page=${testPageNumber - 1}`))
				const pageButton = await dataSourcePage.getPageButtonByNumber(`${testPageNumber - 1}`)

				await expect(pageButton).toHaveAttribute('disabled')
			})
		})
	})

	test.describe('Переключение страниц с помощью цифр в панели пагинации', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			await allure.story('Переключение страниц с помощью цифр в панели пагинации')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Включить пагинацию', async () => {
				await page.goto(baseURL as string)
				await dataSourcePage.changePaginationMode()
			})
		})

		test('Переключиться на страницу используя цифры в панели пагинации', async ({ page }) => {
			await allure.id('3092336')
			const dataSourcePage = new DataSourcePage(page)
			const testPageNumber = '3'
			const firstRowContent = await dataSourcePage.getFirstMessageContent()

			await allure.step(`Нажать на цифру ${testPageNumber} для переключения страницы`, async () => {
				await dataSourcePage.clickToPageNumber(testPageNumber)
			})

			await allure.step('Первая строка в таблице изменилась', async () => {
				await page.waitForResponse('**/seqapi/v1/search*')
				const newFirstRowContent = await dataSourcePage.getFirstMessageContent()

				expect(firstRowContent).not.toEqual(newFirstRowContent)
			})

			await allure.step('Проверяем переход на страницу', async () => {
				await expect(page).toHaveURL(new RegExp(`page=${testPageNumber}`))
				const pageButton = await dataSourcePage.getPageButtonByNumber(testPageNumber)

				await expect(pageButton).toHaveAttribute('disabled')
			})
		})
	})

	test.describe('Отсутствие бесконечного скролла', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			await allure.story('Отсутствие бесконечного скролла')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Отправляем поисковый запрос', async () => {
				await page.goto(baseURL as string)
				await dataSourcePage.searchMessage('message:error')
			})
		})

		test('При включении пагинации отключается бесконечный скролл', async ({ page }) => {
			await allure.id('3159315')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step(`В таблице сообщений [${MESSAGES_COUNT_ON_ONE_PAGE}] строк`, async () => {
				const messagesCount = await dataSourcePage.getMessagesCount()

				expect(messagesCount).toEqual(MESSAGES_COUNT_ON_ONE_PAGE)
			})

			await allure.step(`Скролим на [${FEW_PAGES_DOWN_PIXELS_COUNT}] пикселей вниз`, async () => {
				const dataSourcePage = new DataSourcePage(page)
				await dataSourcePage.scrollPage(FEW_PAGES_DOWN_PIXELS_COUNT)
			})

			await allure.step(`В таблице сообщений строк больше чем [${MESSAGES_COUNT_ON_ONE_PAGE}]`, async () => {
				const messagesCount = await dataSourcePage.getMessagesCount()

				expect(messagesCount).toBeGreaterThan(MESSAGES_COUNT_ON_ONE_PAGE)
			})

			await allure.step('Включить пагинацию', async () => {
				await dataSourcePage.changePaginationMode()
				await page.waitForResponse('**/seqapi/v1/search*')
			})

			await allure.step(`В таблице сообщений [${MESSAGES_COUNT_ON_ONE_PAGE}] строк`, async () => {
				const messagesCount = await dataSourcePage.getMessagesCount()

				expect(messagesCount).toEqual(MESSAGES_COUNT_ON_ONE_PAGE)
			})
		})

		test('При включенной пагинации не работает бесконечный скролл', async ({ page }) => {
			await allure.id('3159316')
			const dataSourcePage = new DataSourcePage(page)
			let searchRequestWasTriggered: boolean

			await allure.step('Включить пагинацию', async () => {
				await dataSourcePage.changePaginationMode()
			})

			await allure.step(`В таблице сообщений [${MESSAGES_COUNT_ON_ONE_PAGE}] строк`, async () => {
				const messagesCount = await dataSourcePage.getMessagesCount()

				expect(messagesCount).toEqual(MESSAGES_COUNT_ON_ONE_PAGE)
			})

			await allure.step('Ловим запрос', async () => {
				searchRequestWasTriggered = false
				page.on('request', (request) => {
					if (request.url().includes('**/seqapi/v1/search*')) {
						searchRequestWasTriggered = true
					}
				})
			})

			await allure.step(`Скролим на [${FEW_PAGES_DOWN_PIXELS_COUNT}] пикселей вниз`, async () => {
				const dataSourcePage = new DataSourcePage(page)
				await dataSourcePage.scrollPage(FEW_PAGES_DOWN_PIXELS_COUNT)
			})

			await allure.step('Проверяем что не вызывался запрос "search"', async () => {
				expect(searchRequestWasTriggered).toBe(false)
			})

			await allure.step(`В таблице сообщений [${MESSAGES_COUNT_ON_ONE_PAGE}] строк`, async () => {
				const messagesCount = await dataSourcePage.getMessagesCount()

				expect(messagesCount).toEqual(MESSAGES_COUNT_ON_ONE_PAGE)
			})
		})
	})
})
