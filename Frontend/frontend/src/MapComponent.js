/* global google */
import {
    GoogleMap,
    Marker,
    useLoadScript,
  } from "@react-google-maps/api";
import { useState } from "react";
import "./renderMap.css";

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const [mapRef, setMapRef] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markers, setMarkers] = useState([
    { address: "Address1", lat: 46.770439, lng: 23.591423 },
  ]);

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setSelectedLocation({ latitude: lat, longitude: lng });
    console.log(lat, lng);
    setMarkers([{ address: `New Marker`, lat, lng }]);
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
          {markers.map(({ address, lat, lng }, ind) => (
            <Marker
              key={ind}
              position={{ lat, lng }}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
