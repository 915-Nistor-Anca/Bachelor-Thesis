import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FirstPage from './FirstPage';
import Planets from './PlanetsPage';
import Login from './LoginPage';
import Register from './RegisterPage';
import MainPage from './MainPage';
import ObservationsPage from './ObservationsPage';
import AddObservationPage from './AddObservationPage';
import MapComponent from './MapComponent';
import UpdateObservationPage from './UpdateObservationPage';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/home" element={<FirstPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/mainuserpage" element = {< MainPage/>} />
          <Route path="/observationspage" element = {< ObservationsPage/>} />
          <Route path="/addobservationspage" element = {< AddObservationPage/>} />
          <Route path="/mapcomponent" element = {< MapComponent/>} />
          <Route path="/updateobservationpage" element = {< UpdateObservationPage/>} />
        </Routes>
      </Router> 
    </React.Fragment>
  );
}

export default App;
