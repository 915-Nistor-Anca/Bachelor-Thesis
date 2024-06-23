import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.css'; // Make sure to import your CSS file

function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const [observations, setObservations] = useState([]);
  const navigate = useNavigate();

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  useEffect(() => {
    const userId = getUserIdFromCookie();
    if (!userId) {
      console.error('User ID cookie not found');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchObservations = async () => {
      const userId = getUserIdFromCookie();
      const response = await fetch(`http://127.0.0.1:8000/polaris/observations-user/${userId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch observations');
      }
      const data = await response.json();
      setObservations(data);
    };
    fetchObservations();
  }, []);

  const hasObservation = (date) => {
    return observations.some(obs => new Date(obs.observation_time).toDateString() === date.toDateString());
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasObservation(date)) {
      return <span className="highlight">•</span>;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && hasObservation(date)) {
      return 'has-observation';
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <h3>Personal Calendar</h3>
        <Calendar
          onChange={setValue}
          value={value}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
      </div>
      <div className="selected-date-details">
        <h3>Selected Date: {value.toDateString()}</h3>
        <ul>
          {observations
            .filter(obs => new Date(obs.observation_time).toDateString() === value.toDateString())
            .map(obs => (
              <li key={obs.id}>
                <strong>{obs.targets}</strong> at {new Date(obs.observation_time).toLocaleTimeString()}<br />
                Location: {obs.location}<br />
                {/* Sky Conditions: {obs.sky_conditions}<br /> */}
                {/* Equipment: {obs.equipment.join(', ')}<br /> */}
                Notes: {obs.personal_observations}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarPage;
