import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Switch } from "react-router-dom";
import FirstPage from './FirstPage';
import Planets from './PlanetsPage';
import Login from './LoginPage';
import Register from './RegisterPage';
import MainPage from './MainPage';
import ObservationsPage from './ObservationsPage';
import AddObservationPage from './AddObservationPage';
import MapComponent from './MapComponent';
import UpdateObservationPage from './UpdateObservationPage';
import StarPage from './StarPage';
import ProfilePage from './ProfilePage';
import ImageComponent from './ImageComponent';
import CommunityPage from './CommunityPage';
import FollowingPage from './FollowingPage';
import FollowersPage from './FollowersPage';
import FriendPage from './FriendPage';

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
          <Route path="/starpage" element = {< StarPage/>} />
          <Route path="/profile" element = {< ProfilePage/>} />
          <Route path="/image" element = {< ImageComponent/>} />
          <Route path="/following" element = {< FollowingPage/>} />
          <Route path="/followers" element = {< FollowersPage/>} />
          <Route path="/community" element = {< CommunityPage/>} />
          <Route path="/user/:username" element={<FriendPage/>} />
        </Routes>
      </Router> 
    </React.Fragment>
  );
}

export default App;
