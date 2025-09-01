import { expect, test } from '@fe/pw-config'
import type { Locator } from '@fe/pw-config'
import { allure } from 'allure-playwright'
import { faker } from '@faker-js/faker'

import { DataSourcePage } from '~/playwright/pages/datasource-page'
import { TEST_OWNERS } from '~/playwright/consts/test-owners.consts'
import { FAILED_STATUS_CODE } from '~/playwright/consts/status-codes.consts'

test.describe('Избранное в поиске', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await allure.epic('Поиск')
		await allure.feature('Избранное в поиске')
		await allure.owner(TEST_OWNERS.ANEKLYUDOVM)
		await allure.description('SREQA-103')

		await page.goto(baseURL as string)
	})

	test.describe('Добавление в избранное', () => {
		test.beforeEach(async () => {
			await allure.story('Добавление в избранное')
		})

		test('Кнопка добавления в избранное неактивна по умолчанию', async ({ page }) => {
			await allure.id('4494323')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Кнопка добавления в избранное неактивна', async () => {
				await expect(dataSourcePage.favoriteButton).toBeDisabled()
			})
		})

		test('Кнопка добавления в избранное активируется при вводе значения в поле поиска', async ({ page }) => {
			await allure.id('4494322')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error')
			})

			await allure.step('Кнопка добавления в избранное активна', async () => {
				await expect(dataSourcePage.favoriteButton).toBeEnabled()
			})
		})

		test('Сохранение запроса в избранное', async ({ page }) => {
			await allure.id('4508755')
			const dataSourcePage = new DataSourcePage(page)
			const name = faker.word.sample()
			const request = faker.word.sample()
			const period = '123'
			const unit = 'секунды'

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage(request)
			})

			await allure.step('Сохраняем запрос в избранное', async () => {
				await dataSourcePage.openFavoriteModal()
				await dataSourcePage.favoriteModal.fillRequestName(name)
				await dataSourcePage.favoriteModal.fillRequestPeriod(period)
				await dataSourcePage.favoriteModal.fillRequestUnit(unit)
				await dataSourcePage.favoriteModal.saveForm()
			})

			await allure.step('Запрос с нужными данными отображается в сохранённых', async () => {
				await dataSourcePage.openSavedRequests()
				const item = await dataSourcePage.savedRequests.getRequest(name, period, request)

				await expect(item).toBeVisible()

				// удаляем запрос после теста, чтобы не копилось слишком много
				await dataSourcePage.savedRequests.removeItem(item)
			})
		})
	})

	test.describe('Валидация при добавлении в избранное', () => {
		test.beforeEach(async ({ page }) => {
			await allure.story('Валидация при добавлении в избранное')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage('message:error')
			})

			await allure.step('Открываем модалку добавления в избранное', async () => {
				await dataSourcePage.openFavoriteModal()
			})
		})

		test('Нельзя сохранить в избранное пустую форму', async ({ page }) => {
			await allure.id('4494324')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Сохраняем пустой запрос в модалке добавления в избранное', async () => {
				await dataSourcePage.favoriteModal.requestTextArea.clear()
				const [response] = await Promise.all([
					page.waitForResponse(/userprofile\/v1\/queries\/favorite/),
					dataSourcePage.favoriteModal.saveForm(),
				])

				expect(response.status()).toEqual(FAILED_STATUS_CODE)
			})

			await allure.step('Отображается уведомление об ошибке', async () => {
				const notification = await dataSourcePage.getNotification('Request failed with status code 400')

				await expect(notification).toBeVisible()
			})

			await allure.step('Модалка добавления в избранное отображается', async () => {
				await expect(dataSourcePage.favoriteModal.modalHeader).toBeVisible()
			})
		})

		test('Нельзя сохранить в избранное запрос с периодом 0 секунд', async ({ page }) => {
			await allure.id('4588066')
			test.skip(true, 'Пропускаем из-за бага https://jit.o3.ru/browse/SREUI-1125')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Сохранить форму с 0 в поле ввода периода', async () => {
				await dataSourcePage.favoriteModal.fillRequestPeriod('0')
				await dataSourcePage.favoriteModal.saveForm()
			})

			await allure.step('Модалка добавления в избранное отображается', async () => {
				await expect(dataSourcePage.favoriteModal.modalHeader).toBeVisible()
			})
		})

		test('Нельзя сохранить в избранное запрос с пустым периодом', async ({ page }) => {
			await allure.id('4588065')
			await allure.issue('SREUI-1125', 'https://jit.o3.ru/browse/SREUI-1125')

			test.skip(true, 'Пропускаем из-за бага https://jit.o3.ru/browse/SREUI-1125')

			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Сохранить форму с пустым значением в поле ввода периода', async () => {
				await dataSourcePage.favoriteModal.clearRequestPeriod()
				dataSourcePage.favoriteModal.saveForm()
			})
		})

		test('Ввод невалидных символов в модалке добавления в избранное', async ({ page }) => {
			await allure.id('4557086')
			await allure.tag('NEGATIVE')
			const dataSourcePage = new DataSourcePage(page)

			await allure.step('Ввести латинские символы в инпут', async () => {
				const latinCharactersSet = 'Hello'
				await dataSourcePage.favoriteModal.fillRequestPeriod(latinCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				const value = await dataSourcePage.favoriteModal.requestPeriod.inputValue()

				expect(value).toEqual('')
			})

			await allure.step('Ввести кириллицу в инпут', async () => {
				const cyrillicCharactersSet = 'Привет'
				await dataSourcePage.favoriteModal.fillRequestPeriod(cyrillicCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				const value = await dataSourcePage.favoriteModal.requestPeriod.inputValue()

				expect(value).toEqual('')
			})

			await allure.step('Ввести спецсимволы в инпут', async () => {
				const specialCharactersSet = '!@#$%^&*()_-=+"№;%:?[]{}|\\/\''
				await dataSourcePage.favoriteModal.fillRequestPeriod(specialCharactersSet)
			})

			await allure.step('В поле ввода пустое значение', async () => {
				const value = await dataSourcePage.favoriteModal.requestPeriod.inputValue()

				expect(value).toEqual('')
			})
		})
	})

	test.describe('Удаление из избранного', async () => {
		test.beforeEach(async () => {
			await allure.story('Удаление из избранного')
		})

		test('Удаление запроса из избранного', async ({ page, baseURL }) => {
			await allure.id('4533369')
			const dataSourcePage = new DataSourcePage(page)
			const name = faker.word.sample()
			const request = faker.word.sample()
			const period = '123'
			const unit = 'секунды'
			let item: Locator

			await allure.step('Вводим запрос в поиск', async () => {
				await dataSourcePage.typeMessage(request)
			})

			await allure.step('Сохраняем запрос в избранное', async () => {
				await dataSourcePage.openFavoriteModal()
				await dataSourcePage.favoriteModal.fillRequestName(name)
				await dataSourcePage.favoriteModal.fillRequestPeriod(period)
				await dataSourcePage.favoriteModal.fillRequestUnit(unit)
				await dataSourcePage.favoriteModal.saveForm()
			})
			await allure.step('Удаляем запрос из избранного', async () => {
				await dataSourcePage.openSavedRequests()
				item = await dataSourcePage.savedRequests.getRequest(name, period, request)
				await dataSourcePage.savedRequests.removeItem(item)
			})

			await allure.step('Запрос не отображается в сохранённых', async () => {
				await page.goto(baseURL as string)
				await dataSourcePage.openSavedRequests()

				await expect(item).not.toBeVisible()
			})
		})
	})
})