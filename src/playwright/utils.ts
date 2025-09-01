import { faker } from '@faker-js/faker'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export async function getRandomPastDate(): Promise<Dayjs> {
	const daysBack = faker.number.int({ min: 1, max: 30 })
	return dayjs().subtract(daysBack, 'day')
}

export async function getRandomTime(): Promise<string> {
	const pad = (num: number): string => num.toString().padStart(2, '0')

	return [
		pad(Math.floor(Math.random() * 24)),
		pad(Math.floor(Math.random() * 60)),
		pad(Math.floor(Math.random() * 60)),
	].join(':')
}