import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const navigate = useNavigate();

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
    }
    catch (error) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({
      username: newUsername || userData.username,
      email: newEmail || userData.email
    });
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={newUsername}
            onChange={handleUsernameChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={newEmail}
            onChange={handleEmailChange}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
      <div>
        <h2>Current Data:</h2>
        <p>Username: {userData.username}</p>
        <p>Email: {userData.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
