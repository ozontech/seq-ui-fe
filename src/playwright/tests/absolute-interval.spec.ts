import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { ABSOLUTE, FROM, TO } from '~/playwright/consts/intervals.consts'
import { getRandomPastDate, getRandomTime } from '~/playwright/utils'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

test.describe('Выбор абсолютного интервала', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Поиск')
		await allure.feature('Выбор относительного интервала')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-103')

		const dataSourcePage = new DataSourcePage(page)
		await page.goto(baseURL as string)

		await allure.step('Выбираем абсолютный временной интервал', async () => {
			await dataSourcePage.openCloseDateTimePicker()
			await dataSourcePage.selectIntervalModal.selectMode(ABSOLUTE)
		})
	})

	test.describe('Значение временного интервала по умолчанию', () => {
		test.beforeEach(async () => {
			await allure.story('Значение временного интервала по умолчанию')
		})

		test('Значение временного интервала по умолчанию', async ({ page }) => {
			await allure.id('4571773')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Значение по умолчанию "До" должно быть сутки до настоящего момента', async () => {
				const fromValue = await dataSourcePage.selectIntervalModal.absoluteModal.getDateTime(FROM)
				const toValue = await dataSourcePage.selectIntervalModal.absoluteModal.getDateTime(TO)

				expect(fromValue).toEqual(dayjs().subtract(1, 'day').format('DD.MM.YYYY HH:mm:ss'))
				expect(toValue).toEqual(dayjs().format('DD.MM.YYYY HH:mm:ss'))
			})
		})
	})

	test.describe('Выпадающий календарь', () => {
		test.beforeEach(async ({ page }) => {
			await allure.story('Выпадающий календарь')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Открываем выпадающий календарь', async () => {
				await dataSourcePage.selectIntervalModal.absoluteModal.openCalendar()
			})
		})

		test('Работа стрелок в календаре', async ({ page }) => {
			await allure.id('4571767')
			dayjs.locale('ru')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Выбираем предыдущий месяц: отображается предыдущий месяц', async () => {
				await dataSourcePage.selectIntervalModal.absoluteModal.selectMonth('previous')

				expect(await dataSourcePage.selectIntervalModal.absoluteModal.monthTitle.textContent())
					.toEqual(dayjs().subtract(1, 'month').format('MMMM'))
			})

			await allure.step('Выбираем следующий месяц: отображается текущий месяц', async () => {
				await dataSourcePage.selectIntervalModal.absoluteModal.selectMonth('next')

				expect(await dataSourcePage.selectIntervalModal.absoluteModal.monthTitle.textContent())
					.toEqual(dayjs().format('MMMM'))
			})
		})

		test('При клике на год отображается список годов', async ({ page }) => {
			await allure.id('4571772')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Открываем список годов', async () => {
				await dataSourcePage.selectIntervalModal.absoluteModal.openYearsList()
			})

			await allure.step('В списке года с 2020 по 2039', async () => {
				const years = await dataSourcePage.selectIntervalModal.absoluteModal.checkYearButtons(2020)
			})
		})

		test('При клике на месяц отображается список месяцев', async ({ page }) => {
			await allure.id('4571770')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Открываем список месяцев', async () => {
				await dataSourcePage.selectIntervalModal.absoluteModal.openMonthsList()
			})

			await allure.step('В списке все месяцы', async () => {
				const years = await dataSourcePage.selectIntervalModal.absoluteModal.checkMonths()
			})
		})

		test('Выбор даты в календаре', async ({ page }) => {
			await allure.id('4571765')
			const dataSourcePage = new DataSourcePage(page)
			let date: string

			await allure.step('Выбираем дату в календаре', async () => {
				date = await dataSourcePage.selectIntervalModal.absoluteModal.selectDay()

			})

			await allure.step('Дата в фильтре та же, что была выбрана в календаре', async () => {
				const toValue = await dataSourcePage.selectIntervalModal.absoluteModal.getDateTime(TO)

				expect(toValue.substring(0, 2)).toEqual(date)
				await expect(dataSourcePage.selectIntervalModal.absoluteModal.calendar).not.toBeVisible()
			})
		})

		test('Невозможность выбора в календаре даты "До" меньше, чем дата "С"', async ({ page }) => {
			await allure.id('4571766')
			await allure.tag('NEGATIVE')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('В поле "ДО" выбираем позапрошлый месяц', async () => {
				await dataSourcePage.selectIntervalModal.absoluteModal.selectMonth('previous')
				await dataSourcePage.selectIntervalModal.absoluteModal.selectMonth('previous')
			})

			await allure.step('Даты недоступны для выбора', async () => {
				const day = dataSourcePage.selectIntervalModal.absoluteModal.calendarDay
				const daysCount = await day.count()
				expect(daysCount).toBeGreaterThanOrEqual(28)
				// выбираем случайную дату
				await dataSourcePage.selectIntervalModal.absoluteModal.selectRandomDate(daysCount)

				await expect(dataSourcePage.selectIntervalModal.absoluteModal.calendar).toBeVisible()
			})
		})
	})

	test.describe('Ввод данных в модалке абсолютного интервала', () => {
		test.beforeEach(async () => {
			await allure.story('Ввод данных в модалке абсолютного интервала')
		})
		// тест проходит только в CI из-за таймзон
		test('Ручной ввод даты и времени', async ({ page }) => {
			await allure.id('4571768')
			let time: string
			let formattedDateFrom: string
			let formattedDateFromForCI: string
			let formattedDateTo: string
			let formattedDateToForCI: string
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Заполняем поля формы выбора абсолютного интервала', async () => {
				const dateTo = await getRandomPastDate()
				formattedDateTo = dateTo.format('DD.MM.YYYY')
				formattedDateToForCI = dateTo.format('YYYY-MM-DD')

				const dateFrom = dateTo.subtract(1, 'month')
				formattedDateFrom = dateFrom.format('DD.MM.YYYY')
				formattedDateFromForCI = dateFrom.format('YYYY-MM-DD')

				time = await getRandomTime()

				await dataSourcePage.selectIntervalModal.absoluteModal.fillForm(formattedDateFrom, time, formattedDateTo, time)
				await dataSourcePage.selectIntervalModal.saveModal()
			})

			await allure.step('Значение в поле выбора интервала должно соответствовать введённому в модалке', async () => {
				expect(await dataSourcePage.dateTimeInterval.textContent()).toContain(`${formattedDateFrom}${time} - ${formattedDateTo}${time}`)
			})

			await allure.step('Интервал передан в query после сохранения формы с GMT 0', async () => {
				const query = await dataSourcePage.getURLQuery()

				expect(query).toBe(`?rangetype=absolute&from=${formattedDateFromForCI}T${time}.000Z&to=${formattedDateToForCI}T${time}.000Z`)
			})
		})

		test('Ввод невалидных данных в поле даты и времени в модалке абсолютного времени', async ({ page }) => {
			await allure.id('4571769')
			await allure.tag('NEGATIVE')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Ввести латинские символы в поле ввода даты', async () => {
				const latinCharactersSet = 'Hello'
				await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().clear()
				await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().fill(latinCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				expect(await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().inputValue()).toEqual('')
			})

			await allure.step('Ввести латинские символы в поле ввода времени', async () => {
				const latinCharactersSet = 'Hello'
				await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().clear()
				await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().fill(latinCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				expect(await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().inputValue()).toEqual('')
			})

			await allure.step('Ввести кириллицу в поле ввода даты', async () => {
				const cyrillicCharactersSet = 'Привет'
				await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().clear()
				await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().fill(cyrillicCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				expect(await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().inputValue()).toEqual('')
			})

			await allure.step('Ввести кириллицу в поле ввода времени', async () => {
				const cyrillicCharactersSet = 'Привет'
				await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().clear()
				await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().fill(cyrillicCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				expect(await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().inputValue()).toEqual('')
			})

			await allure.step('Ввести спецсимволы в поле ввода даты', async () => {
				const specialCharactersSet = '!@#$%^&*()_-=+"№;%:?[]{}|\\/\''
				await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().clear()
				await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().fill(specialCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				expect(await dataSourcePage.selectIntervalModal.absoluteModal.datePicker.first().inputValue()).toEqual('')
			})

			await allure.step('Ввести спецсимволы в поле ввода времени', async () => {
				const specialCharactersSet = '!@#$%^&*()_-=+"№;%:?[]{}|\\/\''
				await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().clear()
				await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().fill(specialCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				expect(await dataSourcePage.selectIntervalModal.absoluteModal.timeInput.first().inputValue()).toEqual('')
			})
		})
	})
})