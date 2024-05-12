import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import "./AddObservationPage.css";

function UpdateObservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const observation = location.state?.observation;
  console.log("UPDATE:", observation);

  const formattedObservationTime = new Date(observation.observation_time).toISOString().slice(0, 16);

  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [skyConditionsOptions, setSkyConditionsOptions] = useState([]);
  const [selectedSkyCondition, setSelectedSkyCondition] = useState(observation.sky_conditions);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [targets, setTargets] = useState(observation.targets);
  const [observationTime, setObservationTime] = useState(formattedObservationTime);
  const [personal_observations, setPersonalObservations] = useState(observation.personal_observations);
  const [locationData, setLocationData] = useState({ latitude: null, longitude: null });
  const [locationString, setLocationString] = useState(observation.location);
  const [observationPrivacy, setObservationPrivacy] = useState(observation.privacy);

  const toggleObservationPrivacy = () => {
    setObservationPrivacy(prevPrivacy => (prevPrivacy === 1 ? 0 : 1));
  };


  useEffect(() => {
    const fetchEquip = async () => {
      try {
        const all_names = [];
        for (const idEquip of observation.equipment) {
          console.log("ID EQUIPMENT:", idEquip);
          const response = await fetch(`http://127.0.0.1:8000/polaris/equipments/${idEquip}/`);
          if (!response.ok) {
            throw new Error('Failed to fetch equipment ID');
          }
          const data = await response.json();
          const name = data.name;
          all_names.push(name);
          console.log("NAME: ", name);
        }
        console.log("all names: ", all_names);
        setSelectedEquipment(all_names);
      } catch (error) {
        console.error('Error fetching equipment options:', error);
      }
    };
  
    fetchEquip();
  }, []);
  
  

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

  useEffect(() => {
    if (locationData.latitude !== null && locationData.longitude !== null) {
      setLocationString(`${locationData.latitude};${locationData.longitude}`);
    }
  }, [locationData]);

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


  useEffect(()=> {
    const fetchSkyC = async () => {
    try{
      const response = await fetch(`http://127.0.0.1:8000/polaris/skyconditions/${observation.sky_conditions}`);
        if (!response.ok) {
          throw new Error('Failed to fetch equipment ID');
        }
        const data = await response.json();
        const sky_c = data.name;
        setSelectedSkyCondition(sky_c);
        console.log("sky_c:", selectedSkyCondition);
    }
    catch (error) {
      console.error('Error updating observation:', error);
    }
  }
  fetchSkyC();
  }, [])
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const equipmentIds = [];

    try {
      for (const itemName of selectedEquipment) {
        const response = await fetch(`http://127.0.0.1:8000/polaris/get-equipment-id/${itemName}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch equipment ID');
        }
        const data = await response.json();
        const eqId = data.id;
        equipmentIds.push(eqId);
      }

      const response2 = await fetch(`http://127.0.0.1:8000/polaris/get-sky-condition-id/${selectedSkyCondition}/`);
      if (!response2.ok) {
        throw new Error('Failed to fetch sky condition ID');
      }
      const data = await response2.json();
      const scId = data.id;
      console.log("scId:", scId);

      const observationData = {
        user: getUserIdFromCookie(),
        targets,
        observation_time: observationTime,
        sky_conditions: scId,
        equipment: equipmentIds,
        personal_observations,
        location: locationString,
        privacy: observationPrivacy
      };

      console.log("OBSERVATION BEFORE FETCHING:", observationData);
      const response = await fetch(`http://127.0.0.1:8000/polaris/observations/${observation.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(observationData),
      });

      if (!response.ok) {
        throw new Error('Failed to update observation');
      }
      console.log('Observation updated successfully');
      setShowSuccessMessage(true);
      setShowErrorMessage(false);
    } catch (error) {
      console.error('Error updating observation:', error);
      setShowErrorMessage(true);
      setShowSuccessMessage(false);
    }

  };

  const handleSkyConditionChange = async (event) => {
    const selectedCondition = event.target.value;
    setSelectedSkyCondition(selectedCondition);
  };

  const handleEquipmentChange = (itemName, checked) => {
    if (checked) {
      setSelectedEquipment(prevSelected => [...prevSelected, itemName]);
    } else {
      setSelectedEquipment(prevSelected => prevSelected.filter(item => item !== itemName));
    }
  };
  

  return (
    <div className="container-add-page">
      <div className="left">
        <h1>Update Observation</h1>
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
              <input type="datetime-local" value={observationTime} onChange={(e) => setObservationTime(e.target.value)} className="input-add-page" />
            </label>
          </div>

          <div className="form-group">
            <label className="label-add-page">
              Sky Conditions:
              <select value={selectedSkyCondition} onChange={handleSkyConditionChange} className="input-add-page">
                <option value={observation.sky_conditions}>Select Sky Conditions</option>
                {skyConditionsOptions.map((condition, index) => (
                  <option key={index} value={condition}>{condition}</option>
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
                    checked={selectedEquipment.includes(option)}
                    onChange={(e) => handleEquipmentChange(option, e.target.checked)}
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
              initialLocation={locationString}
              onLocationChange={(lat, lng) => {
                console.log("Latitude:", lat);
                console.log("Longitude:", lng);
                setLocationData({ latitude: lat, longitude: lng });
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

          <div className="form-group">
            <label className="label-add-page">
              Privacy:
              <input
                type="checkbox"
                checked={observationPrivacy === 1}
                onChange={toggleObservationPrivacy}
              />
              <span className={`privacy-point ${observationPrivacy === 1 ? 'private' : 'public'}`} />
            </label>
          </div>

          <button type="submit" className="button-add-page">Update</button>
          {showSuccessMessage && (
            <div style={{ marginTop: '20px', color: 'green' }}>
              Observation added successfully! <Link to="/observationspage">View Observations</Link>
            </div>
          )}
          {showErrorMessage && (
            <div style={{ marginTop: '20px', color: 'red' }}>Failed to add observation. Please try again.</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UpdateObservationPage;
