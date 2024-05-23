import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Switch } from "react-router-dom";
import FirstPage from './components/firstPage/FirstPage';
import Planets from './PlanetsPage';
import Login from './components/loginPage/LoginPage';
import Register from './components/registerPage/RegisterPage';
import MainPage from './components/mainPage/MainPage';
import ObservationsPage from './components/observationsPage/ObservationsPage';
import AddObservationPage from './components/addObservationPage/AddObservationPage';
import MapComponent from './components/MapComponent';
import UpdateObservationPage from './components/updateObservationPage/UpdateObservationPage';
import StarPage from './components/starsPage/StarPage';
import ProfilePage from './components/profilePage/ProfilePage';
import FollowingPage from './components/followingPage/FollowingPage';
import FollowersPage from './components/followersPage/FollowersPage';
import FriendPage from './components/friendPage/FriendPage';
import FeedPage from './components/feedPage/FeedPage';
import PlanEventPage from './components/planEvent/PlanEventPage';

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
          <Route path="/following/:username" element = {< FollowingPage/>} />
          <Route path="/followers/:username" element = {< FollowersPage/>} />
          <Route path="/user/:username" element={<FriendPage/>} />
          <Route path ="/feed" element= {<FeedPage/>}/>
          <Route path ="/planevent" element= {<PlanEventPage/>}/>
        </Routes>
      </Router> 
    </React.Fragment>
  );
}

export default App;
