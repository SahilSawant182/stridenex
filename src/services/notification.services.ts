import { apiService } from './api.services';

export interface Notification {
  name: string;
  title: string;
  message: string;
  select_module: string;
  schedule_a_notification: string;
  status: 'Seen' | 'Unseen';
  creation: string;
}

export interface NotificationResponse {
  message: {
    status: string;
    count: number;
    data: Notification[];
  };
}

export const getNotifications = async (module: string): Promise<NotificationResponse> => {
  try {
    const response = await apiService.get(
      `method/stridenex_app.api_stridenex_app.notification.get_notifications?module=${module}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  // API call disabled for now - keeping function for UI functionality
  // TODO: Enable when API endpoint is ready
  // try {
  //   await apiService.post(
  //     `method/stridenex_app.api_stridenex_app.notification.mark_as_read`,
  //     { notification_id: notificationId }
  //   );
  // } catch (error) {
  //   console.error('Error marking notification as read:', error);
  //   throw error;
  // }
  console.log(`Marking notification ${notificationId} as read (API call disabled)`);
};

export const markAllNotificationsAsRead = async (module: string): Promise<void> => {
  // API call disabled for now - keeping function for UI functionality
  // TODO: Enable when API endpoint is ready
  // try {
  //   await apiService.post(
  //     `method/stridenex_app.api_stridenex_app.notification.mark_all_as_read`,
  //     { module }
  //   );
  // } catch (error) {
  //   console.error('Error marking all notifications as read:', error);
  //   throw error;
  // }
  console.log(`Marking all notifications as read for module ${module} (API call disabled)`);
};
