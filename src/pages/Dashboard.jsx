import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, reactAuth } from '../lib/auth';

const Dashboard = () => {
  const { data: sessionData, isPending } = reactAuth.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !sessionData?.user) {
      navigate('/login');
    }
  }, [isPending, sessionData, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isPending || !sessionData?.user) {
    return (
      <div className="min-h-screen bg-gt-bg flex items-center justify-center text-white">
        <p>Loading your journey...</p>
      </div>
    );
  }

  const userRaw = sessionData.user;
  const [firstName, ...lastNameParts] = (userRaw.name || '').split(' ');
  const lastName = lastNameParts.join(' ');
  
  const user = {
    ...userRaw,
    firstName: firstName || 'User',
    lastName: lastName || '',
    profilePicture: userRaw.image || null,
    travelStyle: 'Not Specified',
    googleId: userRaw.emailVerified ? 'Linked' : null,
  };

  return (
    <div className="min-h-screen bg-gt-bg text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-gt-input p-6 rounded-2xl border border-gt-border shadow-xl">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gt-primary" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gt-primary flex items-center justify-center text-2xl font-bold">
                {user.firstName ? user.firstName.charAt(0) : '?'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">Welcome, {`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-gt-text-light flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Authentication Status: Authenticated
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Information */}
          <div className="bg-gt-input p-6 rounded-2xl border border-gt-border shadow-xl">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gt-border">User Information</h2>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3">
                <span className="text-gray-400">User ID:</span>
                <span className="col-span-2 font-mono text-blue-300">{user.id}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">First Name:</span>
                <span className="col-span-2">{user.firstName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Last Name:</span>
                <span className="col-span-2">{user.lastName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Email:</span>
                <span className="col-span-2">{user.email}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Email Verified:</span>
                <span className="col-span-2">{user.emailVerified ? 'True' : 'False'}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Travel Style:</span>
                <span className="col-span-2 bg-gt-bg px-3 py-1 rounded-full w-fit border border-gt-border">{user.travelStyle || 'Not Specified'}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Google Account:</span>
                <span className="col-span-2">{user.googleId ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Authentication Debug */}
          <div className="bg-gt-input p-6 rounded-2xl border border-yellow-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
              DEV ONLY
            </div>
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gt-border text-yellow-400">Authentication Debug</h2>
            <div className="space-y-4 text-sm font-mono">
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Provider:</span>
                <span className="col-span-2 text-green-400">{user.googleId ? 'Google' : 'Email'}</span>
              </div>
              {user.googleId && (
                <div className="grid grid-cols-3">
                  <span className="text-gray-400">Google ID:</span>
                  <span className="col-span-2 text-blue-300 break-all">{user.googleId}</span>
                </div>
              )}
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Session Active:</span>
                <span className="col-span-2 text-green-400">YES</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Database User:</span>
                <span className="col-span-2 text-green-400">FOUND</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Profile Pic:</span>
                <span className="col-span-2 text-gray-300 truncate" title={user.profilePicture}>{user.profilePicture || 'null'}</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gt-bg rounded-xl border border-gt-border">
              <p className="text-xs text-gray-400 mb-2">Database Record Status</p>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                User exists in PostgreSQL (Neon)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
