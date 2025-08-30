import type { Duration } from '@/types/duration'
import type { IntervalType } from './input'

export type Order = 'asc' | 'desc'

export type Message = {
	k8s_namespace?: string
	k8s_pod?: string
	source?: string
	message?: string
	zone?: string
	service?: string
	k8s_container?: string
	_id?: string
	timestamp: string
	rawTime: Date
	level?: number
	caller?: string
	action?: string
	trace_id?: string
	span_id?: string
}

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
