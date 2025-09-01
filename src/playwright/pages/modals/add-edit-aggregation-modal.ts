import type { Locator, Page } from '@fe/pw-config'

import { LAST_15_MINUTES } from '~/playwright/consts/intervals.consts'
import {
	AGGREGATION_DATE_TIME_PICKER,
	FIELD_SELECT,
	FUNCTION_SELECT,
	GROUP_BY_SELECT,
	HEADLINE_AGGREGATIONS,
	QUANTILE_INPUT,
} from '~/playwright/locators/aggregations.locators'
import { BUTTON_SAVE, DROPDOWN_ITEM } from '~/playwright/locators/common.locators'
import { DURATION_BUTTON, SAVE_TIME_BUTTON } from '~/playwright/locators/intervals.locators'

export interface AggregationFormConfig {
	functionName?: string
	fieldName?: string
	groupBy?: string
	quantile?: string
}

export class AddEditAggregationModal {
	private readonly page: Page

	public dropdownItem: Locator

	public fieldSelect: Locator

	public functionSelect: Locator

	public groupBySelect: Locator

	public quantileInput: Locator

	public modalHeadline: Locator

	public saveButton: Locator

	public dateTimePicker: Locator

	constructor(page: Page) {
		this.page = page
		this.dropdownItem = this.page.getByTestId(DROPDOWN_ITEM)
		this.fieldSelect = this.page.getByTestId(FIELD_SELECT)
		this.functionSelect = this.page.getByTestId(FUNCTION_SELECT)
		this.groupBySelect = this.page.getByTestId(GROUP_BY_SELECT)
		this.quantileInput = this.page.getByTestId(QUANTILE_INPUT)
		this.modalHeadline = this.page.getByTestId(HEADLINE_AGGREGATIONS)
		this.saveButton = this.page.getByTestId(BUTTON_SAVE)
		this.dateTimePicker = this.page.getByTestId(AGGREGATION_DATE_TIME_PICKER)
	}

	public async createAggregation(
		config: AggregationFormConfig,
	) {
		if (config.functionName) {
			await this.functionSelect.click()
			await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${config.functionName}"`).click()
		}
		if (config.fieldName) {
			await this.fieldSelect.type(config.fieldName)
			await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${config.fieldName}"`).click()
		}
		if (config.groupBy) {
			await this.groupBySelect.type(config.groupBy)
			await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${config.groupBy}"`).click()
		}
		if (config.quantile) {
			await this.quantileInput.fill(config.quantile)
		}
		await this.saveButton.click()
	}

	public async editAggregation(
		config: AggregationFormConfig,
		editInterval?: boolean,
	) {
		if (config.functionName) {
			await this.functionSelect.click()
			await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${config.functionName}"`).click()
		}
		if (config.fieldName) {
			await this.page.waitForTimeout(1000)
			await this.fieldSelect.clear()
			await this.page.waitForTimeout(1000)
			await this.fieldSelect.type(config.fieldName)
			await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${config.fieldName}"`).click()
		}
		if (config.groupBy) {
			await this.groupBySelect.clear()
			// таймаут после clear для firefox
			await this.page.waitForTimeout(500)
			await this.groupBySelect.type(config.groupBy)
			await this.page.locator(`data-testid=${DROPDOWN_ITEM} >> text="${config.groupBy}"`).click()
		}
		if (config.quantile) {
			await this.quantileInput.clear()
			// таймаут после clear для firefox
			await this.page.waitForTimeout(500)
			await this.quantileInput.fill(config.quantile)
		}
		if (editInterval) {
			await this.dateTimePicker.click()
			await this.page.locator(`data-testid=${DURATION_BUTTON} >> text="${LAST_15_MINUTES}"`).click()
			await this.page.getByTestId(SAVE_TIME_BUTTON).click()
		}

		await this.saveButton.click()
	}
}