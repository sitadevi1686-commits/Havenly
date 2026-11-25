import { mockDb } from './mockDatabase';

export const notificationService = {
  getUserNotifications(userId) {
    return mockDb.getNotifications(userId);
  },

  markAsRead(notificationId) {
    const all = mockDb.getNotifications();
    const updated = all.map(n => n.id === notificationId ? { ...n, read: true } : n);
    mockDb.saveNotifications(updated);
    return updated;
  },

  markAllAsRead(userId) {
    const all = mockDb.getNotifications();
    const updated = all.map(n => n.user_id === userId ? { ...n, read: true } : n);
    mockDb.saveNotifications(updated);
    return updated.filter(n => n.user_id === userId);
  },

  createNotification(userId, title, message, type = 'general', link = null) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      user_id: userId,
      title,
      message,
      type,
      read: false,
      link,
      created_at: new Date().toISOString()
    };
    const all = mockDb.getNotifications();
    mockDb.saveNotifications([newNotif, ...all]);
    return newNotif;
  }
};
