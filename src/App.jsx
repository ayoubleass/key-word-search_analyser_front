import { useState, useRef } from 'react';
import LandingPage from './LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainContextProvider } from './context/MainContext';
import StarterPage from './StarterPage';

function App() {
  return (
     <MainContextProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/starter' element={<StarterPage/>} />
        </Routes>
      </Router>
     </MainContextProvider>
  )
}

export default App
