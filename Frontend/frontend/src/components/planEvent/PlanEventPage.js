import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanEventPage.css';
import MapComponent from '../MapComponent';

function PlanEventPage() {
  const navigate = useNavigate();
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showTargetsOptions, setShowTargetsOptions] = useState(false);
  const [showPlanetsOptions, setShowPlanetsOptions] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationString, setLocationString] = useState('');
  const [selectedTargets, setSelectedTargets] = useState({
    planetObservation: false,
    solarEclipse: false,
    lunarEclipse: false
  });

  const handleLocationOption = () => {
    setShowLocationOptions(true);
  };

  const handleTargetsOption = () => {
    setShowTargetsOptions(true);
  };

  const handlePlanetsOption = () => {
    if (selectedTargets.planetObservation) {
      setShowPlanetsOptions(true);
    } else {
      setShowPlanetsOptions(false);
    }
  };
  

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setLocationString(`${location.latitude};${location.longitude}`);
    }
  }, [location]);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  useEffect(() => {
    const fetchObservations = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        console.error('User ID cookie not found');
        navigate('/login');
        return;
      }
    };
    fetchObservations();
  }, [navigate]);

  return (
    <div className="plan-event-page">
      {!showLocationOptions && (
        <React.Fragment>
          <h1>Welcome to Polaris Observation Planner!</h1>
          <p>
            Planning your next celestial observation event has never been easier or more fun! Here's a quick guide to help you get started:
          </p>
          <ol>
            <li><strong>Select Your Location</strong>: Begin by choosing the perfect location for your event. Use our interactive map to pinpoint your exact spot. This helps us tailor recommendations based on your specific location.</li>
            <li><strong>Choose Your Targets</strong>: What do you want to observe? Select from planets, solar eclipses, lunar eclipses, or other celestial events. For planets, you can even specify how many days in advance you want to plan.</li>
            <li><strong>Get Recommendations</strong>: Based on your location and targets, we'll suggest the best dates and times for your event. We'll also provide equipment recommendations to ensure you have the best viewing experience.</li>
            <li><strong>Finalize Your Event</strong>: Fill in the details for your event: give it a catchy title, add a description. You can also invite friends to join your event!</li>
            <li><strong>Review and Plan</strong>: Once everything is set, review your event details. You can see all your planned events in your personal calendar and get notifications as the date approaches.</li>
            <li><strong>Enjoy the Sky!</strong>: On the day of your event, use our reminders and tips to make sure everything goes smoothly. Capture the wonders of the universe with your friends and equipment.</li>
          </ol>
          <p>Ready to explore the stars? Let’s get started! 🌟🌌✨</p>
          <button onClick={handleLocationOption} className="plan-observation-button">Plan observation</button>
        </React.Fragment>
      )}
      {showLocationOptions && !showTargetsOptions && (
        <div className="observation-options">
          <h2>Start planning your event!</h2>
          <p>Firstly, please select a location from the map:</p>
          <div className="map-container-plan-event-page">
            <MapComponent
              onLocationChange={(lat, lng) => {
                console.log("Latitude:", lat);
                console.log("Longitude:", lng);
                setLocation({ latitude: lat, longitude: lng });
              }}
            />
          </div>
          <label>
            Location:
            <input type="text" value={locationString} readOnly />
          </label>
          <button onClick={handleTargetsOption} className="plan-observation-button">Choose selected location</button>
        </div>
      )}
      {showTargetsOptions && (
        <div className="observation-options">
          <h2>Select Observation Options</h2>
          <p>Select your observation targets:</p>
          <label>
            <input
              type="checkbox"
              checked={selectedTargets.planetObservation}
              onChange={(e) => setSelectedTargets({ ...selectedTargets, planetObservation: e.target.checked })}
            />
            Find best time for observing a planet
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={selectedTargets.solarEclipse}
              onChange={(e) => setSelectedTargets({ ...selectedTargets, solarEclipse: e.target.checked })}
            />
            Next solar eclipse
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={selectedTargets.lunarEclipse}
              onChange={(e) => setSelectedTargets({ ...selectedTargets, lunarEclipse: e.target.checked })}
            />
            Next lunar eclipse
          </label>
          <button onClick={handlePlanetsOption} className="plan-observation-button">Choose selected location</button>
        </div>
      )}
      {showPlanetsOptions && (
        <div className="planet-options">
            <h2>Select Planet</h2>
            <select>
            <option value="mercury">Mercury</option>
            <option value="venus">Venus</option>
            <option value="mars">Mars</option>
            <option value="jupiter">Jupiter</option>
            <option value="saturn">Saturn</option>
            <option value="uranus">Uranus</option>
            <option value="neptune">Neptune</option>
            <option value="pluto">Pluto</option>
            </select>
            <label htmlFor="days">Days in advance:</label>
            <input type="number" id="days" name="days" min="1" max="365" defaultValue="1" />
            {/* <button onClick={handleFetchBestObservationTimes}>Fetch Best Observation Times</button> */}
        </div>
)}

    </div>
  );
}

export default PlanEventPage;
