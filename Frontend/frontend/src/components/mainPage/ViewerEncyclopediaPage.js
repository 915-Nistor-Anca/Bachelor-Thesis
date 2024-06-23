import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EncyclopediaPage.css';

function ViewerEncyclopediaPage() {
  const navigate = useNavigate();

  return (
    <div className="encyclopedia-page">
      <h1 className="encyclopedia-title">Encyclopedia</h1>
      <div className="encyclopedia-section encyclopedia-section-stars">
        <h2 onClick={() => navigate('/viewerstarpage')} className="encyclopedia-link" style={{ cursor: 'pointer' }}>
          Stars Page
        </h2>
        <p>Find information about stars.</p>
      </div>
      <div className="encyclopedia-section encyclopedia-section-planets">
        <h2 onClick={() => navigate('/viewerplanetencyclopedia')} className="encyclopedia-link" style={{ cursor: 'pointer' }}>
          Planets Page
        </h2>
        <p>Find information about planets.</p>
      </div>
    </div>
  );
}

export default ViewerEncyclopediaPage;
