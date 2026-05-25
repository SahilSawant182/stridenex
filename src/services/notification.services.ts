import { apiService } from './api.services';

export interface Notification {
  name: string;
  subject: string;
  type: string;
  email_content: string | null;
  document_type: string;
  document_name: string;
  from_user: string;
  creation: string;
  read: number;
}

export interface NotificationResponse {
  message: {
    status: string;
    user: string;
    unread_count: number;
    count: number;
    data: Notification[];
  };
}

export const getNotifications = async (ownerEmail: string): Promise<NotificationResponse> => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.notification.get_notifications?owner_email=${ownerEmail}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string, ownerEmail: string): Promise<void> => {
  try {
    await apiService.post(
      `method/stridenex_app.api_stridenex_app.notification.mark_as_seen?notification_name=${notificationId}&owner_email=${ownerEmail}`
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (ownerEmail: string): Promise<void> => {
  try {
    await apiService.post(
      `method/stridenex_app.api_stridenex_app.notification.mark_all_as_seen?owner_email=${ownerEmail}`
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
