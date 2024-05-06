import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ObservationsPage.css";

function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const [skyConditionsMap, setSkyConditionsMap] = useState({});
  const [equipmentMap, setEquipmentMap] = useState({});
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
        const response = await fetch(`http://127.0.0.1:8000/polaris/observations-user/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch observations');
        }
        const data = await response.json();
        setObservations(data);
        console.log('Observations:', data);

        const uniqueSkyConditionIds = new Set(data.map(observation => observation.sky_conditions));
        const uniqueEquipmentIds = new Set(data.flatMap(observation => observation.equipment));

        const skyConditions = {};
        for (const id of uniqueSkyConditionIds) {
          const skyConditionResponse = await fetch(`http://127.0.0.1:8000/polaris/skyconditions/${id}/`);
          if (!skyConditionResponse.ok) {
            console.error(`Failed to fetch sky condition with ID ${id}`);
            continue;
          }
          const skyConditionData = await skyConditionResponse.json();
          skyConditions[id] = skyConditionData.name;
        }
        setSkyConditionsMap(skyConditions);

        const equipment = {};
        for (const id of uniqueEquipmentIds) {
          const equipmentResponse = await fetch(`http://127.0.0.1:8000/polaris/equipments/${id}/`);
          if (!equipmentResponse.ok) {
            console.error(`Failed to fetch equipment with ID ${id}`);
            continue;
          }
          const equipmentData = await equipmentResponse.json();
          equipment[id] = equipmentData.name;
        }
        setEquipmentMap(equipment);
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

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/observations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete observation');
      }
      setObservations(observations.filter(observation => observation.id !== id));
      
      console.log('Observation deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting observation:', error);
    }
  };

  const handleUpdate = async (observation) => {
    console.log("HANDLE UPDATE:", observation);
    navigate('/updateobservationpage', { state: { observation } });
  };

  return (
    <div>
    <h1>Observations Page</h1>
    <div className="ObservationsPage">
      <div className="observation-list">
        {observations.map(observation => (
          <div className="observation" key={observation.id}>
            <div className="observation-content">
              <p><strong>Targets:</strong> {observation.targets}</p>
              <p><strong>Location:</strong> {observation.location}</p>
              <p><strong>Observation Time:</strong> {observation.observation_time}</p>
              <p><strong>Sky Conditions:</strong> {skyConditionsMap[observation.sky_conditions]}</p>
              <p><strong>Equipment:</strong> {observation.equipment.map(id => equipmentMap[id]).join(', ')}</p>
              <p><strong>Personal Observations:</strong> {observation.personal_observations}</p>
            </div>
            <div className="observation-buttons">
              <button className='button-observations-page' onClick={() => handleDelete(observation.id)}>Delete</button>
              <button className='button-observations-page' onClick={() => { console.log(observation); handleUpdate(observation); }}>Update</button>

            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default ObservationsPage;
