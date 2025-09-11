import { toast } from "vue-sonner";

type Options = {
  type?: 'error' | 'info' | 'success' | 'warning'
  renderContent: string
}

// todo: remove? src/api/services/seq-ui-server.ts:53
const sendNotification = ({
  type = 'info',
  renderContent,
}: Options) => {
  toast[type](renderContent)
}

export const Notification = {
  alert: (options: Options) => sendNotification({...options, type: 'error'}),
  info: (options: Options) => sendNotification(options),
  negative: (options: Options) => sendNotification({...options, type: 'error'}),
  success: (options: Options) => sendNotification({...options, type: 'success'}),
  warn: (options: Options) => sendNotification({...options, type: 'warning'})
}
