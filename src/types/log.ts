export type Log = {
  id: string
  timestamp: string
  message: string
} & Record<string, unknown>
