import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { useNavigate } from 'react-router-dom';
import "./AddObservationPage.css";

function AddObservationPage() {
  const navigate = useNavigate();


  //getting equipment and sky condition data from the server
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [skyConditionsOptions, setSkyConditionsOptions] = useState([]);

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
  

  useEffect(() => {
    const fetchSkyConditions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/polaris/skyconditions/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch sky conditions options');
        }
  
        const data = await response.json();
        const options = data.map(option => option.name);
  
        setSkyConditionsOptions(options);
      } catch (error) {
        console.error('Error fetching sky conditions options:', error);
      }
    };

    fetchSkyConditions();
  }, []);
  


  //cookie 
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
    const equipmentIds = [];
  
    try {
      for (const itemName of equipment) {
        const response = await fetch(`http://127.0.0.1:8000/polaris/get-equipment-id/${itemName}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch equipment ID');
        }
        const data = await response.json();
        const eqId = data.id;
        console.log('Selected equipment ID:', eqId);
        equipmentIds.push(eqId);
      }
  
      const observation = {
        user: getUserIdFromCookie(),
        targets,
        observation_time,
        sky_conditions,
        equipment: equipmentIds,
        personal_observations,
        location: locationString,
      };
  
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
  
  const [selectedSkyCondition, setSelectedSkyCondition] = useState('');
  const handleSkyConditionChange = async (event) => {
    setSelectedSkyCondition(event.target.value);
    const selectedCondition = event.target.value;
    console.log(selectedCondition);
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/get-sky-condition-id/${selectedCondition}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch sky condition ID');
      }
      const data = await response.json();
      const skyConditionId = data.id;
      console.log('Selected Sky Condition ID:', skyConditionId);
      setSkyConditions(skyConditionId);
    } catch (error) {
      console.error('Error fetching sky condition ID:', error);
    }
  };

  return (
    <div className="container-add-page">
      <div className="left">
        <h1>Add Observation</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="label-add-page">
              Targets:
              <input type="text" value={targets} onChange={(e) => setTargets(e.target.value)} className="input-add-page" />
            </label>
          </div>

          <div className="form-group">
            <label className="label-add-page">
              Observation Time:
              <input type="datetime-local" value={observation_time} onChange={(e) => setObservationTime(e.target.value)} className="input-add-page" />
            </label>
          </div>

          <div className="form-group">
            <label className="label-add-page">
              Sky Conditions:
              <select value={selectedSkyCondition} onChange={handleSkyConditionChange} className="input-add-page">
                <option value="">Select Sky Conditions</option>
                {skyConditionsOptions.map((condition, index) => (
                  <option key={index} value={condition.id}>{condition}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label className="label-add-page">
              Equipment:
            </label>
            <div className="checkbox-container">
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
                    className="checkbox-add-page"
                  />
                  <label htmlFor={`equipment-${index}`} className="label-add-page">{option}</label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div className="right">
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="label-add-page">
            Location:
            <input type="text" value={locationString} readOnly className="input-add-page" />
          </label>
          </div>

          <div className="form-group">
        <div className="map-container-add-page">
          <MapComponent
            onLocationChange={(lat, lng) => {
              console.log("Latitude:", lat);
              console.log("Longitude:", lng);
              setLocation({ latitude: lat, longitude: lng });
            }}
          />
        </div>
        </div>
        
        <div className="form-group">
            <label className="label-add-page">
              Personal Observations:
              <input type="text" value={personal_observations} onChange={(e) => setPersonalObservations(e.target.value)} className="input-add-page" />
            </label>
          </div>

          <button type="submit" className="button-add-page">Submit</button>
          </form>
      </div>
      
    </div>
  );
}

export default AddObservationPage;