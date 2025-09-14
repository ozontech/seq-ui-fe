import type { SeqapiV1FieldDto } from '~/api/generated/seq-ui-server'

export type Keyword = SeqapiV1FieldDto

export type TextFieldsMap = Record<string, 'text' | 'keyword'>
