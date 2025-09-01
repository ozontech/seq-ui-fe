import type { Locator, Page } from '@fe/pw-config'

import { FUNCTION_VALUE, GROUP_BY } from '~/playwright/consts/aggregation-fields-consts'
import { AGGREGATION_WIDGET } from '~/playwright/locators/aggregations.locators'
import {
	BUTTON_ACTION,
	BUTTON_EDIT,
	RESIZE_ICON,
	WIDGET_HEADER_LEFT,
	WIDGET_HEADER_RIGHT,
	WIDGET_TITLE,
} from '~/playwright/locators/common.locators'

export class AggregationWidget {
	public page: Page

	public widgetTitle: Locator

	public widgetHeaderRight: Locator

	public widgetHeaderLeft: Locator

	public resizeIcon: Locator

	public actionButton: Locator

	public editButton: Locator

	constructor(page: Page) {
		this.page = page
		this.widgetTitle = this.page.getByTestId(WIDGET_TITLE)
		this.widgetHeaderRight = this.page.getByTestId(WIDGET_HEADER_RIGHT)
		this.widgetHeaderLeft = this.page.getByTestId(WIDGET_HEADER_LEFT)
		this.resizeIcon = this.page.getByTestId(RESIZE_ICON)
		this.actionButton = this.page.getByTestId(BUTTON_ACTION)
		this.editButton = this.page.getByTestId(BUTTON_EDIT)
	}

	public async expand(xNumber: number, yNumber: number) {
		const element = await this.resizeIcon.boundingBox()

		await this.resizeIcon.hover()
		await this.page.mouse.down()
		await this.page.mouse.move(
			element!.x + xNumber,
			element!.y + yNumber,
		)
		await this.page.mouse.up()
	}

	public async drag(widgetName: string, element: null | {
		x: number
		y: number
		width: number
		height: number
	}, xNumber: number, yNumber: number) {
		const widget = this.page.locator(
			`data-testid=${AGGREGATION_WIDGET}`,
			{
				has: this.page.locator(`data-testid=${WIDGET_TITLE} >> text=${widgetName}`),
			},
		)

		await widget.locator(this.widgetTitle).hover()
		await this.page.mouse.down()
		await this.page.mouse.move(
			element!.x + xNumber,
			element!.y + yNumber,
		)
		await this.page.mouse.up()
	}

	public async openEditForm(widgetName: string) {
		const widget = this.page.locator(
			`data-testid=${AGGREGATION_WIDGET}`,
			{
				has: this.page.locator(`data-testid=${WIDGET_TITLE} >> text=${widgetName}`),
			},

		)
		await widget.locator(this.actionButton).click()
		await this.editButton.click()
	}

	public async getValue(widgetName: string, field: string): Promise<string> {
		const widget = this.page.locator(
			`data-testid=${AGGREGATION_WIDGET}`,
			{
				has: this.page.locator(`data-testid=${WIDGET_TITLE} >> text=${widgetName}`),
			},
		)
		let element = widget.locator(this.widgetHeaderLeft)

		switch (field) {
			case GROUP_BY:
				break
			case FUNCTION_VALUE:
				element = widget.locator(this.widgetHeaderRight)
				break
			default:
				break
		}

		return await element.textContent() as string
	}
}