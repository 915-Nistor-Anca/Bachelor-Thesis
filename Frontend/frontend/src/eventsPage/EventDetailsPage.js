import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetailsPage.css';
import clockIcon from './clock.png';
import descriptionIcon from "./description.png";
import locationIcon from './location.png';
import participantsIcon from './participants.png';
import telescopeIcon from './telescope.png';

function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [participantsData, setParticipants] = useState([]);
  const [observations, setObservations] = useState([]);
  const navigate = useNavigate();

  const [followingUsers, setFollowingUsers] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [observationUsernames, setObservationUsernames] = useState({});
  const [images, setImages] = useState([]);

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  useEffect(() => {
    let intervalId;

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/events/${eventId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
        calculateCountdown(data.start_time);
        console.log('Event Details:', data);

        let equipmentEndpoint = 'http://127.0.0.1:8000/polaris/equipment/star_observation/';
        if (data.title.toLowerCase().includes('planet')) {
          equipmentEndpoint = 'http://127.0.0.1:8000/polaris/equipment/planet/';
        } else if (data.title.toLowerCase().includes('solar') && data.title.toLowerCase().includes('eclipse')) {
          equipmentEndpoint = 'http://127.0.0.1:8000/polaris/equipment/solar_eclipse/';
        } else if (data.title.toLowerCase().includes('lunar') && data.title.toLowerCase().includes('eclipse')) {
          equipmentEndpoint = 'http://127.0.0.1:8000/polaris/equipment/lunar_eclipse/';
        }

        const equipmentResponse = await fetch(equipmentEndpoint);
        if (!equipmentResponse.ok) {
          throw new Error('Failed to fetch equipment details');
        }
        const equipmentData = await equipmentResponse.json();
        console.log('Equipment:', equipmentData.equipment.map(e => e.name));
        setEquipmentData(equipmentData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const calculateCountdown = (startTime) => {
      console.log(countdown);
      const eventDate = new Date(startTime);
      intervalId = setInterval(() => {
        const now = new Date();
        const timeLeft = eventDate - now;

        if (timeLeft <= 0) {
          clearInterval(intervalId);
          setCountdown('The event is over!');
          fetchObservations();
          return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (years > 0) {
          setCountdown(`${years}y ${remainingDays}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setCountdown(`${remainingDays}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
    };

    const fetchObservations = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/observations/`);
        if (!response.ok) {
          throw new Error('Failed to fetch observations');
        }
        const data = await response.json();
        const eventObservations = data.filter(obs => obs.event === parseInt(eventId));
        setObservations(eventObservations.slice(0, 3));

        const observationUsernamesData = await Promise.all(eventObservations.map(async (obs) => {
          const userResponse = await fetch(`http://127.0.0.1:8000/polaris/users/${obs.user}`);
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data for user ID: ${obs.user}`);
          }
          const userData = await userResponse.json();
          return { userId: obs.user, username: userData.username };
        }));

        // Create a map of userId to username
        const usernamesMap = Object.fromEntries(observationUsernamesData.map(({ userId, username }) => [userId, username]));
        setObservationUsernames(usernamesMap);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };

    fetchEventDetails();

    return () => clearInterval(intervalId);
  }, [eventId]);

  useEffect(() => {
    if (event) {
      const fetchParticipants = async (participantsIds) => {
        try {
          const participantsData = await Promise.all(participantsIds.map(async (userId) => {
            const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch user data for user ID: ${userId}`);
            }
            const userData = await response.json();
            return userData;
          }));
          setParticipants(participantsData);
        } catch (error) {
          console.error('Error fetching participant data:', error);
        }
      };
      fetchParticipants(event.participants);
    }
  }, [event]);

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
    const userId = getUserIdFromCookie();
    try {
      const promises = followingUsers.map(async (userId) => {
        const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}/`);
        const user = await response.json();
        return { id: userId, username: user.username, email: user.email };
      });
      const usernames = await Promise.all(promises);
      setUsernames(Object.fromEntries(usernames.map(({ id, username, email }) => [id, { username, email }])));
      console.log(usernames);
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/images/?event=${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const imageData = await response.json();
      console.log("image data:", imageData);
      return imageData;
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };
  
  
  useEffect(() => {
    if (countdown === 'The event is over!') {
      fetchImages().then(imagesData => {
        setImages(imagesData);
      });
    }
  }, [countdown]);
  

  useEffect(() => {
    const userId = getUserIdFromCookie();
    fetchUserProfile(userId);
  }, []);

  useEffect(() => {
    if (followingUsers.length > 0) {
      fetchUsernames();
    }
  }, [followingUsers]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const redirectToUserProfile = (username) => {
    navigate(`/user/${username}`);
  };

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

  const sendInvitationEmail = async (email, event) => {
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
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setInvitedUsers([...invitedUsers, email]);
      } else {
        const errorResult = await response.json();
        alert(`Failed to send invitation: ${errorResult.message}`);
      }
    } catch (error) {
      console.error('Error sending invitation email:', error);
      alert('Error sending invitation email.');
    }
  };

  const nonParticipants = Object.entries(usernames).filter(
    ([id, userData]) => !event.participants.includes(parseInt(id))
  );

  return (
    <div className="event-details-container">
  
      <div className="event-details-content">
        <h2 className='title-event-page'>{event.title}</h2>
  
        <div className='rows-with-details'>
  
          <div className="start-time-container">
            <img src={clockIcon} alt="Clock icon" className="clock-icon" /> 
            <p> {formatDate(event.start_time)}</p>
          </div>
          
          <div className="start-time-container">
            <img src={descriptionIcon} alt="Description icon" className="clock-icon" /> 
            <p> {event.description.replace('(Preferred event option)', '').trim()}</p>
          </div>
  
          <div className="start-time-container">
            <img src={locationIcon} alt="Location icon" className="clock-icon" /> 
            <p>{event.location_latitude}; {event.location_longitude}</p>
          </div>
  
          <div className="start-time-container">
            <img src={telescopeIcon} alt="Equipment icon" className="clock-icon" /> 
            <p><strong>Equipment:</strong></p>
            {equipmentData && equipmentData.equipment && (
              <p>
                {equipmentData.equipment.slice(0, 4).map(e => e.name).join(', ')}
              </p>
            )}
          </div>
  
          <div className="start-time-container">
            <img src={participantsIcon} alt="Participants icon" className="clock-icon" />
            <p><strong>Participants:</strong></p>
          </div>
  
          <ul className="participants-row">
            {participantsData.length > 0 ? (
              participantsData.map(participant => (
                <li key={participant.id} className="participant-item">
                  <div className='participant-box'>
                    <a onClick={() => redirectToUserProfile(participant.username)}>{participant.username}</a>
                    <p>{followingUsers.includes(participant.id) ? "friend" : "invited"}</p>
                  </div>
                </li>
              ))
            ) : (
              <p2>No people have confirmed yet.</p2>
            )}
          </ul>
  
        </div>
      </div>
      <div className="countdown-container">
        <p><strong>Time remaining:</strong></p>
  
        <div className="countdown">
          {countdown}
        </div>
        
      </div>
      <div className="vertical-white-line"></div>
     
  
      {countdown === 'The event is over!' ? (
        <div className='observations-section'>
          <h2>Observations</h2>
          {observations.length > 0 ? (
            observations.map(obs => (
              <div key={obs.id} className="observation-item">
                <p><strong>User:</strong> {observationUsernames[obs.user]}</p>
                <p><strong>Description:</strong> {obs.personal_observations}</p>
              </div>
            ))
          ) : (
            <p>No observations available.</p>
          )}
          {images.length > 0 && (
            <div className="event-images">
              <h2>Event Images</h2>
              {images.map(image => (
                <img key={image.id} src={image.image.replace('/media', '')} alt={image.title} />
              ))}
            </div>
          )}
        </div>

      ) : (
        <div>
        <div className='invite-more-people'>
          <h2>Invite more people!</h2>
          {nonParticipants.slice(0, 3).map(([id, userData]) => (
            <div key={id}>
              <p className='user-to-invite'>{userData.username}</p>
              <p>{userData.email}</p>
              {invitedUsers.includes(userData.email) ? (
                <p>Invited</p>
              ) : (
                <button onClick={() => sendInvitationEmail(userData.email, event)}>Invite</button>
              )}
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
  
}

export default EventDetailsPage;
