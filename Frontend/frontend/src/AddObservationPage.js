import React, { useState } from 'react';
import MapComponent from './MapComponent';

function AddObservationPage() {
  const [targets, setTargets] = useState('');
  const [observationTime, setObservationTime] = useState('');
  const [skyConditions, setSkyConditions] = useState('');
  const [equipment, setEquipment] = useState('');
  const [personalObservations, setPersonalObservations] = useState('');
  const [location, setLocation] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const observation = {
      targets,
      observationTime,
      skyConditions,
      equipment,
      personalObservations,
      location,
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
          <input type="datetime-local" value={observationTime} onChange={(e) => setObservationTime(e.target.value)} />
        </label>
        <label>
          Sky Conditions:
          <input type="text" value={skyConditions} onChange={(e) => setSkyConditions(e.target.value)} />
        </label>
        <label>
          Equipment:
          <input type="text" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
        </label>
        <label>
          Personal Observations:
          <textarea value={personalObservations} onChange={(e) => setPersonalObservations(e.target.value)} />
        </label>
        
        {/* Pass setLocation function to MapComponent */}
        <MapComponent setLocation={setLocation} />

      </form>
      {/* Display selected location */}
      {location && (
        <div>
          <h3>Selected Location:</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default AddObservationPage;
