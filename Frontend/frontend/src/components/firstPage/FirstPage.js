import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './FirstPage.css';

function showButtons() {
  const buttons = document.querySelector('.buttons');
  if (buttons) {
    buttons.style.display = 'flex';
  } else {
  }
}


function FirstPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.getElementById('app');
    const planets = [
      { size: 15.1, texture: 'images/sun.jpg' },
      { size: 0.38, texture: 'images/mercury.jpg' },
      { size: 0.96, texture: 'images/venus.jpg' },
      { size: 1.00, texture: 'images/earth.jpg' },
      { size: 0.53, texture: 'images/mars.jpg' },
      { size: 10.94, texture: 'images/jupiter.jpg' },
      { size: 9.06, texture: 'images/saturn.jpg' },
      { size: 3.78, texture: 'images/uranus.jpg' },
      { size: 3.59, texture: 'images/neptune.jpg' }
    ];

    planets.forEach((planet, index) => {
      console.log(index);
      const sphere = document.createElement('div');
      const size = planet.size * 30;
      sphere.classList.add('sphere');
      sphere.style.width = `${size}px`;
      sphere.style.height = `${size}px`;
      sphere.style.backgroundImage = `url('${planet.texture}')`;
      sphere.style.backgroundSize = 'cover';
      container.appendChild(sphere);
      gsap.from(sphere, {
        duration: 1,
        opacity: 0,
        scale: 5,
        y: -100,
        ease: 'power2.out',
        delay: index * 0.1,
        onComplete: () => {
          const remainingSpace = window.innerHeight - sphere.getBoundingClientRect().bottom;
          const bounceAmplitude = Math.min(size * 2, remainingSpace);
          gsap.to(sphere, {
            duration: 0.5,
            y: window.innerHeight - sphere.getBoundingClientRect().bottom,
            onComplete: () => {
              gsap.to(sphere, {
                duration: 0.2,
                y: `-=${bounceAmplitude / 5}`,
                repeat: 1,
                yoyo: true,
                onComplete: () => {
                  gsap.to('#title', { duration: 1, opacity: 1, delay: 0.5 });
                  gsap.to('#quote', { duration: 1, opacity: 1, delay: 0.5 });
                  if (index === 8) {
                    const earthX = 6300;
                    const earthY = window.innerHeight * (-18.5);
                    gsap.to(container, {
                      duration: 3,
                      scale: 40,
                      x: earthX,
                      y: earthY,
                      ease: 'power2.inOut',
                      onComplete: () => {
                        showButtons();
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    });
  }, []);

  function login() {
    navigate('/login');
  }
  
  function continueWithoutAccount() {
    navigate('/viewerpage');
  }

  return (
    <div className="Login">
      <div className="container" id="app"></div>
      <div id="title">Polaris</div>
      <div id="quote">"Telescopes are in some ways like time machines." - Martin Rees</div>
      {(
        <div className="buttons">
        <button className="login-button" onClick={login}>Login</button>
        <div>
          <button className="continue-button" onClick={continueWithoutAccount}>Continue Without Account</button>
        </div>
      </div>
      
      )}
    </div>
  );
}

export default FirstPage;
