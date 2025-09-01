import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { ABSOLUTE, FROM, TO } from '~/playwright/consts/intervals.consts'
import { ELEMENT } from '~/playwright/consts/histogram.consts'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

const PIXELS = {
	PLUS_500: 500,
	MINUS_500: -500,
	PLUS_300: 300,
	MINUS_300: -300,
}

test.describe('Гистограммы', () => {
	dayjs.extend(customParseFormat)
	const beforeTimeMarks: string[] = []
	const afterTimeMarks: string[] = []
	let oldFirstInterval: Dayjs
	let oldSecondInterval: Dayjs

	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Таблица логов')
		await allure.feature('Гистограммы')
		await allure.description('SREQA-107')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)

		const dataSourcePage = new DataSourcePage(page)

		await page.goto(baseURL as string)

		await allure.step('Отправляем текстовый запрос', async () => {
			await dataSourcePage.searchMessage('message: error')
		})

		await allure.step('Выбираем абсолютный временной интервал', async () => {
			await dataSourcePage.openCloseDateTimePicker()
			await dataSourcePage.selectIntervalModal.selectMode(ABSOLUTE)
		})

		await allure.step('Заполняем поля формы выбора абсолютного интервала и записываем их значения', async () => {
			const dataSourcePage = new DataSourcePage(page)

			const dateFrom = dayjs().subtract(10, 'minute').format('DD.MM.YYYY')
			const timeFrom = dayjs().subtract(10, 'minute').format('HH:mm:ss')
			const dateTo = dayjs().format('DD.MM.YYYY')
			const timeTo = dayjs().format('HH:mm:ss')

			await dataSourcePage.selectIntervalModal.absoluteModal.fillForm(dateFrom, timeFrom, dateTo, timeTo)
			await dataSourcePage.selectIntervalModal.saveModal()
			oldFirstInterval = await dataSourcePage.getTime(FROM)
			oldSecondInterval = await dataSourcePage.getTime(TO)
		})

		await allure.step('Открываем гистограмму', async () => {
			await dataSourcePage.openCloseHistogram()

			await expect(dataSourcePage.histogram.histogramContainer).toBeVisible()
		})

		await allure.step('Записываем первую и последнюю временные метки первой гистограммы', async () => {
			await expect(dataSourcePage.histogram.histogramTimeMark.first()).toBeVisible()

			const marksCount = await dataSourcePage.histogram.histogramTimeMark.count()

			beforeTimeMarks.push(await dataSourcePage.histogram.getTimeMarkHoursMinutes(0))
			beforeTimeMarks.push(await dataSourcePage.histogram.getTimeMarkHoursMinutes(marksCount - 1))
		})
	})

	test.describe('Сдвиг интервала гистограммы', () => {
		test.beforeEach(async () => {
			await allure.story('Сдвиг интервала гистограммы')
		})

		test('Сдвиг интервала гистограммы вправо', async ({ page }) => {
			await allure.id('4638879')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Перетаскиваем гистограмму вправо', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.DRAG_CENTER, PIXELS.PLUS_500)
			})

			await allure.step('Записываем первую и последнюю временные метки второй гистограммы', async () => {
				await expect(dataSourcePage.histogram.histogramTimeMark.first()).toBeVisible()

				const marksCount = await dataSourcePage.histogram.histogramTimeMark.count()

				afterTimeMarks.push(await dataSourcePage.histogram.getTimeMarkHoursMinutes(0))
				afterTimeMarks.push(await dataSourcePage.histogram.getTimeMarkHoursMinutes(marksCount - 1))
			})

			await allure.step('Проверяем, что временные метки первой диаграммы позже временных меток второй', async () => {
				const oldFirstMark = dayjs(beforeTimeMarks[0], 'HH:mm', true)
				const newFirstMark = dayjs(afterTimeMarks[0], 'HH:mm', true)

				const oldLastMark = dayjs(beforeTimeMarks[1], 'HH:mm', true)
				const newLastMark = dayjs(afterTimeMarks[1], 'HH:mm', true)

				expect(oldFirstMark.isAfter(newFirstMark)).toBeTruthy()
				expect(oldLastMark.isAfter(newLastMark)).toBeTruthy()
			})

			await allure.step('Проверяем, что значение в фильтре изменилось на более раннее', async () => {
				const newFirstInterval = await dataSourcePage.getTime(FROM)
				const newSecondInterval = await dataSourcePage.getTime(TO)

				expect(oldFirstInterval.isAfter(newFirstInterval)).toBeTruthy()
				expect(oldSecondInterval.isAfter(newSecondInterval)).toBeTruthy()
			})
		})

		test('Сдвиг интервала гистограммы влево', async ({ page }) => {
			await allure.id('4638880')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Перетаскиваем гистограмму влево', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.DRAG_CENTER, PIXELS.MINUS_500)
			})

			await allure.step('Записываем первую и последнюю временные метки второй гистограммы', async () => {
				await expect(dataSourcePage.histogram.histogramTimeMark.first()).toBeVisible()

				const marksCount = await dataSourcePage.histogram.histogramTimeMark.count()

				afterTimeMarks.push(await dataSourcePage.histogram.getTimeMarkHoursMinutes(0))
				afterTimeMarks.push(await dataSourcePage.histogram.getTimeMarkHoursMinutes(marksCount - 1))
			})

			await allure.step('Проверяем, что временные метки первой диаграммы раньше временных меток второй', async () => {
				const oldFirstMark = dayjs(beforeTimeMarks[0], 'HH:mm', true)
				const newFirstMark = dayjs(afterTimeMarks[0], 'HH:mm', true)
				const oldLastMark = dayjs(beforeTimeMarks[1], 'HH:mm', true)
				const newLastMark = dayjs(afterTimeMarks[1], 'HH:mm', true)

				expect(oldFirstMark.isBefore(newFirstMark)).toBeTruthy()
				expect(oldLastMark.isBefore(newLastMark)).toBeTruthy()
			})

			await allure.step('Проверяем, что значение в фильтре изменилось на более позднее', async () => {
				const newFirstInterval = await dataSourcePage.getTime(FROM)
				const newSecondInterval = await dataSourcePage.getTime(TO)

				expect(oldFirstInterval.isBefore(newFirstInterval)).toBeTruthy()
				expect(oldSecondInterval.isBefore(newSecondInterval)).toBeTruthy()
			})
		})
	})

	test.describe('Сужение/расширение интервала гистограммы', () => {
		test.beforeEach(async () => {
			await allure.story('Сужение/расширение интервала гистограммы')
		})

		test('Сужение интервала гистограммы справа налево', async ({ page }) => {
			await allure.id('4642560')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Сужаем гистограмму справа налево', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.DRAG_RIGHT, PIXELS.MINUS_500)
			})

			await allure.step('Проверяем, что правая метка первой диаграммы раньше правой метки второй', async () => {
				const lastMarkOld = dayjs(beforeTimeMarks[beforeTimeMarks.length - 1], 'HH:mm', true)
				const lastMarkNew = dayjs(await dataSourcePage.histogram.histogramTimeMark.last().textContent(), 'HH:mm', true)

				expect(lastMarkNew.isAfter(lastMarkOld)).toEqual(true)
			})

			await allure.step('Проверяем, что значение конца интервала в фильтре изменилось на более позднее', async () => {
				const newSecondInterval = await dataSourcePage.getTime(TO)

				expect(oldSecondInterval.isBefore(newSecondInterval)).toBeTruthy()
			})
		})

		test('Сужение интервала гистограммы слева направо', async ({ page }) => {
			await allure.id('4642561')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Сужаем гистограмму слева направо', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.DRAG_LEFT, PIXELS.PLUS_500)
			})

			await allure.step('Проверяем, что левая метка первой диаграммы позже левой метки второй', async () => {
				const firstMarkOld = dayjs(beforeTimeMarks[0], 'HH:mm', true)
				const firstMarkNew = dayjs(await dataSourcePage.histogram.getTimeMarkHoursMinutes(0), 'HH:mm', true)

				expect(firstMarkOld.isAfter(firstMarkNew)).toEqual(true)
			})

			await allure.step('Проверяем, что значение начала интервала в фильтре изменилось на более раннее', async () => {
				const newFirstInterval = await dataSourcePage.getTime(FROM)

				expect(oldFirstInterval.isAfter(newFirstInterval)).toBeTruthy()
			})
		})

		test('Расширение интервала гистограммы влево', async ({ page, browserName }) => {
			await allure.id('4640461')

			if (browserName === 'firefox') test.skip()
			// в Firefox в тесте не пересчитывается время в фильтре при расширении интервала, вручную ок

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Расширяем гистограмму справа налево', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.DRAG_LEFT, PIXELS.MINUS_500)
			})

			await allure.step('Проверяем, что левая метка второй диаграммы позже левой метки первой', async () => {
				const firstMarkOld = dayjs(beforeTimeMarks[0], 'HH:mm', true)
				const firstMarkNew = dayjs(await dataSourcePage.histogram.getTimeMarkHoursMinutes(0), 'HH:mm', true)

				expect(firstMarkNew.isAfter(firstMarkOld)).toEqual(true)
			})

			await allure.step('Проверяем, что значение начала интервала в фильтре изменилось на более позднее', async () => {
				const newFirstInterval = await dataSourcePage.getTime(FROM)

				expect(oldFirstInterval.isBefore(newFirstInterval)).toBeTruthy()
			})
		})

		test('Расширение интервала гистограммы вправо', async ({ page, browserName }) => {
			await allure.id('4640460')

			if (browserName === 'firefox') test.skip()
			// в Firefox в тесте не пересчитывается время в фильтре при расширении интервала, вручную ок

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Расширяем гистограмму слева направо', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.DRAG_RIGHT, PIXELS.PLUS_500)
			})

			await allure.step('Проверяем, что правая метка старой диаграммы позже правой метки новой', async () => {
				const oldLastMark = dayjs(beforeTimeMarks[beforeTimeMarks.length - 1], 'HH:mm', true)

				const marksCount = await dataSourcePage.histogram.histogramTimeMark.count()
				const newLastMark = dayjs(await dataSourcePage.histogram.getTimeMarkHoursMinutes(marksCount - 1), 'HH:mm', true)

				expect(oldLastMark.isAfter(newLastMark)).toEqual(true)
			})

			await allure.step('Проверяем, что значение конца интервала в фильтре изменилось на более раннее', async () => {
				const newSecondInterval = await dataSourcePage.getTime(TO)

				expect(newSecondInterval.isBefore(oldSecondInterval)).toBeTruthy()
			})
		})
	})

	test.describe('Выбор интервала гистограммы', async () => {
		test.beforeEach(async () => {
			await allure.story('Выбор интервала гистограммы')
		})

		test('Выбор интервала влево', async ({ page }) => {
			await allure.id('4643402')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Перетаскиваем интервал влево', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.INTERVAL, PIXELS.MINUS_300)
			})

			await allure.step('Проверяем, что значение конца интервала в фильтре изменилось на более раннее', async () => {
				const newSecondInterval = await dataSourcePage.getTime(TO)

				expect(newSecondInterval.isBefore(oldSecondInterval)).toBeTruthy()
			})

			await allure.step('Проверяем, что значение начала интервала в фильтре изменилось на более позднее', async () => {
				const newFirstInterval = await dataSourcePage.getTime(FROM)

				expect(oldFirstInterval.isBefore(newFirstInterval)).toBeTruthy()
			})
		})

		test('Выбор интервала вправо', async ({ page }) => {
			await allure.id('4643403')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Перетаскиваем интервал вправо', async () => {
				await dataSourcePage.histogram.dragElement(ELEMENT.INTERVAL, PIXELS.PLUS_300)
			})

			await allure.step('Проверяем, что значение конца интервала в фильтре изменилось на более раннее', async () => {
				const newSecondInterval = await dataSourcePage.getTime(TO)

				expect(newSecondInterval.isBefore(oldSecondInterval)).toBeTruthy()
			})

			await allure.step('Проверяем, что значение начала интервала в фильтре изменилось на более позднее', async () => {
				const newFirstInterval = await dataSourcePage.getTime(FROM)

				expect(oldFirstInterval.isBefore(newFirstInterval)).toBeTruthy()
			})
		})
	})
})