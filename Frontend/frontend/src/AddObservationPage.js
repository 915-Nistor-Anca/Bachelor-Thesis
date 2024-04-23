import React, { useState } from 'react';
import MapComponent from './MapComponent'; // Replace with your map component

function AddObservationPage() {
  const [targets, setTargets] = useState('');
  const [observationTime, setObservationTime] = useState('');
  const [skyConditions, setSkyConditions] = useState('');
  const [equipment, setEquipment] = useState('');
  const [personalObservations, setPersonalObservations] = useState('');
  const [location, setLocation] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Create observation object with form data
    const observation = {
      targets,
      observationTime,
      skyConditions,
      equipment,
      personalObservations,
      location,
    };

    try {
      // Send observation data to backend API endpoint
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

      // Handle success (e.g., display success message, redirect user)
      console.log('Observation added successfully');
    } catch (error) {
      console.error('Error adding observation:', error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <div>
      <h1>Add Observation</h1>
      <form onSubmit={handleFormSubmit}>
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
        
        {/* Map component for selecting location */}
        <MapComponent setLocation={setLocation} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddObservationPage;
