import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Globe, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import { reactAuth } from '../lib/auth';

const API = 'http://localhost:5000';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { data: sessionData, isPending } = reactAuth.useSession();

  const [formData, setFormData] = useState({
    country: '',
    city: '',
    phone: '',
    travelStyle: 'Solo Explorer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  /**
   * On mount:
   * 1. Read the google_auth_intent from sessionStorage.
   * 2. If intent is 'login' (existing Google user logging in), skip this page → /dashboard.
   * 3. If intent is 'signup' (new Google user), check if they already have a profile in the DB.
   *    - If profile_completed → /dashboard
   *    - Otherwise → show the form
   * 4. Clear the intent from sessionStorage either way.
   */
  useEffect(() => {
    if (isPending) return;

    // If user is not authenticated at all, redirect to login
    if (!sessionData?.user) {
      navigate('/login', { replace: true });
      return;
    }

    const intent = sessionStorage.getItem('google_auth_intent') || 'signup';
    sessionStorage.removeItem('google_auth_intent');

    // If the user came here from a LOGIN flow (not signup), go straight to dashboard
    if (intent === 'login') {
      navigate('/dashboard', { replace: true });
      return;
    }

    // intent === 'signup': check if profile already exists / is already completed
    const checkExistingProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/profile/${sessionData.user.id}`);
        const profile = res.data?.profile;
        if (profile?.profile_completed) {
          // Already completed — must be a returning user; go to dashboard
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch {
        // Profile doesn't exist yet — that's fine, show the form
      }
      setChecking(false);
    };

    checkExistingProfile();
  }, [isPending, sessionData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sessionData?.user?.id) {
      setError('Session expired. Please sign in again.');
      return;
    }

    setLoading(true);
    try {
      const user = sessionData.user;
      const [firstName, ...lastNameParts] = (user.name || '').split(' ');
      const lastName = lastNameParts.join(' ');

      await axios.post(`${API}/api/profile`, {
        id: user.id,
        email: user.email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        travelStyle: formData.travelStyle,
        photo: user.image || null,
        profileCompleted: true,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Failed to complete profile:', err);
      setError(err.response?.data?.error || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading states
  if (isPending || checking) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center text-white">
        <p className="text-gray-400 text-sm animate-pulse">Verifying your session...</p>
      </div>
    );
  }

  if (!sessionData?.user) return null;

  const user = sessionData.user;

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center py-2">
        {/* Title */}
        <div className="mb-5 text-center sm:text-left">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Tell us a little more about yourself to personalize your GlobeTrotter experience.
          </p>
        </div>

        {/* Google Auth Badge */}
        <div className="bg-[#12151c] border border-teal-500/30 rounded-2xl p-3.5 mb-5 shadow-lg">
          <div className="flex items-center gap-3.5">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/60 shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-serif font-bold text-lg flex-shrink-0">
                {user.name ? user.name.charAt(0) : 'G'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-white truncate">{user.name || 'Google Traveler'}</h3>
                <CheckCircle2 size={14} className="text-teal-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Google Auth
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Country & City */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Globe size={15} />
              </div>
              <input
                type="text"
                name="country"
                id="profile-country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin size={15} />
              </div>
              <input
                type="text"
                name="city"
                id="profile-city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Phone size={15} />
            </div>
            <input
              type="tel"
              name="phone"
              id="profile-phone"
              placeholder="Phone Number (e.g. +1 555-0199)"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>

          {/* Travel Style */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Compass size={15} />
            </div>
            <select
              name="travelStyle"
              id="profile-travel-style"
              value={formData.travelStyle}
              onChange={handleChange}
              className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white appearance-none outline-none transition-all cursor-pointer"
            >
              <option value="Solo Explorer" className="bg-[#12151c] text-white">Solo Explorer</option>
              <option value="Luxury Seeker" className="bg-[#12151c] text-white">Luxury Seeker</option>
              <option value="Digital Nomad" className="bg-[#12151c] text-white">Digital Nomad</option>
              <option value="Family Vacations" className="bg-[#12151c] text-white">Family Vacations</option>
              <option value="Adrenaline & Adventure" className="bg-[#12151c] text-white">Adrenaline & Adventure</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a884] hover:bg-[#009272] active:scale-[0.99] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 transition-all cursor-pointer mt-2 disabled:opacity-70"
          >
            <span>{loading ? 'Saving Profile...' : 'Complete Profile'}</span>
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default CompleteProfile;
