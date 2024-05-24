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
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [months, setMonths] = useState(1);
  const [time, setTime] = useState('05:40:00');
  const [showFinalData, setShowFinalData] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const handleTimeChange = (newTime) => {
    setTime(newTime);
    console.log(time);
  };

  const handleLocationOption = () => {
    setShowLocationOptions(true);
  };

  const handleTargetsOption = () => {
    setShowTargetsOptions(true);
  };

  const handleCheckButton = () => {
    setShowFinalData(true);
  }

  const handleShowMonths = () => {
    setShowMonths(true);
  }

  const handleConfirmTargets = async () => {
    const days = months * 30;
    if (selectedTargets.planetObservation) {
      setShowPlanetsOptions(true);
    }
    setShowTime(true);
  };

  const handlePlanetSelection = (planet) => {
    setSelectedPlanets(prevSelectedPlanets =>
      prevSelectedPlanets.includes(planet)
        ? prevSelectedPlanets.filter(p => p !== planet)
        : [...prevSelectedPlanets, planet]
    );
  };

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  const fetchObservationData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/polaris/get-best-observation-times-and-lunar-eclipse/${location.latitude}/${location.longitude}/${selectedPlanets.join(',').toLowerCase()}/${months * 30}/${time}`
      );
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching observation data:', error);
    }
    setLoading(false);
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

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setLocationString(`${location.latitude};${location.longitude}`);
    }
  }, [location]);

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

      {showTargetsOptions && !showFinalData && (
        <div>
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
          </div>
          <button onClick={handleShowMonths} className="plan-observation-button">Choose targets and number of months</button>
        </div>
      )}

      {showMonths && !showFinalData && (
        <div>
          <label htmlFor="days">The event will be planned in the next:</label>
          <input 
            type="number" 
            id="days" 
            name="days" 
            min="1" 
            max="24" 
            defaultValue="1" 
            onChange={(e) => setMonths(e.target.value)} 
          />
          <span> months</span>
          <button onClick={handleConfirmTargets} className="plan-observation-button">Choose targets and number of months</button>
        </div>
      )}

      {showPlanetsOptions && !showFinalData && (
        <div className="planet-options">
          <h2>Select Planets</h2>
          <div className="planet-bubbles">
            {['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map((planet) => (
              <div
                key={planet}
                className={`planet-bubble ${selectedPlanets.includes(planet) ? 'selected' : ''}`}
                onClick={() => handlePlanetSelection(planet)}
              >
                {planet}
              </div>
            ))}
          </div>
        </div>
      )}

      {showTime && !showFinalData && (
        <div className="planet-options">
          <h1>At what time would you like to do the event? The time will be used approximately for a better recommendation.</h1>
          <div>
            <h2>Select Time</h2>
            <label htmlFor="time">Choose the time:</label>
            <input
              type="time"
              id="time"
              name="time"
              defaultValue="05:40:00"
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
          <button onClick={handleCheckButton} className="plan-observation-button">Check</button>
        </div>
      )}

      {showFinalData && (
        <div>
          <h1>The final data</h1>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Selected Targets:</p>
          <ul>
            {Object.entries(selectedTargets).map(([target, isSelected]) => (
              isSelected && <li key={target}>{target}</li>
            ))}
          </ul>
          {selectedPlanets.length > 0 && (
            <div>
              <p>Selected Planets:</p>
              <ul>
                {selectedPlanets.map((planet) => (
                  <li key={planet}>{planet}</li>
                ))}
              </ul>
            </div>
          )}
          <p>Selected Time: {time}</p>
        </div>
      )}

      {loading && <p>Loading... please wait.</p>}
      {!loading && events.length > 0 && (
        <div>
          <h2>Recommended Events:</h2>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Start time: {new Date(event.start_time).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={fetchObservationData} className="plan-observation-button">RECOMMEND AN EVENT!</button>
    </div>
  );
}

export default PlanEventPage;
