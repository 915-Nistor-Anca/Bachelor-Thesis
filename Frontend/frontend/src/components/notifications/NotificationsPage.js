import React, { useEffect, useState } from 'react';
import './NotificationsPage.css';
import littleBell from './little_bell.png';
import { useNavigate } from 'react-router-dom';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const navigate = useNavigate();

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

  const fetchEventDetails = async (eventId) => {
    if (eventId) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/events/${eventId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await response.json();
        setEventDetails(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    }
  };

  const fetchUsername = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
  
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  };
  

  const handleResponse = async (notification, action) => {
    if (!notification.purpose.includes(';')) {
      console.error('Invalid notification purpose format');
      return;
    }

    const eventId = notification.purpose.split(';')[1];
    const userId = getUserIdFromCookie();
    const username = await fetchUsername(userId);
    if (!username) {
      console.error('Username not found');
      return;
    }
  const description = `Your friend, ${username}, ${action} your invitation to the event.`;
    const purpose = `confirmation;${eventId}`;

    try {
      const updatedNotification = {
        ...notification,
        read: 1,
      };
      console.log("upd notif:", updatedNotification);
      const resp = await fetch(`http://127.0.0.1:8000/polaris/notifications/${notification.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotification),
      });

      if (!resp.ok) {
        throw new Error("Failed to change read.");
      }

      if (action === 'accepted') {
        const eventResponse = await fetch(`http://127.0.0.1:8000/polaris/events/${eventId}/`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();

        const updatedParticipants = [...eventData.participants, notification.notification_receiver];

        const updateResponse = await fetch(`http://127.0.0.1:8000/polaris/events/${eventId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ participants: updatedParticipants }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update event participants');
        }

        alert('You have successfully joined the event!');
      }

      await fetch(`http://127.0.0.1:8000/polaris/notifications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          purpose: purpose,
          notification_sender: notification.notification_receiver,
          notification_receiver: notification.notification_sender,
          read: 0
        }),
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notification.id ? { ...notif, read: 1 } : notif
        )
      );
    } catch (error) {
      console.error('Error updating notification or event:', error);
    }
  };

  const handleAccept = (notification) => {
    handleResponse(notification, 'accepted');
  };

  const handleDecline = (notification) => {
    handleResponse(notification, 'declined');
  };

  const handleOk = async (notification) => {
    try {
      const updatedNotification = {
        ...notification,
        read: 1,
      };
      console.log("upd notif:", updatedNotification);
      const resp = await fetch(`http://127.0.0.1:8000/polaris/notifications/${notification.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotification),
      });

      if (!resp.ok) {
        throw new Error('Failed to mark notification as read.');
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notification.id ? { ...notif, read: 1 } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const calculateMinutesPassed = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const minutesPassed = Math.floor((currentDate - createdDate) / (1000 * 60));
    return minutesPassed;
  };
  const unreadNotifications = notifications
  .filter(notification => notification.read === 0)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const readNotifications = notifications
  .filter(notification => notification.read === 1)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


  const handleNotificationClick = (notification) => {
    console.log("handle notif click");
    const purpose = notification.purpose;
    if (purpose && (purpose.toLowerCase().includes('event;') || purpose.toLowerCase().includes('confirmation;'))) {
      console.log("it is an event");
      const eventId = purpose.split(';')[1];
      setEventId(eventId);
      fetchEventDetails(eventId);
      console.log("event details:", eventDetails);
    }
  };

  return (
    <div>
      <div className="notification-page">
        <h2>New Notifications</h2>
        <div className="notification-container">
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map(notification => (
              <div key={notification.id} className="notification-box" onClick={() => handleNotificationClick(notification)}>
                <div>
                  <img src={littleBell} alt="Notification bell" className="notification-icon" />
                  <p className='notif-descr'>{notification.description}</p>
                  <p>{calculateMinutesPassed(notification.created_at)} minutes ago</p>
                </div>
                {notification.purpose && notification.purpose.toLowerCase().includes('event') && (
                  <div className="button-container">
                    <button onClick={() => handleAccept(notification)}>Accept</button>
                    <button onClick={() => handleDecline(notification)}>Decline</button>
                  </div>
                )}
                {notification.purpose && notification.purpose.toLowerCase().includes('confirmation') && (
                  <div className="button-ok-container">
                    <button onClick={() => handleOk(notification)}>OK</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No unread notifications found.</p>
          )}
        </div>
        <h2>Read Notifications</h2>
        <div className="notification-container">
          {readNotifications.length > 0 ? (
            readNotifications.map(notification => (
              <div key={notification.id} className="notification-box" onClick={() => handleNotificationClick(notification)}>
                <div>
                  <img src={littleBell} alt="Notification bell" className="notification-icon" />
                  <p className='notif-descr'>{notification.description}</p>
                  <p>{calculateMinutesPassed(notification.created_at)} minutes ago</p>
                </div>
              </div>
            ))
          ) : (
            <p>No read notifications found.</p>
          )}
        </div>
      </div>
      {eventDetails && (
       <div className='printed-event' onClick={() => navigate(`/events/${eventDetails.id}`)}>
          <h2>Event Details</h2>
          <p><strong>Event Name:</strong> {eventDetails.title}</p>
          <p><strong>Description:</strong> {eventDetails.description}</p>
          <p><strong>Date:</strong> {eventDetails.start_time}</p>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
