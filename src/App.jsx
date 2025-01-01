import { useState, useRef } from 'react';
import LandingPage from './LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainContextProvider } from './context/MainContext';
import Starter from './Starter';
import Results from './Results';

function App() {
  return (
     <MainContextProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/starter' element={<Starter/>} />
          <Route path='/results' element={<Results/>} />
        </Routes>
      </Router>
     </MainContextProvider>
  )
}

export default App
