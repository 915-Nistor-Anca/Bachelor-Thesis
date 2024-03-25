import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './LoginPage';
import Planets from './PlanetsPage';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/planets" element={<Planets />} />
        </Routes>
      </Router> 
    </React.Fragment>
  );
}

export default App;
