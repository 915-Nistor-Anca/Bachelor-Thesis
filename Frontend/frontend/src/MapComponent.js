import React, { useState, useEffect } from 'react';

function MapComponent({ setLocation }) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuP4cEWrfXsnR57lC3w3CIsolYV6K6Ebk&libraries=places`;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    });

    setMap(mapInstance);

    // Add click event listener to the map
    mapInstance.addListener('click', handleMapClick);
  };

  const handleMapClick = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();

    // Update marker position
    if (marker) {
      marker.setPosition(latLng);
    } else {
      const markerInstance = new window.google.maps.Marker({
        position: latLng,
        map: map,
        draggable: true,
      });
      setMarker(markerInstance);
    }

    // Update location state with latitude and longitude
    console.log(latitude, longitude);
    setLocation({ latitude, longitude });
  };

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}

export default MapComponent;
