import type { Duration } from '@/types/duration'
import type { IntervalType } from './input'

export type Order = 'asc' | 'desc'

export type Message = {
  _id: string
  timestamp: string
  message: string
} & Record<string, unknown>

export type Log = Message

export type MessageKeys = keyof Omit<Message, 'rawTime'>

export interface SearchWarning {
	title: string | null
	message: string
}

export type GetRawIntervalOptions = {
	from: Duration | Date
	to: Duration | Date | null
	type: IntervalType
}
