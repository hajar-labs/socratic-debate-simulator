import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DebatePage from './pages/DebatePage';
import './assets/styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/debate/:topicId" element={<DebatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;