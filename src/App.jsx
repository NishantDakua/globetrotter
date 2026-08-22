import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { reactAuth } from './lib/auth';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function RootRedirect() {
  const { data: sessionData, isPending } = reactAuth.useSession();
  if (isPending) return null;
  return sessionData?.user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
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
          <Route path="/login" element={<AuthPage defaultMode="login" />} />
          <Route path="/register" element={<AuthPage defaultMode="signup" />} />
          <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
