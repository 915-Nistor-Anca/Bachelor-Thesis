import React from 'react';
import './PlanetEncyclopedia.css';

const planets = [
  {
    name: 'Mercury',
    description: 'Mercury is the smallest planet in our solar system and closest to the Sun.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/18_mercury_new.png'
  },
  {
    name: 'Venus',
    description: 'Venus spins slowly in the opposite direction of most planets.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/27_venus_jg.png'
  },
  {
    name: 'Earth',
    description: 'Earth is the only planet in our solar system known to harbor life.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/17_earth.png'
  },
  {
    name: 'Mars',
    description: 'Mars is a dusty, cold, desert world with a very thin atmosphere.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/19_mars.png'
  },
  {
    name: 'Jupiter',
    description: 'Jupiter is more than twice as massive as all the other planets combined.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/16_jupiter_new.png'
  },
  {
    name: 'Saturn',
    description: 'Saturn is adorned with a dazzling, complex system of icy rings.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/28_saturn.png'
  },
  {
    name: 'Uranus',
    description: 'Uranus has a unique tilt that causes its extreme seasonal variations.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/29_uranus.png'
  },
  {
    name: 'Neptune',
    description: 'Neptune is dark, cold, and whipped by supersonic winds.',
    image: 'https://solarsystem.nasa.gov/system/feature_items/images/30_neptune.png'
  }
];

const Planet = ({ name, description, image }) => (
  <div className="planetplanetencyclopedia">
    <h2>{name}</h2>
    <img src={image} alt={name} />
    <p>{description}</p>
  </div>
);

function PlanetEncyclopedia() {
  return (
    <div className="planetencyclopedia">
      <header className="planetencyclopedia-header">
        <h1>Planets of the Solar System</h1>
      </header>
      <div className="planets-listplanetencyclopedia">
        {planets.map((planet, index) => (
          <Planet
            key={index}
            name={planet.name}
            description={planet.description}
            image={planet.image}
          />
        ))}
      </div>
    </div>
  );
}

export default PlanetEncyclopedia;
