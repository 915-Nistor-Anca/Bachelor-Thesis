import { Link } from 'react-router-dom';
import React from 'react';

function EncyclopediaPage() {

  return (
    <div className='main-page'>
      <div className='content'>
        <h1 className='title-main-page'>📖Encyclopedia</h1>
        <div className='section1'>
          <h2>
            <Link to="/starpage">Stars Page</Link>
          </h2>
          <p>Find information about stars.</p>
        </div>
        <div className='section4'>
          <h2>
            <Link to="/planetencyclopedia">Planets Page</Link>
          </h2>
          <p>Find information about planets.</p>
        </div>
      </div>
    </div>
  );
}

export default EncyclopediaPage;
