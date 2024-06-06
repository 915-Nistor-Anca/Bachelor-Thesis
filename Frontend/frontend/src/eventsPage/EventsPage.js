import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./EventsPage.css";

function EventsPage() {
  const [personal_events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObservations = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        console.error('User ID cookie not found');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/events-user/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        console.log('Events:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchObservations();
  }, []);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleTitleClick = (eventId) => {
    console.log(eventId);
    navigate(`/events/${eventId}`);
  };

  return (
    <div>
        <h2>Events created by you:</h2>
      <div className="event-list">
        {personal_events.map(event => (
          <div className="event" key={event.id}>
            <div className="event-content">
            <p className='event-title' onClick={() => handleTitleClick(event.id)}>{event.title}</p>
              <p className='event-start-time'>{formatDate(event.start_time)}</p>
              <div className='event-details'>
              <p><strong>Description:</strong> {event.description}</p>
              {/* <p><strong>Organizer:</strong> {"you"}</p>
              <p><strong>Location:</strong> {event.location_latitude}; {event.location_longitude}</p>
              <p><strong>Created at:</strong> {formatDate(event.created_at)}</p> */}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
