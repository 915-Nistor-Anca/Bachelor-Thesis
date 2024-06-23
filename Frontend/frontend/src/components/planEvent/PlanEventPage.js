import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanEventPage.css';
import MapComponent from '../MapComponent';
import CalendarPage from './CalendarPage';
import Modal from './Modal.js';
import arrowIcon from './arrow.png';
import manProfileIcon from './man-figure.png';

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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createdEventId, setCreatedEventId] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [usernames, setUsernames] = useState({});


  const handleTimeChange = (newTime) => {
    setTime(newTime + ":00");
  };

  const handleLocationOption = () => {
    setShowLocationOptions(true);
  };

  const handleTargetsOption = () => {
    setShowTargetsOptions(true);
  };

  const handleCheckButton = () => {
    setShowFinalData(true);
  };

  const handleShowMonths = () => {
    setShowMonths(true);
  };

  const handleConfirmTargets = async () => {
    if (selectedTargets.planetObservation) {
      console.log("planets");
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
      let url = '';
      if (selectedTargets.planetObservation && selectedTargets.solarEclipse) {
        url = `http://127.0.0.1:8000/polaris/get-best-observation-times-and-solar-eclipse/${location.latitude}/${location.longitude}/${selectedPlanets.join(',').toLowerCase()}/${months * 30}/${time}`;
      } else if (selectedTargets.planetObservation && selectedTargets.lunarEclipse) {
        url = `http://127.0.0.1:8000/polaris/get-best-observation-times-and-lunar-eclipse/${location.latitude}/${location.longitude}/${selectedPlanets.join(',').toLowerCase()}/${months * 30}/${time}`;
      } else if (selectedTargets.lunarEclipse && selectedTargets.solarEclipse) {
        url = `http://127.0.0.1:8000/polaris/get-lunar-solar-eclipse/${location.latitude}/${location.longitude}/${months * 30}/${time}`;
      } else if (selectedTargets.planetObservation) {
        url = `http://127.0.0.1:8000/polaris/get-planets-observation-times/${location.latitude}/${location.longitude}/${selectedPlanets.join(',').toLowerCase()}/${months * 30}/${time}`;
      } else if (selectedTargets.solarEclipse){
        url = `http://127.0.0.1:8000/polaris/get-solar-eclipses-events/${location.latitude}/${location.longitude}/${months * 30}/${time}`;
      } else if (selectedTargets.lunarEclipse){
        url = `http://127.0.0.1:8000/polaris/get-lunar-eclipses-events/${location.latitude}/${location.longitude}/${months * 30}/${time}`;
      } else if (selectedPlanets.planetObservation && selectedPlanets.solarEclipse && selectedTargets.lunarEclipse){
        url = `http://127.0.0.1:8000/polaris/get-best-times-and-lunar-solar-eclipse/${location.latitude}/${location.longitude}/${selectedPlanets.join(',').toLowerCase()}/${months * 30}/${time}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching observation data:', error);
    }
    setLoading(false);
  };

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setShowConfirmation(true);
  };

  const handleConfirmEventCreation = async () => {
    const userId = getUserIdFromCookie();
    const newEvent = {
      title: selectedEvent.title,
      description: selectedEvent.description,
      organizer: userId,
      participants: [],
      location_latitude: location.latitude,
      location_longitude: location.longitude,
      start_time: selectedEvent.start_time,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/polaris/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setSuccessMessage('Event added successfully!');
        console.log(createdEvent);
        setCreatedEventId(createdEvent.id);
        setShowConfirmation(false);
      } else {
        console.error('Error creating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(() => {
    const fetchObservations = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        console.error('User ID cookie not found');
        navigate('/login');
        return;
      }
      setLoggedInUserId(userId);
    };
    fetchObservations();
  }, [navigate]);

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setLocationString(`${location.latitude};${location.longitude}`);
    }
  }, [location]);



  const fetchUserProfile = async (loggedInUserId) => {
    try {
      console.log("logged in user:", loggedInUserId);
      const response = await fetch(`http://127.0.0.1:8000/polaris/userprofiles/${loggedInUserId}/`);
      const userProfile = await response.json();
      setFollowingUsers(userProfile.following);
      console.log("users following:", followingUsers);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  const fetchUsernames = async () => {
    try {
      const promises = followingUsers.map(async (userId) => {
        const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}/`);
        const user = await response.json();
        return { id: userId, username: user.username, email: user.email };
      });
      const usernames = await Promise.all(promises);
      // setUsernames(Object.fromEntries(usernames.map(({ id, username, email }) => [id, username, email])));
      setUsernames(Object.fromEntries(usernames.map(({ id, username, email }) => [id, { username, email }])));

      console.log(usernames);
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile(loggedInUserId);
  }, [loggedInUserId]);

  useEffect(() => {
    fetchUsernames();
  }, [followingUsers]);

  const getCsrfToken = () => {
    let token = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 10) === 'csrftoken=') {
                token = decodeURIComponent(cookie.substring(10));
                break;
            }
        }
    }
    return token;
};

const csrfToken = getCsrfToken();

const sendInvitationEmail = async (email, id, event) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/polaris/send-invitation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({
        email: email,
        event_details: {
          title: event.title,
          description: event.description,
          start_time: event.start_time,
          sender_user_id: getUserIdFromCookie(),
          receiver_user_id: id
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
    } else {
      const errorResult = await response.json();
      alert(`Failed to send invitation: ${errorResult.message}`);
    }
  } catch (error) {
    console.error('Error sending invitation email:', error);
    alert('Error sending invitation email.');
  }
};

const redirectToEvent = () => {
  if (createdEventId) {
    navigate(`/events/${createdEventId}`);
  } else {
    console.error('No event ID found');
  }
};


  return (
    <div>
      {!showLocationOptions && (
        <div className="plan-event-description-page">
          <h1>Polaris Event Planner</h1>
          <hr></hr>
          <p1>
            Planning your next celestial observation event has never been easier.
          </p1>
          {/* <ol>
            <li><strong>Select Your Location</strong>:use the interactive map to pinpoint your exact spot.</li>
            <li><strong>Choose Your Targets</strong>: select from planets, solar eclipses, lunar eclipses. Choose the date.</li>
            <li><strong>Get Recommendations</strong>: Polaris will suggest the best dates and times for your event.</li>
            <li><strong>Invite Others</strong>: send invitations to your friends by email.</li>
          </ol> */}
          <div className='steps-description-page'>
            <h2>Select Your Location</h2>
            <p2>
            Use the interactive map to pinpoint your exact spot.
          </p2>
          </div>
          <div className='steps-description-page2'>
            <h2>Choose Your Targets</h2>
            <p2>
            Select from planets, solar and lunar eclipses. Choose the preferred hour and date.
          </p2>
          </div>
          <div className='steps-description-page3'>
            <h2>Get Recommendations</h2>
            <p2>
            Polaris will suggest the best dates and times for your event.
          </p2>
          </div>
          <div className='steps-description-page4'>
            <h2>Invite Others</h2>
            <p2>
            Send invitations to your friends by email.
          </p2>
          </div>
          <p>Ready to explore the stars? Let’s get started!</p>
          <button onClick={handleLocationOption} className="plan-observation-button">Plan observation</button>
        </div>
      )}







      {showLocationOptions && !showTargetsOptions && (
        <div>
        <div className="plan-event-map-page">
          <h1>Start planning your event!</h1>
          <p>Please select a location from the map:</p>
          <div className="map-container-plan-event-page">
            <MapComponent
              onLocationChange={(lat, lng) => {
                setLocation({ latitude: lat, longitude: lng });
              }}
            />
          </div>
          {/* <button onClick={handleTargetsOption} className="plan-observation-button-map">Choose selected location</button> */}
        </div>
        <label className='location-map'>
            Location:
            <input type="text" value={locationString} readOnly />
          </label>
        <button onClick={handleTargetsOption} className="plan-observation-button-map">Choose selected location</button>
        </div>
      )}

      {showTargetsOptions && !showFinalData && (
          <div className="observation-options">
            <h2>Select Observation Options</h2>
            <div className='pink-background'>
            <h1>Select your observation targets:</h1>
            <div className='targets'>
            
            <label className='checkbox'>
              <input
                type="checkbox"
                checked={selectedTargets.planetObservation}
                onChange={(e) => setSelectedTargets({ ...selectedTargets, planetObservation: e.target.checked })}
              />
              Find best time for observing a planet
            </label>
            
            <br />
            <label className='checkbox'>
              <input
                type="checkbox"
                checked={selectedTargets.solarEclipse}
                onChange={(e) => setSelectedTargets({ ...selectedTargets, solarEclipse: e.target.checked })}
              />
              Next solar eclipse
            </label>
            <br />
            <label className='checkbox'>
              <input
                type="checkbox"
                checked={selectedTargets.lunarEclipse}
                onChange={(e) => setSelectedTargets({ ...selectedTargets, lunarEclipse: e.target.checked })}
              />
              Next lunar eclipse
            </label>
            <br/>
            <label className='checkbox'>
              <input
                type="checkbox"
                checked={selectedTargets.lunarEclipse}
                onChange={(e) => setSelectedTargets({ ...selectedTargets, lunarEclipse: e.target.checked })}
              />
              Simple star observation
            </label>
            </div>
          <button onClick={handleShowMonths} className="choose-targets-button">Choose targets</button>
        </div>
        </div>
      )}




      {showMonths && !showFinalData && (
        <div className='months-plan'>
          <div className='pink-background-2'>
          <label htmlFor="days">
            <h4>
              The event will be planned in the next x months:
            </h4>
            
            </label>
            <input 
              type="number" 
              id="days" 
              name="days" 
              min="1" 
              max="24" 
              defaultValue="1"
              onChange={(e) => setMonths(e.target.value)} 
              style={{ width: '140px', fontSize: '22px' }}
            />
          {/* <span>  <h4>
              months.
            </h4>
            </span> */}
          </div>
          <button onClick={handleConfirmTargets} className="choose-months-button">Choose number of months</button>
        </div>
      )}
      

      {showPlanetsOptions && !showFinalData && !loading &&  (
        <div className="planet-options-2">
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

      {showTime && !showFinalData &&  !loading && (
        <div className="planet-options">
          <h2>At what time would you like to do the event? The time will be used approximately for a better recommendation.</h2>
          <div>
            {/* <h2>Select Time</h2> */}
            {/* <label htmlFor="time">Choose the time:</label> */}
            <input
              type="time"
              id="time"
              name="time"
              defaultValue="05:40:00"
              style={{ width: '270px', fontSize: '22px' }}
              onChange={(e) => handleTimeChange(e.target.value)}
             />
          </div>
          <button onClick={handleCheckButton} className="check-button">Check</button>
        </div>
      )}

{showFinalData && !loading && events.length <= 0 && (
  <div className='final-data-part'>
    <div className='final-data'>
      <h1>The final data</h1>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Number of Months in Advance: {months}</p> {/* Add this line */}
      <p>Selected Targets: 
        {Object.entries(selectedTargets).filter(([target, isSelected]) => isSelected).map(([target]) => target).join(', ')}
      </p>
      {selectedPlanets.length > 0 && (
        <p>Selected Planets: {selectedPlanets.join(', ')}</p>
      )}
      <p>Selected Time: {time}</p>
    </div>
    <button onClick={fetchObservationData} className="final-data-button">Recommend!</button>
  </div>
)}



{/* {loading && <p>Loading... please wait.</p>} */}
{showFinalData && loading && events.length <= 0 && (
  <div className='final-data-part'>
    <div className='final-data'>
      <h1>The final data</h1>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Number of Months in Advance: {months}</p> {/* Add this line */}
      <p>Selected Targets: 
        {Object.entries(selectedTargets).filter(([target, isSelected]) => isSelected).map(([target]) => target).join(', ')}
      </p>
      {selectedPlanets.length > 0 && (
        <p>Selected Planets: {selectedPlanets.join(', ')}</p>
      )}
      <p>Selected Time: {time}</p>
    </div>
    <button onClick={fetchObservationData} className="final-data-button">Recommend!</button>
    <p className='loading-text'>Loading... please wait.</p>
  </div>
)}




      {!loading && events &&events.length > 0 && !showConfirmation && !successMessage && (
        <div className='recommended-events'>
          <h2>Recommended Events:</h2>
          <ul>
            {events.slice(0, 3).map((event, index) => (
              <li key={index}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Start time: {new Date(event.start_time).toLocaleString()}</p>
                <button className='choose-event-button' onClick={() => handleEventSelection(event)}>Select this event</button>
              </li>
            ))}
          </ul>
          <div className='calendar-part'>
          <CalendarPage/>
          </div>
        </div>
      )}


      {/* {showConfirmation && selectedEvent && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to create this event?</p>
          <p>Title: {selectedEvent.title}</p>
          <p>Description: {selectedEvent.description}</p>
          <button onClick={handleConfirmEventCreation}>Yes</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      )} */}


{showConfirmation && selectedEvent && (
      <Modal show={showConfirmation && selectedEvent} onClose={() => setShowConfirmation(false)}>
        <div className="confirmation-dialog">
          <p>Are you sure you want to create this event?</p>
          <p>Title: {selectedEvent.title}</p>
          <p>Description: {selectedEvent.description}</p>
          <p>Start time: {selectedEvent.start_time}</p>
          <button className='confirmation-dialog-button' onClick={handleConfirmEventCreation}>Yes</button>
          <button className='confirmation-dialog-button' onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      </Modal>
)}

      {successMessage && (
        <div>
        <div className="success-message">
          <p className='p-from-success'>{successMessage}</p>
          <p className='message-invitation'>Share the excitement! Invite your friends to join the fun and make unforgettable memories together!</p>
        {/* {Object.entries(usernames).map(([id, userData]) => (
        <div key={id}>
          <p2>{userData.username}, </p2>
          <p2>{userData.email}</p2>
          <button onClick={() => sendInvitationEmail(userData.email, selectedEvent)}>Invite</button>
        </div>
      ))} */}
      <div className='people-to-invite'>
      {Object.entries(usernames).slice(0,4).map(([id, userData]) => (
        <div key={id} className="invite-card">
          <div className="invite-card-content">
            <img src={manProfileIcon} alt="Man figure" />
            <p2>{userData.username}</p2>
          </div>
          <p2>{userData.email}</p2>
          <button onClick={() => sendInvitationEmail(userData.email, id, selectedEvent)}>Invite</button>
        </div>
      ))} 
      </div>
        <a onClick={() => redirectToEvent()}>-go to the event page-</a>
        
        </div>
        <img src={arrowIcon} alt="Arrow icon" className="arrow-icon" onClick={() => redirectToEvent()}/>
        </div>
      )}
      
    </div>
  );
}

export default PlanEventPage;
