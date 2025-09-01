import { expect, test } from '@fe/pw-config'
import { allure } from 'allure-playwright'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { FUNCTION_VALUE, GROUP_BY } from '~/playwright/consts/aggregation-fields-consts'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'

const AGGREGATION_VALUES = {
	AVG_FUNCTION_NAME: 'avg',
	QUANTILE_FUNCTION_NAME: 'quantile',
	LEVEL_FIELD_NAME: 'level',
	COUNT_FIELD_NAME: 'count',
	K8S_CLUSTER_GROUPBY: 'k8s_cluster',
	ITEM_NAME_AVG_LEVEL: 'avg (level)',
	ITEM_NAME_AVG_COUNT: 'avg (count)',
	ITEM_NAME_QUANTILE: 'quantile (level)',
	QUANTILE_VALUE: '0.5',
}

test.describe('Добавление агрегаций', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Таблица логов')
		await allure.feature('Добавление агрегаций')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-108')

		await page.goto(baseURL as string)
	})

	test.describe('Создание агрегации', () => {
		test.beforeEach(async () => {
			await allure.story('Создание агрегации')
		})

		test('Добавление агрегации для функции avg', async ({ page }) => {
			await allure.id('4663403')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Создаём агрегацию', async () => {
				await dataSourcePage.openAddAggregationForm()
				await dataSourcePage.addEditAggregationModal.createAggregation({
					functionName: AGGREGATION_VALUES.AVG_FUNCTION_NAME,
					fieldName: AGGREGATION_VALUES.LEVEL_FIELD_NAME,
					groupBy: AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY,
				})
			})

			await allure.step('Проверяем отображение виджета агрегацию', async () => {
				const aggregationItem = await dataSourcePage.getAggregationItem(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL)

				await expect(aggregationItem).toBeVisible()
			})

			await allure.step(`Проверяем значение поля ${GROUP_BY}`, async () => {
				const groupByValue = await dataSourcePage.aggregationWidget.getValue(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL, GROUP_BY)

				expect(groupByValue).toEqual(AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY)
			})

			await allure.step('Проверяем название функции', async () => {
				const functionValue = await dataSourcePage.aggregationWidget.getValue(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL, FUNCTION_VALUE)

				expect(functionValue).toEqual(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL.split(' ').join(''))
			})
		})

		test('Добавление агрегации для функции quantile', async ({ page }) => {
			await allure.id('4663401')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Создаём агрегацию', async () => {
				await dataSourcePage.openAddAggregationForm()
				await dataSourcePage.addEditAggregationModal.createAggregation({
					functionName: AGGREGATION_VALUES.QUANTILE_FUNCTION_NAME,
					fieldName: AGGREGATION_VALUES.LEVEL_FIELD_NAME,
					groupBy: AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY,
					quantile: AGGREGATION_VALUES.QUANTILE_VALUE,
				})
			})

			await allure.step('Проверяем отображение виджета агрегацию', async () => {
				const aggregationItem = await dataSourcePage.getAggregationItem(AGGREGATION_VALUES.ITEM_NAME_QUANTILE)

				await expect(aggregationItem).toBeVisible()
			})

			await allure.step(`Проверяем значение поля ${GROUP_BY}`, async () => {
				const groupByValue = await dataSourcePage.aggregationWidget.getValue(AGGREGATION_VALUES.ITEM_NAME_QUANTILE, GROUP_BY)

				expect(groupByValue).toEqual(AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY)
			})

			await allure.step('Проверяем название функции', async () => {
				const functionValue = await dataSourcePage.aggregationWidget.getValue(AGGREGATION_VALUES.ITEM_NAME_QUANTILE, FUNCTION_VALUE)

				expect(functionValue).toEqual(AGGREGATION_VALUES.ITEM_NAME_QUANTILE.split(' ').join(''))
			})
		})
	})

	test.describe('Растягивание и сужение агрегации', () => {
		let firstBox: {
			x: number
			y: number
			width: number
			height: number
		} | null

		let secondBox: {
			x: number
			y: number
			width: number
			height: number
		} | null

		test.beforeEach(async ({ page }) => {
			await allure.story('Растягивание агрегации')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Создаём агрегацию', async () => {
				await dataSourcePage.openAddAggregationForm()
				await dataSourcePage.addEditAggregationModal.createAggregation({
					functionName: AGGREGATION_VALUES.AVG_FUNCTION_NAME,
					fieldName: AGGREGATION_VALUES.LEVEL_FIELD_NAME,
					groupBy: AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY,
				})
			})

			await allure.step('Расширяем агрегацию', async () => {
				firstBox = await dataSourcePage.aggregationWidgetItem.boundingBox()
				await dataSourcePage.aggregationWidget.expand(500, 500)
			})
		})

		test('Растягивание агрегации', async ({ page, browserName }) => {
			await allure.id('4663402')

			if (browserName === 'firefox') test.skip(true, 'В тесте проблема с измением размера виджета в FF, вручную ок')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Проверяем, что растянутая агрегация шире исходной', async () => {
				secondBox = await dataSourcePage.aggregationWidgetItem.boundingBox()

				expect(firstBox!.width).toBeLessThan(secondBox!.width)
				expect(firstBox!.height).toBeLessThan(secondBox!.height)
			})

			await allure.step('Проверяем значение в поле агрегации', async () => {
				const groupByValue = await dataSourcePage.aggregationWidget.getValue(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL, FUNCTION_VALUE)

				expect(groupByValue).toEqual(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL.split(' ').join(''))
			})
		})

		test('Сужение агрегации', async ({ page, browserName }) => {
			await allure.id('4803599')

			if (browserName === 'firefox') test.skip(true, 'В тесте проблема с измением размера виджета в FF, вручную ок')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Сужаем агрегацию', async () => {
				secondBox = await dataSourcePage.aggregationWidgetItem.boundingBox()
				await dataSourcePage.aggregationWidget.expand(-300, -500)
			})

			await allure.step('Проверяем, что агрегация сужена', async () => {
				const thirdBox = await dataSourcePage.aggregationWidgetItem.boundingBox()

				expect(thirdBox!.width).toBeLessThan(secondBox!.width)
				expect(thirdBox!.height).toBeLessThan(secondBox!.height)
			})
		})

		test('Редактирование агрегации после изменения размера виджета', async ({ page, browserName }) => {
			await allure.id('4803590')
			await allure.issue('SREUI-1163', 'https://jit.o3.ru/browse/SREUI-148')

			test.skip(true, 'BUG https://jit.o3.ru/browse/SREUI-1163')

			if (browserName === 'firefox') test.skip(true, 'В тесте проблема с измением размера виджета в FF, вручную ок')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Редактируем виджет, указывая временной интервал', async () => {
				secondBox = await dataSourcePage.aggregationWidgetItem.boundingBox()

				await dataSourcePage.aggregationWidget.openEditForm(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL)
				await dataSourcePage.addEditAggregationModal.editAggregation({ fieldName: AGGREGATION_VALUES.COUNT_FIELD_NAME }, true)
			})

			await allure.step('Проверяем, что после редактирования размер виджета не изменился', async () => {
				const afterEditBox = await dataSourcePage.aggregationWidgetItem.boundingBox()

				expect(afterEditBox!.width).toEqual(secondBox!.width)
				expect(afterEditBox!.height).toEqual(secondBox!.height)
			})
		})
	})

	test.describe('Перемещение агрегации', () => {
		test.beforeEach(async () => {
			await allure.story('Перемещение агрегации')
		})

		test('Перемещение агрегации', async ({ page }) => {
			await allure.id('4663400')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Создаём первую агрегацию', async () => {
				await dataSourcePage.openAddAggregationForm()
				await dataSourcePage.addEditAggregationModal.createAggregation({
					functionName: AGGREGATION_VALUES.AVG_FUNCTION_NAME,
					fieldName: AGGREGATION_VALUES.LEVEL_FIELD_NAME,
					groupBy: AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY,
				})
			})

			await allure.step('Создаём вторую агрегацию', async () => {
				await dataSourcePage.openAddAggregationForm()
				await dataSourcePage.addEditAggregationModal.createAggregation({
					functionName: AGGREGATION_VALUES.QUANTILE_FUNCTION_NAME,
					fieldName: AGGREGATION_VALUES.LEVEL_FIELD_NAME,
					groupBy: AGGREGATION_VALUES.K8S_CLUSTER_GROUPBY,
					quantile: AGGREGATION_VALUES.QUANTILE_VALUE,
				})
			})

			await allure.step('Перетаскиваем первую агрегацию вправо', async () => {
				const firstBox = await dataSourcePage.aggregationWidgetItem.nth(0).boundingBox()
				await dataSourcePage.aggregationWidget.drag(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL, firstBox, 500, 0)
			})

			await allure.step('Агрегации поменялись местами', async () => {
				expect(await dataSourcePage.aggregationWidget.widgetTitle.nth(0).textContent()).toEqual(AGGREGATION_VALUES.ITEM_NAME_QUANTILE)
				expect(await dataSourcePage.aggregationWidget.widgetTitle.nth(1).textContent()).toEqual(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL)
			})

			await allure.step('Редактируем виджет', async () => {
				await dataSourcePage.aggregationWidget.openEditForm(AGGREGATION_VALUES.ITEM_NAME_AVG_LEVEL)
				await dataSourcePage.addEditAggregationModal.editAggregation({ fieldName: AGGREGATION_VALUES.COUNT_FIELD_NAME })
			})

			await allure.step('Проверяем значение в поле агрегации', async () => {
				const groupByValue = await dataSourcePage.aggregationWidget.getValue(AGGREGATION_VALUES.ITEM_NAME_AVG_COUNT, FUNCTION_VALUE)

				expect(groupByValue).toEqual(AGGREGATION_VALUES.ITEM_NAME_AVG_COUNT.split(' ').join(''))
			})
		})
	})
})