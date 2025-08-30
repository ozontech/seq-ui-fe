import type { VNode } from "vue"

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
