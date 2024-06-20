import React, { useEffect, useState } from 'react';
import './NotificationsPage.css';
import littleBell from './little_bell.png';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = getUserIdFromCookie();
        const response = await fetch(`http://127.0.0.1:8000/polaris/notifications-user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const notificationsData = await response.json();
        console.log(notificationsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = (notificationId) => {
    // Handle accept logic here
  };

  const handleDecline = (notificationId) => {
    // Handle decline logic here
  };

  const calculateMinutesPassed = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const minutesPassed = Math.floor((currentDate - createdDate) / (1000 * 60));
    return minutesPassed;
  };

  return (
    <div className="notification-page">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <div key={notification.id} className="notification-box">
            <div>
            <img src={littleBell} alt="Notification bell" className="notification-icon" />
            <p2 className='notif-descr'>{notification.description}</p2>
            <p>{calculateMinutesPassed(notification.created_at)} minutes ago</p>
            </div>
            {notification.purpose && notification.purpose.toLowerCase().includes('event') && (
              <div className="button-container">
                <button onClick={() => handleAccept(notification.id)}>Accept</button>
                <button onClick={() => handleDecline(notification.id)}>Decline</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
}

export default NotificationsPage;
