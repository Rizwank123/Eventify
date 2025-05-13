import React, { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

const NotificationsPage: React.FC = () => {
  const { notifications, loading, error, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    for (const notification of notifications.filter(n => !n.read)) {
      await markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const readNotifications = notifications.filter(notification => notification.read);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with event changes and announcements</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            leftIcon={<CheckCheck className="h-5 w-5" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-gray-500">
            You don't have any notifications at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle>New Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {unreadNotifications.map(notification => (
                    <li key={notification.id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDateTime(notification.timestamp)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-500 hover:text-gray-700"
                          leftIcon={<Check className="h-4 w-4" />}
                        >
                          Mark as read
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {readNotifications.length > 0 && (
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle>Previous Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {readNotifications.map(notification => (
                    <li key={notification.id} className="py-4 opacity-75">
                      <p className="text-sm font-medium text-gray-700">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(notification.timestamp)}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;