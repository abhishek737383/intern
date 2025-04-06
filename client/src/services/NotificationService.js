// src/services/NotificationService.js
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  return Notification.permission;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
};
