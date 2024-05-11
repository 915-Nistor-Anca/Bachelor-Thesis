import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ObservationsPage.css";

function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const [skyConditionsMap, setSkyConditionsMap] = useState({});
  const [equipmentMap, setEquipmentMap] = useState({});
  const [selectedContinent, setSelectedContinent] = useState('All');
  const navigate = useNavigate();



  function getContinent(latitude, longitude) {
    if (latitude >= 0 && latitude <= 90 && longitude >= -170 && longitude <= -50) {
      return 'North America';
    } else if (latitude >= -60 && latitude <= 15 && longitude >= -90 && longitude <= -30) {
      return 'South America';
    } else if (latitude >= 30 && latitude <= 75 && longitude >= -30 && longitude <= 40) {
      return 'Europe';
    } else if (latitude >= -10 && latitude <= 30 && longitude >= 30 && longitude <= 180) {
      return 'Asia';
    } else if (latitude >= -55 && latitude <= 11 && longitude >= -20 && longitude <= 51) {
      return 'Africa';
    } else if (latitude >= -55 && latitude <= -10 && longitude >= 105 && longitude <= 155) {
      return 'Australia';
    } else {
      return 'Unknown';
    }
  }

  const filterObservationsByContinent = (observation) => {
    if (selectedContinent === 'All') {
      return true;
    }
    const latitude = observation.location.split(';')[0];
    const longitude = observation.location.split(';')[1];
    const continent = getContinent(latitude, longitude);
    return continent === selectedContinent;
  };

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
    <div className="observations-page-container">
    <div>
      {/* <h1>Observations Page</h1> */}
      <div>
        <label htmlFor="continent-filter">Filter by continent:</label>
        <select id="continent-filter" value={selectedContinent} onChange={(e) => setSelectedContinent(e.target.value)}>
          <option value="All">All continents</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="Africa">Africa</option>
          <option value="Australia">Australia</option>
        </select>
      </div>
    <div className="ObservationsPage">
      <div className="observation-list">
        {observations.filter(filterObservationsByContinent).map(observation => (
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
    </div>
  );
}

export default ObservationsPage;
