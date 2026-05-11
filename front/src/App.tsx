import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'; // Import de la Landing
import Dashboard from './pages/Dashboard'; 
import Auth from './pages/Auth';
import Research from './pages/Research'; // Import de la page de recherche

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 1. La page d'accueil est maintenant la Landing */}
        <Route path="/" element={<Landing />} />

        {/* 2. Route unique pour l'Auth (gère login et register via le state interne) */}
        <Route path="/auth" element={<Auth />} />

        {/* 3. Les autres pages de l'application */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/research" element={<Research />} />

        {/* 4. Redirection des anciennes routes ou erreurs */}
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/register" element={<Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;