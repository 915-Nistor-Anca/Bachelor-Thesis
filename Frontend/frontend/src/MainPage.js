import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

function MainPage() {
  const navigate = useNavigate();

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

  return (
    <div>
      <h1>Main Page</h1>
      <div>
        <Link to="/observationspage">Observations</Link>
      </div>
    </div>
  );
}

export default MainPage;