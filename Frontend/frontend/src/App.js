// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/Layout';
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
import CalendarPage from './components/planEvent/CalendarPage';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/home" element={<FirstPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mainuserpage" element={<Layout><MainPage /></Layout>} />
          <Route path="/observationspage" element={<Layout><ObservationsPage /></Layout>} />
          <Route path="/addobservationspage" element={<Layout><AddObservationPage /></Layout>} />
          <Route path="/mapcomponent" element={<Layout><MapComponent /></Layout>} />
          <Route path="/updateobservationpage" element={<Layout><UpdateObservationPage /></Layout>} />
          <Route path="/starpage" element={<Layout><StarPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/following/:username" element={<Layout><FollowingPage /></Layout>} />
          <Route path="/followers/:username" element={<Layout><FollowersPage /></Layout>} />
          <Route path="/user/:username" element={<Layout><FriendPage /></Layout>} />
          <Route path="/feed" element={<Layout><FeedPage /></Layout>} />
          <Route path="/planevent" element={<Layout><PlanEventPage /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
