import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindBestTimes.css';
import MapComponent from '../MapComponent';

function FindBestTimes() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationString, setLocationString] = useState('');
  const [observations1, setObservations1] = useState([]);
  const [observations2, setObservations2] = useState([]);
  const [observations3, setObservations3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setLocationString(`${location.latitude};${location.longitude}`);
    }
  }, [location]);

  const fetchObservationData = async () => {
    setLoading(true);
    try {
      let planet = "Mercury";
      let months = 12;
      let url1 = `http://127.0.0.1:8000/polaris/get-best-observation-times/${location.latitude}/${location.longitude}/${planet}/${months * 30}/`;
      let url2 = `http://127.0.0.1:8000/polaris/solar-eclipse-prediction/${location.latitude}/${location.longitude}/${months * 30}/`;
      let url3 = `http://127.0.0.1:8000/polaris/lunar-eclipse-prediction/${location.latitude}/${location.longitude}/${months * 30}/`;

      let response = await fetch(url1);
      let data = await response.json();
      setObservations1(data.observation_times);

      response = await fetch(url2);
      data = await response.json();
      setObservations2(data.eclipse_times);

      response = await fetch(url3);
      data = await response.json();
      setObservations3(data.eclipse_times);

      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching observation data:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      {!dataFetched ? (
        <div>
          <div className="find-time-map-page">
            <h1>Find best observation times!</h1>
            <p>Please select a location from the map:</p>
            <div className="map-container-plan-event-page">
              <MapComponent
                onLocationChange={(lat, lng) => {
                  setLocation({ latitude: lat, longitude: lng });
                }}
              />
            </div>
          </div>
          <label className='location-map'>
            Location:
            <input type="text" value={locationString} readOnly />
          </label>
          <button onClick={fetchObservationData} className="find-time-button-map">Choose selected location</button>
        </div>
      ) : (
        <div>
            <h>For the given location, the best observation times are:</h>
        <div className="observations-container">
          {loading && <p>Loading...</p>}
          {!loading && (
            <>
              <div className="observation-column">
                <h2>Best Observation Times</h2>
                {observations1.length > 0 ? (
                  <ul>
                    {observations1.map((observation, index) => (
                      <li key={index}>{observation}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No observation times available.</p>
                )}
              </div>
              <div className="observation-column">
                <h2>Solar Eclipse Times</h2>
                {observations2.length > 0 ? (
                  <ul>
                    {observations2.map((eclipse, index) => (
                      <li key={index}>{eclipse}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No solar eclipse times available.</p>
                )}
              </div>
              <div className="observation-column">
                <h2>Lunar Eclipse Times</h2>
                {observations3.length > 0 ? (
                  <ul>
                    {observations3.map((eclipse, index) => (
                      <li key={index}>{eclipse}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No lunar eclipse times available.</p>
                )}
              </div>
            </>
          )}
        </div>
        </div>
      )}
    </div>
  );
}

export default FindBestTimes;
