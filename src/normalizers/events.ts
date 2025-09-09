import { SeqapiV1ErrorCodeDto } from '@/api/generated/seq-ui-server'
import type { SeqapiV1EventDto } from '@/api/generated/seq-ui-server'
import type { FetchMessagesNormalizedData } from '@/api/services/seq-ui-server'
import type { Message } from '@/types/messages'

type Event = SeqapiV1EventDto

export const normalizeJson = (json?: Record<string, string>) => {
  if (!json) {
    return undefined
  }
  const result = Object.fromEntries(Object.entries(json).map(([key, value]) => {
    const result = [key, '']
    try {
      if (!isNaN(Number(value[0]))) {
        return [key, value]
      }
      const parsed = JSON.parse(value)

      let tempResult = parsed
      if (typeof parsed === 'object') {
        tempResult = JSON.stringify(parsed)
      }
      result[1] = tempResult
    } catch {
      result[1] = value
    }
    return result
  }))
  return result
}

export const normalizeEvent = (event: Event) => ({
  ...event,
  data: normalizeJson(event.data),
})

export const normalizeMessage = (event: Event): Message => {
  const timestamp = (event.time || event.data?.time)!

  let zonedTime
  try {
    zonedTime = timestamp + (timestamp.endsWith('Z') ? '' : 'Z')
  } catch {
    const error = `Incorrect timestamp "${timestamp}" for event "${event.id}"`
    console.error(error)
    throw (error)
  }
  return {
    ...event.data,
    message: event.data?.message || '',
    _id: event.id || '',
    timestamp: zonedTime,
  }
}

export const normalizeSearchWarning = (data?: FetchMessagesNormalizedData) => {
  const empty = {
    title: null,
    message: '',
  }

  if (!data?.error) {
    return empty
  }

  switch (data.error?.code) {
    case SeqapiV1ErrorCodeDto.AecNo:
      return empty

    case SeqapiV1ErrorCodeDto.AecPartialResponse:
      return {
        title: 'Частичный ответ',
        message: 'Не удалось получить ответ от всех шардов',
      }

    case SeqapiV1ErrorCodeDto.AecQueryTooHeavy:
    case SeqapiV1ErrorCodeDto.AecTooManyFractionsHit:
      return {
        title: 'Слишком большой интервал поиска',
        message: `Попробуйте уменьшить выбранный временной интервал (код: ${data.error.code})`,
      }

    default:
      return {
        title: null,
        message: data.error.message as string,
      }
  }
}

export const denormalizeMessage = (event: Record<string, unknown> | ReturnType<typeof normalizeMessage>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, timestamp, rawTime, ...rest } = event
  return ({
    ...rest,
    id: _id,
    timestamp: rawTime,
  })
}
