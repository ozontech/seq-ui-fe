import type { VNode } from "vue"

// todo: remove? src/api/services/seq-ui-server.ts:53
const sendNotification = (options: {
  renderContent: VNode | string
}) => {
  console.log(options.renderContent);
}

export const Notification = {
  alert: sendNotification,
  info: sendNotification,
  negative: sendNotification,
  success: sendNotification,
  warn: sendNotification
}
