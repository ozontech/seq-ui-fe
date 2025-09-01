import { expect } from '@fe/pw-config'
import type { Locator, Page } from '@fe/pw-config'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import { AggregationWidget } from '~/playwright/pages/components/aggregation-widget'
import { PAGINATION_NEXT_PAGE, PAGINATION_PREV_PAGE } from '~/playwright/consts/table.consts'
import {
	AUTOCOMPLETE_ITEM,
	AUTOCOMPLETE_ITEM_LABEL,
	BUTTON_ENV_SELECT,
	ENV_ITEM,
	FAVORITE_BUTTON,
	HISTOGRAM_BUTTON,
	SEARCH_BUTTON,
	SEARCH_FIELD,
	SEARCH_INPUT,
	SUGGESTION_ITEM,
	SUGGESTIONS_LIST,
	TOOLTIPS_BUTTON,
} from '~/playwright/locators/header.locators'
import {
	ADD_AGGREGATION,
	ROW_DATE_TIME_CELL,
	ROW_ITEM,
	ROW_ITEM_DATE,
	ROW_ITEM_TIME,
	ROW_MESSAGE_CELL,
	SAVED_REQUESTS,
} from '~/playwright/locators/table.locators'
import {
	CHECKBOX,
	PAGINATION_BUTTON,
	PAGINATION_NEXT_BUTTON,
	PAGINATION_NUMBERS_BLOCK,
	PAGINATION_PAGE_BUTTON,
	PAGINATION_PAGE_NUMBER_INPUT,
	PAGINATION_PREV_BUTTON,
} from '~/playwright/locators/pagination.locators'
import { MainPage } from '~/playwright/pages/main-page'
import { SelectIntervalModal } from '~/playwright/pages/modals/select-interval-modal'
import { FavoriteModal } from '~/playwright/pages/modals/favorite-modal'
import { SavedRequestsModal } from '~/playwright/pages/modals/saved-requests-modal'
import {
	ABSOLUTE_TIME,
	BUTTON_EARLIER,
	BUTTON_LATER,
	DATE_TIME_INTERVAL,
	DATE_TIME_PICKER_MODAL,
} from '~/playwright/locators/intervals.locators'
import { MODAL_HEADER } from '~/playwright/locators/favorite-modal.locators'
import { EARLIER, FROM } from '~/playwright/consts/intervals.consts'
import { AddEditAggregationModal } from '~/playwright/pages/modals/add-edit-aggregation-modal'
import { AGGREGATION_WIDGET } from '~/playwright/locators/aggregations.locators'
import { SCROLL_UP_BUTTON } from '~/playwright/locators/footer.locators'
import { Histogram } from '~/playwright/pages/components/histogram'
import { DROPDOWN_ITEM, WIDGET_TITLE } from '~/playwright/locators/common.locators'
import { SUCCESS_STATUS_CODE } from '~/playwright/consts/status-codes.consts'

export class DataSourcePage extends MainPage {
	public selectIntervalModal: SelectIntervalModal

	public favoriteModal: FavoriteModal

	public savedRequests: SavedRequestsModal

	public addEditAggregationModal: AddEditAggregationModal

	public aggregationWidget: AggregationWidget

	public histogram: Histogram

	public searchField: Locator

	public searchButton: Locator

	public rowItem: Locator

	public rowItemTime: Locator

	public rowItemDate: Locator

	public paginationButton: Locator

	public paginationNumbersBlock: Locator

	public paginationPageNumberInput: Locator

	public paginationPrevButton: Locator

	public paginationNextButton: Locator

	public paginationPageButton: Locator

	public searchTextArea: Locator

	public paginationCheckbox: Locator

	public autocompleteItem: Locator

	public autocompleteItemLabel: Locator

	public dateTimePicker: Locator

	public favoriteButton: Locator

	public dateTimeInterval: Locator

	public suggestionsList: Locator

	public suggestionItem: Locator

	public arrowButtonEarlier: Locator

	public arrowButtonLater: Locator

	public savedRequestsButton: Locator

	public tooltipsButton: Locator

	public addAggregationButton: Locator

	public aggregationWidgetItem: Locator

	public selectEnvButton: Locator

	public scrollUpButton: Locator

	public openCloseHistogramButton: Locator

	public absoluteTime: Locator

	constructor(page: Page) {
		super(page)
		this.page = page
		this.selectIntervalModal = new SelectIntervalModal(page)
		this.favoriteModal = new FavoriteModal(page)
		this.savedRequests = new SavedRequestsModal(page)
		this.addEditAggregationModal = new AddEditAggregationModal(page)
		this.aggregationWidget = new AggregationWidget(page)
		this.histogram = new Histogram(page)
		this.searchField = this.page.getByTestId(SEARCH_FIELD)
		this.searchButton = this.page.getByTestId(SEARCH_BUTTON)
		this.rowItem = this.page.getByTestId(ROW_ITEM)
		this.rowItemTime = this.page.getByTestId(ROW_ITEM_TIME)
		this.rowItemDate = this.page.getByTestId(ROW_ITEM_DATE)
		this.paginationNumbersBlock = this.page.getByTestId(PAGINATION_NUMBERS_BLOCK)
		this.paginationButton = this.page.getByTestId(PAGINATION_BUTTON)
		this.paginationPageNumberInput = this.page.getByTestId(PAGINATION_PAGE_NUMBER_INPUT)
		this.paginationPrevButton = this.page.getByTestId(PAGINATION_PREV_BUTTON)
		this.paginationNextButton = this.page.getByTestId(PAGINATION_NEXT_BUTTON)
		this.paginationPageButton = this.page.getByTestId(PAGINATION_PAGE_BUTTON)
		this.searchTextArea = this.page.locator(SEARCH_INPUT)
		this.paginationCheckbox = this.paginationButton.locator(CHECKBOX)
		this.autocompleteItem = this.page.getByRole(AUTOCOMPLETE_ITEM)
		this.autocompleteItemLabel = this.page.locator(AUTOCOMPLETE_ITEM_LABEL)
		this.suggestionsList = this.page.getByTestId(SUGGESTIONS_LIST)
		this.suggestionItem = this.page.getByTestId(SUGGESTION_ITEM)
		this.dateTimePicker = this.page.getByTestId(DATE_TIME_PICKER_MODAL)
		this.favoriteButton = this.page.getByTestId(FAVORITE_BUTTON)
		this.dateTimeInterval = this.page.getByTestId(DATE_TIME_INTERVAL)
		this.absoluteTime = this.page.getByTestId(ABSOLUTE_TIME)
		this.arrowButtonEarlier = this.page.getByTestId(BUTTON_EARLIER)
		this.arrowButtonLater = this.page.getByTestId(BUTTON_LATER)
		this.savedRequestsButton = this.page.getByTestId(SAVED_REQUESTS)
		this.tooltipsButton = this.page.getByTestId(TOOLTIPS_BUTTON)
		this.addAggregationButton = this.page.getByTestId(ADD_AGGREGATION)
		this.aggregationWidgetItem = this.page.getByTestId(AGGREGATION_WIDGET)
		this.selectEnvButton = this.page.getByTestId(BUTTON_ENV_SELECT)
		this.scrollUpButton = this.page.getByTestId(SCROLL_UP_BUTTON)
		this.openCloseHistogramButton = this.page.getByTestId(HISTOGRAM_BUTTON)
	}

	public async scrollPage(pixelsCount: number) {
		for (let i = 0; i < pixelsCount; i += 2000) {
			await this.page.mouse.wheel(0, 2000)
			await this.page.waitForTimeout(100)
		}
		await this.page.waitForTimeout(1000)
	}

	public async typeMessage(message: string) {
		const mainInput = this.searchField

		await mainInput.pressSequentially(message)
	}

	public async searchMessage(message: string) {
		const mainInput = this.searchField
		await mainInput.pressSequentially(message)
		await this.searchButton.click()

		const response = await this.page.waitForResponse((res) =>
			res.url().includes('/seqapi/v1/search') &&
			res.request().method() === 'POST')

		expect(response.status()).toBe(SUCCESS_STATUS_CODE)
	}

	public async getMessagesCount(): Promise<number> {
		expect(await this.rowItem.first().isEnabled()).toEqual(true)

		await this.page.waitForTimeout(1000)
		const messagesTableRowsCount = await this.rowItem.count()

		return messagesTableRowsCount
	}

	public async getPageButtonByNumber(pageNumber: string): Promise<Locator> {
		return this.page.locator(`data-testid=${PAGINATION_PAGE_BUTTON} >> text="${pageNumber}"`)
	}

	public async getFirstMessageContent(): Promise<string> {
		let result = ''

		const tableFirstRow = this.rowItem.first()
		await expect(tableFirstRow).toBeVisible()

		await this.page.waitForTimeout(500)
		const firstMsgTime = await tableFirstRow.locator(ROW_DATE_TIME_CELL).textContent()
		const firstMsgText = await tableFirstRow.locator(ROW_MESSAGE_CELL).textContent()
		result = `${firstMsgTime}: ${firstMsgText}`
		return result
	}

	public async goToPageWithInput(pageNumber: string) {
		const input = this.paginationPageNumberInput

		await this.page.waitForTimeout(1000)
		await input.fill(pageNumber)
		await input.press('Enter')
		await this.page.waitForResponse('**/seqapi/v1/search*')
	}

	public async getSuggestions(rowsCount: number): Promise<string[]> {
		const rowsTexts = []

		await expect(this.autocompleteItem.first()).toBeVisible()
		expect(await this.autocompleteItem.count()).toBeGreaterThanOrEqual(rowsCount)

		for (let i = 0; i < rowsCount; i++) {
			rowsTexts.push(await this.autocompleteItem.nth(i).textContent() as string)
		}

		return rowsTexts
	}

	public async getSuggestionText(suggestionNumber: number): Promise<string> {
		const suggestItem = this.autocompleteItem
			.nth(suggestionNumber)
			.locator(AUTOCOMPLETE_ITEM_LABEL)

		await expect(suggestItem.first()).toBeVisible()
		await suggestItem.textContent()

		return await suggestItem.textContent() as string
	}

	public async getSuggestionInList(itemName: string): Promise<Locator> {
		const suggestItem = this.autocompleteItem
			.locator('[class^=contents]')
			.locator('[class^=main]')
			.locator(`span[class^=left] >> text="${itemName}"`)

		return suggestItem
	}

	public async getSuggestionsArray(): Promise<string[]> {
		const suggestions = []

		for (let i = 1; i <= 3; i++) {
			const itemText = await this.getSuggestionText(i)
			suggestions.push(itemText)
		}

		return suggestions
	}

	public async selectDropdownItemByKeyboard(itemNth: number) {
		for (let i = 0; i < itemNth; i++) await this.page.keyboard.press('ArrowDown')

		await this.page.keyboard.press('Enter')
	}

	public async selectDropdownItemByMouse(itemName: string) {
		const suggestItem = this.page.locator(`${AUTOCOMPLETE_ITEM_LABEL} >> text=${itemName}`).first()

		await suggestItem.click()
	}

	public async getInputValue(): Promise<string> {
		await this.page.waitForTimeout(1000)

		const textInField = await this.searchTextArea.textContent()

		return textInField as string
	}

	public async getPlaceholder(expectedText: string): Promise<Locator> {
		const placeholder = this.searchField.getByLabel(`placeholder ${expectedText}`)

		return placeholder
	}

	public async openTooltipsList() {
		await this.tooltipsButton.click()
	}

	public async openCloseDateTimePicker() {
		await this.dateTimeInterval.click()
	}

	public async openFavoriteModal() {
		const modalHeader = this.page.getByTestId(MODAL_HEADER)

		await this.favoriteButton.click()

		await expect(modalHeader).toBeVisible()
	}

	public async changePaginationMode() {
		await this.paginationButton.click()
	}

	public async clickToPageNumber(pageNumber: string) {
		await this.page.locator(`data-testid=${PAGINATION_PAGE_BUTTON} >> text="${pageNumber}"`).click()
	}

	public async getButtonText(buttonNumber: number): Promise<string> {
		const pageButton = this.paginationPageButton.nth(buttonNumber)

		await expect(pageButton).toBeVisible()

		const pageText = String(await pageButton.textContent())

		return pageText as string
	}

	public async getArrowPageButtonState(buttonName: string): Promise<Locator> {
		let button: Locator

		if (buttonName === PAGINATION_PREV_PAGE) {
			button = this.paginationPrevButton
		} else if (buttonName === PAGINATION_NEXT_PAGE) {
			button = this.paginationNextButton
		} else {
			throw new Error('Unknown button name')
		}

		return button
	}

	public async clickArrowButton(buttonName: string) {
		if (buttonName === PAGINATION_PREV_PAGE) {
			await this.paginationPrevButton.click()
		} else if (buttonName === PAGINATION_NEXT_PAGE) {
			await this.paginationNextButton.click()
		} else {
			throw new Error('Unknown parameter value')
		}
	}

	public async openDropdownItem(itemName: string) {
		await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${itemName}"`).click()
	}

	public async openLastPage() {
		await this.paginationPageButton.last().click()
	}

	public async openSavedRequests() {
		await this.savedRequestsButton.click()
	}

	public async changePeriod(period: string, steps: number) {
		const button = period === EARLIER
			? this.arrowButtonEarlier
			: this.arrowButtonLater

		for (let i = 0; i < steps; i++) {
			await button.click()
		}
	}

	public async getFilterTime(): Promise<number> {
		const time = String(await this.dateTimeInterval.textContent()).slice(10, 19)
		const timeAsNumber = Number(time.split('').filter((item) => item !== ':').join(''))

		return timeAsNumber
	}

	public async openAddAggregationForm() {
		await this.addAggregationButton.click()
	}

	public async getAggregationItem(aggregationName: string): Promise<Locator> {
		const widget = this.page.locator(
			`data-testid=${AGGREGATION_WIDGET}`,
			{
				has: this.page.locator(`data-testid=${WIDGET_TITLE} >> text=${aggregationName}`),
			},
		)

		return widget
	}

	public async selectEnv(envName: string) {
		await this.selectEnvButton.click()
		await this.page.locator(`data-testid=${ENV_ITEM} >> text="${envName}"`).click()
	}

	public async openLogItem(logNumber: number) {
		await this.rowItem.nth(logNumber).click()
	}

	public async scrollUp() {
		await this.scrollUpButton.click()
	}

	public async getDateTime(): Promise<Dayjs> {
		const originalDate = await this.rowItemDate.nth(0).textContent()
		const originalTime = (await this.rowItemTime.nth(0).textContent() as string).replace(/\.\d{3}$/, '')
		const originalDateTime = dayjs(`${originalDate} ${originalTime}`, 'YYYY-MM-DD HH:mm:ss', true)

		return originalDateTime
	}

	public async getTime(field: string): Promise<Dayjs> {
		const fieldNumber = field === FROM ? 0 : 1

		return dayjs(await this.absoluteTime.nth(fieldNumber).textContent(), 'HH:mm:ss', true)
	}

	public async openCloseHistogram() {
		await this.openCloseHistogramButton.click()
	}
}
