import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObservations = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
      console.error('User ID cookie not found');
      navigate('/login');
    }
    
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/observations/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch observations');
        }
        const data = await response.json();
        setObservations(data);
        console.log('Observations:', data);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };
    

    fetchObservations();
  }, []);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };


  return (
    <div>
      <h1>Observations Page</h1>
      {observations.map(observation => (
        <div key={observation.id}>
          <p><strong>Targets:</strong> {observation.targets}</p>
          <p><strong>Location:</strong> {observation.location}</p>
          <p><strong>Observation Time:</strong> {observation.observation_time}</p>
          <p><strong>Sky Conditions:</strong> {observation.sky_conditions}</p>
          <p><strong>Equipment:</strong> {observation.equipment}</p>
          <p><strong>Personal Observations:</strong> {observation.personal_observations}</p>
        </div>
      ))}
    </div>
  );
}

export default ObservationsPage;
