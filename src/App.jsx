import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import LiveItinerary from './pages/LiveItinerary';
import NewTrip from './pages/NewTrip';
import { reactAuth } from './lib/auth';

function RootRedirect() {
  const { data: sessionData, isPending } = reactAuth.useSession();
  if (isPending) return null;
  return sessionData?.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/itinerary" element={<LiveItinerary />} />
        <Route path="/live-itinerary" element={<LiveItinerary />} />
        <Route path="/new-trip" element={<NewTrip />} />
      </Routes>
    </Router>
  );
}

export default App;

