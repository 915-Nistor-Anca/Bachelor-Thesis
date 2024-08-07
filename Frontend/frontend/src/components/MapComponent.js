import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./renderMap.css";

const MapComponent = ({ initialLocation, onLocationChange }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const [mapRef, setMapRef] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markers, setMarkers] = useState([
    { address: "Address1", lat: 46.770439, lng: 23.591423 },
  ]);

  const [lat2, setLat2] = useState(0);
  const [long2, setLong2] = useState(0);

  const europeBounds = {
    north: 30,
    south: 10.0,
    west: 50.0,
    east: 42.5,
  };

  useEffect(() => {
    if (initialLocation) {
      const [initialLat, initialLng] = initialLocation.split(";");
      const lat = parseFloat(initialLat);
      const lng = parseFloat(initialLng);
      setMarkers([{ address: `New Marker`, lat, lng }]);
    }
  }, [initialLocation]);

  const onMapLoad = (map) => {
    setMapRef(map);
    map.fitBounds(europeBounds);
    map.setOptions({ gestureHandling: "auto" });
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setLat2(lat);
    setLong2(lng);
    setSelectedLocation({ latitude: lat, longitude: lng });
    setMarkers([{ address: `New Marker`, lat, lng }]);
    if (onLocationChange) {
      onLocationChange(lat, lng);
    }
  };

  return (
    <div className="Map">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {markers.map(({ lat, lng }, ind) => (
            <Marker key={ind} position={{ lat, lng }} />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
