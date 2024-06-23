import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./EventsPage.css";

function EventsPage() {
  const [personalEvents, setPersonalEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        console.error('User ID cookie not found');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/events/`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();

        const userEvents = data.filter(event => event.organizer === parseInt(userId));
        const userParticipatingEvents = data.filter(event => event.participants.includes(parseInt(userId)));

        setPersonalEvents(userEvents);
        setParticipatingEvents(userParticipatingEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEvents();
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
    <div className="events-page">
      <div className="column">
        <h2>Events created by you:</h2>
        <div className="events-list">
          {personalEvents.length > 0 ? (
            personalEvents.map(event => (
              <div className="event-card" key={event.id}>
                <div className="event-content">
                  <p className="event-title" onClick={() => handleTitleClick(event.id)}>{event.title}</p>
                  <p className="event-start-time">{formatDate(event.start_time)}</p>
                  <div className="event-details">
                    <p><strong>Description:</strong> {event.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No events created by you found.</p>
          )}
        </div>
      </div>
      <div className="column">
        <h2>Events you are participating in:</h2>
        <div className="events-list">
          {participatingEvents.length > 0 ? (
            participatingEvents.map(event => (
              <div className="event-card" key={event.id}>
                <div className="event-content">
                  <p className="event-title" onClick={() => handleTitleClick(event.id)}>{event.title}</p>
                  <p className="event-start-time">{formatDate(event.start_time)}</p>
                  <div className="event-details">
                    <p><strong>Description:</strong> {event.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No events you are participating in found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
