import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FirstPage from './FirstPage';
import Planets from './PlanetsPage';
import Login from './LoginPage';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/home" element={<FirstPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router> 
    </React.Fragment>
  );
}

export default App;
