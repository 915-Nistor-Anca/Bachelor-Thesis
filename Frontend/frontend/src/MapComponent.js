// MapComponent.js
import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./renderMap.css";

const MapComponent = ({ onLocationChange }) => {
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

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
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
          onDblClick={handleMapClick}
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
