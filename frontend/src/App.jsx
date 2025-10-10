import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Parcels from './pages/Parcels.jsx';
import Grapes from './pages/Grapes.jsx';
import Diseases from './pages/Diseases.jsx';
import Plantings from './pages/Plantings.jsx';
import Harvests from './pages/Harvests.jsx';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/grapes" element={<Grapes />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/plantings" element={<Plantings />} />
          <Route path="/harvests" element={<Harvests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
