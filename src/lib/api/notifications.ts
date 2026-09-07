import apiClient from './client';
import { ApiResponse, Notification } from './types';

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
  return res.data.data || [];
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.patch<ApiResponse<void>>(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.patch<ApiResponse<void>>('/notifications/read-all');
};
