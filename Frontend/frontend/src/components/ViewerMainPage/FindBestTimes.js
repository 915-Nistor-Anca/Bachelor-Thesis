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
      const planet = "Mercury";
      const months = 6;
      const url1 = `http://127.0.0.1:8000/polaris/get-best-observation-times/${location.latitude}/${location.longitude}/${planet}/${months * 30}/`;
      const url2 = `http://127.0.0.1:8000/polaris/solar-eclipse-prediction/${location.latitude}/${location.longitude}/${months * 30}/`;
      const url3 = `http://127.0.0.1:8000/polaris/lunar-eclipse-prediction/${location.latitude}/${location.longitude}/${months * 30}/`;

      const response1 = await fetch(url1);
      const data1 = await response1.json();
      setObservations1(data1.observation_times);

      const response2 = await fetch(url2);
      const data2 = await response2.json();
      setObservations2(data2.eclipse_times);

      const response3 = await fetch(url3);
      const data3 = await response3.json();
      setObservations3(data3.eclipse_times);

      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching observation data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Observations1: ", observations1);
    console.log("Observations2: ", observations2);
    console.log("Observations3: ", observations3);
  }, [observations1, observations2, observations3]);

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
          {loading && <p>Loading...</p>}
        </div>
      ) : (
        <div>
          <h2>For the given location, the best observation times are:</h2>
          <div className="observations-container">
            
            {!loading && (
              <>
                <div className="observation-column">
                  <h3>Best Observation Times</h3>
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
                  <h3>Solar Eclipse Times</h3>
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
                  <h3>Lunar Eclipse Times</h3>
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
            {loading && <p>Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default FindBestTimes;
