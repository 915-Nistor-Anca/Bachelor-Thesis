import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Planets from './PlanetsPage';
import "./MainPage.css";

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
  }, [navigate]);

  return (
    <div className='main-page'>
      <Planets />
      {/* <img className='one' src={one} alt="1" />
      <img className='two' src={two} alt="2" />
      <img className='three' src={three} alt="3" />
      <img className='four' src={four} alt="4" /> */}
      <div className='content'>
        <h1 className='title-main-page'>Welcome to Polaris!</h1>
        <div className='section1'>
          <h2>
            <Link to="/encyclopedia">📖Encyclopedia</Link>
          </h2>
          <p>Find information about stars and planets.</p>
        </div>
        <div className='section2'>
          <h2>
            <Link to="/events">🔭Events</Link>
          </h2>
          <p>See your events as well as the ones you were invited to.</p>
        </div>
        <div className='section3'>
          <h2>
            <Link to="/addobservationspage">🌠Add Observation</Link>
          </h2>
          <p>Add your astronomical observation.</p>
        </div>
        <div className='section4'>
          <h2>
            <Link to="/discoverpeople">👥Discover New People</Link>
          </h2>
          <p>Discover new people with similar interests.</p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
