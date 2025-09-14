import type { VNode } from 'vue'
import type { Log } from '~/types/messages'

import { renderLogSizeDecorator } from './size'

export const decorators: Record<keyof Log, (log: Log) => string | VNode> = {
  size: renderLogSizeDecorator
} as const
