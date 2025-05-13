import api from './api';

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Get all notifications for the current user
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<Notification[]>('/notifications');
  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.put(`/notifications/read/${id}`);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};