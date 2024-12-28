import { useState } from 'react';
import LandingPage from './LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainContextProvider } from './context/MainContext';

function App() {
  return (
     <MainContextProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
     </MainContextProvider>
  )
}

export default App
