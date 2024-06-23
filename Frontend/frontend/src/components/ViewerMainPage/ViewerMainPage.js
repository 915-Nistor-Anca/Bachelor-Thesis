import { useNavigate } from 'react-router-dom';
import React from 'react';
import "./ViewerMainPage.css";

function ViewerMainPage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className='viewer-main-page'>
      <div className='viewer-content'>
        <h1 className='viewer-title'>Welcome to Polaris!</h1>
        <div className='viewer-section viewer-encyclopedia-section'>
          <h2 onClick={() => handleNavigation('/viewerencyclopedia')} style={{ cursor: 'pointer' }}>
            📖Encyclopedia
          </h2>
          <p>Find information about stars and planets.</p>
        </div>
        <div className='viewer-section viewer-events-section'>
          <h2 onClick={() => handleNavigation('/findbesttimes')} style={{ cursor: 'pointer' }}>
            🔭Events
          </h2>
          <p>Find best observation times.</p>
        </div>
      </div>
    </div>
  );
}

export default ViewerMainPage;
