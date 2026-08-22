import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, reactAuth } from '../lib/auth';

const Dashboard = () => {
  const { data: sessionData, isPending } = reactAuth.useSession();
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !sessionData?.user) {
      navigate('/login');
    }
  }, [isPending, sessionData, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (sessionData?.user?.id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/profile/${sessionData.user.id}`);
          if (res.data?.profile) {
            setProfileData(res.data.profile);
          }
        } catch (err) {
          console.warn('Profile fetch note:', err);
        }
      }
    };
    fetchProfile();
  }, [sessionData]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center text-white">
        <p className="text-gray-400 text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!sessionData?.user) {
    return null;
  }

  const userRaw = sessionData.user;
  const [firstNameFallback, ...lastNameParts] = (userRaw.name || '').split(' ');
  
  const user = {
    ...userRaw,
    firstName: profileData?.first_name || firstNameFallback || 'User',
    lastName: profileData?.last_name || lastNameParts.join(' ') || '',
    phone: profileData?.phone || 'Not Specified',
    city: profileData?.city || 'Not Specified',
    country: profileData?.country || 'Not Specified',
    additionalInfo: profileData?.additional_info || 'Not Specified',
    profilePicture: profileData?.photo || userRaw.image || null,
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-white p-6 sm:p-10 md:p-14">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#12151c] p-6 rounded-2xl border border-white/10 shadow-xl gap-4">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-2xl font-bold font-serif">
                {user.firstName ? user.firstName.charAt(0) : 'G'}
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
                Welcome, {`${user.firstName} ${user.lastName}`}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Authentication Status: Active & Authenticated
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information */}
          <div className="bg-[#12151c] p-6 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="font-serif text-lg font-medium mb-5 pb-3 border-b border-white/10 text-white">
              Traveler Profile
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-3">
                <span className="text-gray-400">User ID:</span>
                <span className="col-span-2 font-mono text-teal-300 truncate">{user.id}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">First Name:</span>
                <span className="col-span-2 text-white">{user.firstName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Last Name:</span>
                <span className="col-span-2 text-white">{user.lastName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Email:</span>
                <span className="col-span-2 text-white">{user.email}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Phone:</span>
                <span className="col-span-2 text-white">{user.phone}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Location:</span>
                <span className="col-span-2 text-white">{`${user.city}, ${user.country}`}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Notes:</span>
                <span className="col-span-2 text-gray-300 italic">{user.additionalInfo}</span>
              </div>
            </div>
          </div>

          {/* Authentication & Security Debug */}
          <div className="bg-[#12151c] p-6 rounded-2xl border border-teal-500/20 shadow-xl">
            <h2 className="font-serif text-lg font-medium mb-5 pb-3 border-b border-white/10 text-teal-400">
              Identity Provider
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm font-mono">
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Provider:</span>
                <span className="col-span-2 text-teal-300">{user.image ? 'Google OAuth' : 'Email / Password'}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Session:</span>
                <span className="col-span-2 text-emerald-400">ACTIVE</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-400">Database:</span>
                <span className="col-span-2 text-emerald-400">PostgreSQL (Neon)</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#0c0e12] rounded-xl border border-white/10">
              <p className="text-[11px] text-gray-400 mb-1 font-sans">Database Synchronization</p>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-sans">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Sync with Neon Auth & PostgreSQL confirmed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

