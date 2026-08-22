import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { reactAuth } from './lib/auth';

// React Code Splitting: Lazy load heavy non-critical pages
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function RootRedirect() {
  const { data: sessionData, isPending } = reactAuth.useSession();
  if (isPending) return null;
  return sessionData?.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/register" replace />;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gt-bg flex items-center justify-center text-white">
      <div className="w-8 h-8 border-2 border-gt-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
