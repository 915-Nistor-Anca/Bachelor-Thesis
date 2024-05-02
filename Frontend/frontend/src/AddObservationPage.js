import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { useNavigate } from 'react-router-dom';

function AddObservationPage() {
  const navigate = useNavigate();
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/polaris/equipments/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch equipment options');
        }
  
        const data = await response.json();
        const options = data.map(option => option.name);
  
        setEquipmentOptions(options);
      } catch (error) {
        console.error('Error fetching equipment options:', error);
      }
    };

    fetchEquipmentOptions();
  }, []);
  

  const skyConditionsOptions = ['Clear', 'Partly Cloudy','Cloudy', 'Overcast', 'Foggy', 'Rainy', 'Snowy', 'Stormy', 'Windy', 'Hazy'];
  

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
  }, []); 

  const [targets, setTargets] = useState('');
  const [observation_time, setObservationTime] = useState('');
  const [sky_conditions, setSkyConditions] = useState('');
  const [equipment, setEquipment] = useState('');
  const [personal_observations, setPersonalObservations] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationString, setLocationString] = useState('');

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setLocationString(`${location.latitude};${location.longitude}`);
    }
  }, [location]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const ids = [];
    console.log(equipment);
    console.log(equipmentOptions);
    
    equipment.forEach((itemName) => {
      console.log(itemName);
      const foundIndex = equipmentOptions.indexOf(itemName);
      if (foundIndex !== -1) {
        ids.push(foundIndex);
      }
    });
    
    console.log("IDS:", ids);
    

    const observation = {
      user:getUserIdFromCookie(),
      targets,
      observation_time,
      sky_conditions,
      equipment:ids,
      personal_observations,
      location: locationString,
    };

    try {
      console.log(observation);
      const response = await fetch('http://127.0.0.1:8000/polaris/observations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(observation),
      });

      if (!response.ok) {
        throw new Error('Failed to add observation');
      }
      console.log('Observation added successfully');

      const locationInput = document.getElementById('location-input');
      if (locationInput) {
        locationInput.value = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
      }
    } catch (error) {
      console.error('Error adding observation:', error);
    }
  };

  return (
    <div>
      <h1>Add Observation</h1>
      <form onSubmit={handleFormSubmit}>
        <button type="submit">Submit</button>
        <label>
          Targets:
          <input type="text" value={targets} onChange={(e) => setTargets(e.target.value)} />
        </label>
        <label>
          Observation Time:
          <input type="datetime-local" value={observation_time} onChange={(e) => setObservationTime(e.target.value)} />
        </label>
        <label>
          Sky Conditions:
          <select value={sky_conditions} onChange={(e) => setSkyConditions(e.target.value)}>
            <option value="">Select Sky Conditions</option>
            {skyConditionsOptions.map((condition, index) => (
              <option key={index} value={condition}>{condition}</option>
            ))}
          </select>
        </label>
        <div>
  <label>Equipment:</label>
  <div>
    {equipmentOptions.map((option, index) => (
      <div key={index}>
        <input
          type="checkbox"
          id={`equipment-${index}`}
          name="equipment"
          value={option}
          checked={equipment.includes(option)}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setEquipment((prevEquipment) =>
              isChecked
                ? [...prevEquipment, option]
                : prevEquipment.filter((item) => item !== option)
            );
          }}
        />
        <label htmlFor={`equipment-${index}`}>{option}</label>
      </div>
    ))}
  </div>
</div>
        <label>
          Personal Observations:
          <input type="text" value={personal_observations} onChange={(e) => setPersonalObservations(e.target.value)} />
        </label>
        <label>
          Location:
          <input type="text" value={locationString} readOnly />
        </label>
        <MapComponent
          onLocationChange={(lat, lng) => {
            console.log("Latitude:", lat);
            console.log("Longitude:", lng);
            setLocation({ latitude: lat, longitude: lng });
          }}
        />
      </form>
    </div>
  );
}

export default AddObservationPage;