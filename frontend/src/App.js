import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WorkoutGenerator from './components/WorkoutGenerator';
import WorkoutTracker from './components/WorkoutTracker';
import FormAnalyzer from './components/FormAnalyzer';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9));

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">💪 Workout Form Analyzer</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/generate" className="nav-link">Generate Workout</Link>
              </li>
              <li className="nav-item">
                <Link to="/tracker" className="nav-link">Track Workout</Link>
              </li>
              <li className="nav-item">
                <Link to="/analyzer" className="nav-link">Form Analyzer</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard userId={userId} />} />
            <Route path="/generate" element={<WorkoutGenerator userId={userId} />} />
            <Route path="/tracker" element={<WorkoutTracker userId={userId} />} />
            <Route path="/analyzer" element={<FormAnalyzer userId={userId} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
