import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Stats from './components/Stats';
import Path from './components/Path';
import Nav from './components/Nav';
import Contact from './components/Contact';
import Questions from './components/Questions';
import UserStats from './components/UserStats';
import Status from './components/Status';      

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path= "/userstats" element = {<UserStats/>} />
          <Route path="/path" element={<Path />} />
          <Route path="/about" element={<About />} />
          <Route path= "/contact" element = {<Contact/>} />
          <Route path= "/questions" element = {<Questions/>} />
          <Route path= "/status" element = {<Status/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
