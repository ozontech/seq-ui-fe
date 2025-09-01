import { expect } from '@fe/pw-config'
import type { Locator, Page } from '@fe/pw-config'

import { FROM } from '~/playwright/consts/intervals.consts'
import {
	CALENDAR,
	CALENDAR_DAY,
	CALENDAR_MONTH,
	CALENDAR_YEAR,
	DATE_PICKER,
	FIELD_FROM,
	FIELD_TO,
	ICON_LEFT_ARROW,
	ICON_RIGHT_ARROW,
	MONTH_TITLE,
	TIME_INPUT,
	YEAR_TITLE,
} from '~/playwright/locators/intervals.locators'

export class AbsoluteIntervalModal {
	public page: Page

	public fieldFrom: Locator

	public fieldTo: Locator

	public periodFrom: Locator

	public periodTo: Locator

	public datePicker: Locator

	public timeInput: Locator

	public leftArrow: Locator

	public rightArrow: Locator

	public monthTitle: Locator

	public yearTitle: Locator

	public calendar: Locator

	public calendarDay: Locator

	public calendarMonth: Locator

	public calendarYear: Locator

	constructor(page: Page) {
		this.page = page
		this.periodFrom = this.page.getByTestId(FIELD_FROM)
		this.periodTo = this.page.getByTestId(FIELD_TO)
		this.datePicker = this.page.getByTestId(DATE_PICKER)
		this.timeInput = this.page.getByTestId(TIME_INPUT)
		this.fieldFrom = this.page.getByTestId(FIELD_FROM)
		this.fieldTo = this.page.getByTestId(FIELD_TO)
		this.leftArrow = this.page.getByTestId(ICON_LEFT_ARROW)
		this.rightArrow = this.page.getByTestId(ICON_RIGHT_ARROW)
		this.monthTitle = this.page.getByTestId(MONTH_TITLE)
		this.yearTitle = this.page.getByTestId(YEAR_TITLE)
		this.calendar = this.page.getByTestId(CALENDAR)
		this.calendarYear = this.page.getByTestId(CALENDAR_YEAR)
		this.calendarMonth = this.page.getByTestId(CALENDAR_MONTH)
		this.calendarDay = this.page.getByTestId(CALENDAR_DAY)
	}

	public async getDateTime(periodName: string): Promise<string> {
		const periodField = periodName === FROM ? this.periodFrom : this.periodTo
		const date = await periodField.locator(this.datePicker).inputValue()
		const time = await periodField.locator(this.timeInput).inputValue()

		return `${date} ${time}`
	}

	public async fillForm(fromDate: string, fromTime: string, toDate: string, toTime: string) {
		await this.fieldFrom.locator(this.datePicker).clear()
		await this.fieldFrom.locator(this.datePicker).fill(fromDate)

		await this.fieldFrom.locator(this.timeInput).clear()
		await this.fieldFrom.locator(this.timeInput).fill(fromTime)

		await this.fieldTo.locator(this.datePicker).clear()
		await this.fieldTo.locator(this.datePicker).fill(toDate)

		await this.fieldTo.locator(this.timeInput).clear()
		await this.fieldTo.locator(this.timeInput).fill(toTime)
	}

	public async openCalendar() {
		// открываем календарь в поле "По"
		await this.datePicker.nth(1).click()
	}

	public async selectMonth(month: string) {
		const button = month === 'previous'
			? this.leftArrow
			: this.rightArrow

		await button.click()
	}

	public async openYearsList() {
		await this.yearTitle.click()
	}

	public async openMonthsList() {
		await this.monthTitle.click()
	}

	public async checkYearButtons(from: number) {
		for (let i = 0; i < 20; i++) {
			const yearItem = this.calendarYear.nth(i).locator('span')
			expect(await yearItem.textContent()).toEqual(from.toString())
			from++
		}
	}

	public async checkMonths() {
		const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

		for (const month of months) {
			await expect(this.calendarMonth.locator(`span >> text=${month}`)).toBeVisible()
		}
	}

	public async selectDay(): Promise<string> {
		const day = this.calendarDay.last()
		let date = await day.locator('span').textContent() as string

		if (date.length === 1) date = '0' + date
		await day.click()

		return date
	}

	public async selectRandomDate(daysCount: number) {
		const randomIndex = Math.floor(Math.random() * daysCount)

		await this.calendarDay.nth(randomIndex).click()
		await this.page.waitForTimeout(1000)
	}
}