import NotificationMonitor from "./notifications.monitor";

export const startMonitoring = () => {
  const notification = new NotificationMonitor();
  notification.start();
};
