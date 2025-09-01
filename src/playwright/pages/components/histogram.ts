import type { Locator, Page } from '@fe/pw-config'

import { ELEMENT } from '~/playwright/consts/histogram.consts'
import {
	HISTOGRAM_CONTAINER,
	HISTOGRAM_DRAG,
	HISTOGRAM_DRAG_LEFT,
	HISTOGRAM_DRAG_RIGHT,
	HISTOGRAM_SELECT_PERIOD,
	HISTOGRAM_TIME_MARK,
} from '~/playwright/locators/histogram.locators'

export class Histogram {
	private readonly page: Page

	public histogramContainer: Locator

	public histogramSelectPeriod: Locator

	public histogramDragRight: Locator

	public histogramDragLeft: Locator

	public histogramDrag: Locator

	public histogramTimeMark: Locator

	constructor(page: Page) {
		this.page = page
		this.histogramContainer = this.page.getByTestId(HISTOGRAM_CONTAINER)
		this.histogramSelectPeriod = this.page.locator(HISTOGRAM_SELECT_PERIOD)
		this.histogramDragRight = this.page.locator(HISTOGRAM_DRAG_RIGHT)
		this.histogramDragLeft = this.page.locator(HISTOGRAM_DRAG_LEFT)
		this.histogramDrag = this.page.locator(HISTOGRAM_DRAG)
		this.histogramTimeMark = this.page.locator(HISTOGRAM_TIME_MARK)
	}

	public async dragElement(elementName: string, pixelsCount: number) {
		let element: Locator = this.histogramDrag

		switch (elementName) {
			case ELEMENT.DRAG_LEFT:
				element = this.histogramDragLeft
				break

			case ELEMENT.DRAG_RIGHT:
				element = this.histogramDragRight
				break

			case ELEMENT.DRAG_CENTER:
				element = this.histogramDrag
				break

			case ELEMENT.INTERVAL:
				element = this.histogramContainer
				break

			default:
				break
		}

		const position = await element.boundingBox()

		await element.hover()
		await this.page.mouse.down()
		await this.page.mouse.move(
			// перемещение мыши на pixelsCount от центра элемента
			position!.x + position!.width / 2 + pixelsCount,
			position!.y + position!.height / 2,
		)
		await this.page.mouse.up()
		await this.page.waitForTimeout(500)
	}

	public async getTimeMarkHoursMinutes(timeMarkNth: number) {
		// timeMark может быть как в формате HH:mm:ss, так и HH:mm, поэтому всегда возвращаем первые 5 символов
		return (await this.histogramTimeMark.nth(timeMarkNth).textContent() as string).slice(0, 5)
	}
}