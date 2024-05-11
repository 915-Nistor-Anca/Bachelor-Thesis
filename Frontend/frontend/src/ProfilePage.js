import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; 
import astronomerImage from './astronomer_profile.jpeg';
import ObservationsPage from './ObservationsPage';

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [observationsNumber, setObservationsNumber] = useState('');

  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const userCookie = cookies.find(cookie => cookie[0] === 'user_id');
    return userCookie ? userCookie[1] : null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        console.error('User ID cookie not found');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUserData(data);
        console.log('User:', data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = getUserIdFromCookie();
    
    const updatedUserData = {
      ...userData,
      username: newUsername,
      email: newEmail
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/polaris/users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      setUserData(updatedUserData);
      setEditMode(false); 
      setShowSuccessMessage(true); 
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const handleEditClick = () => {
    setNewUsername(userData.username);
    setNewEmail(userData.email);
    setEditMode(!editMode);
    setShowSuccessMessage(false);
  };

  const handleStatisticsClick = () => {
    setShowSuccessMessage(false);
    setShowStatistics(!showStatistics);
  };

  useEffect(() => {
    const userId = getUserIdFromCookie();
    const fetchObservations = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/polaris/observations-user/${userId}/`);
    
        if (!response.ok) {
          throw new Error('Failed to fetch user observations.');
        }
        
        const data = await response.json();
        setObservationsNumber(data.length);
        
      } catch (error) {
        console.error('Error fetching user observations:', error);
      }
    };

    fetchObservations();
  }, []);

  const handleAddObservationClick = () => {
    navigate('/addobservationspage');
  };

  return (
    <div>
      <div className="profile-container">
        <div className='first-part'>
          <div className="profile-info">
            <div className="profile-image-container">
              <img src={astronomerImage} alt="Astronomer" className="profile-image" />
            </div>
            <h1 className="title">{userData.username}</h1>
            {editMode && (
              <form onSubmit={handleSubmit}>
                <p className="text"> {userData.email}</p>
                <button className='button' onClick={handleAddObservationClick}>Add Observation</button>
                <button className="button" onClick={handleEditClick}>Edit Profile</button>
                <button className="button" onClick={handleStatisticsClick}>Statistics</button>
                <label className="label">
                  Username:
                  <input
                    className="input"
                    type="text"
                    value={newUsername}
                    onChange={handleUsernameChange}
                  />
                </label>
                <br />
                <label className="label">
                  Email:
                  <input
                    className="input"
                    type="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                  />
                </label>
                <br />
                <button className="button" type="submit">Save Changes</button>
              </form>
            )}
            {!editMode && (
              <div>
                <p className="text"> {userData.email}</p>
                <button className='button' onClick={handleAddObservationClick}>Add Observation</button>
                <button className="button" onClick={handleEditClick}>Edit Profile</button>
                <button className="button" onClick={handleStatisticsClick}>Statistics</button>
                {/* {showSuccessMessage && (
                  <div style={{ marginTop: '20px', color: 'green' }}>
                    Profile updated successfully!
                  </div>
                )} */}
                {showStatistics && (
                  <div className="statistics">
                    <h2>Statistics</h2>
                    <p>Number of Observations: {observationsNumber}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      
      <div className='second-part'>
        <ObservationsPage />
      </div>
      </div>
    </div>
  );
  
}

export default ProfilePage;
