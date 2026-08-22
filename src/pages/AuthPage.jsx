import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Globe, Eye, EyeOff, ArrowRight, Camera } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import { auth, reactAuth } from '../lib/auth';

const API = 'http://localhost:5000';

const AuthPage = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState(defaultMode === 'signup' ? 'signup' : 'login');
  const { data: sessionData, isPending } = reactAuth.useSession();

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
    additionalInfo: '',
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode with route
  useEffect(() => {
    if (location.pathname === '/register' || location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isPending && sessionData?.user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isPending, sessionData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTabSwitch = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (mode === 'signup' && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.email.split('@')[0];
        const signupRes = await auth.signUp.email({
          email: formData.email,
          password: formData.password,
          name: fullName,
          image: photoPreview || undefined,
        });

        if (signupRes?.error) throw new Error(signupRes.error.message || 'Registration failed.');

        const userId = signupRes?.data?.user?.id || signupRes?.user?.id;

        // Save profile data to user_profiles
        try {
          await axios.post(`${API}/api/profile`, {
            id: userId,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            city: formData.city,
            country: formData.country,
            photo: photoPreview,
            additionalInfo: formData.additionalInfo,
            travelStyle: 'Solo Explorer',
            profileCompleted: true,
          });
        } catch (apiErr) {
          console.warn('Profile sync note:', apiErr.response?.data || apiErr.message);
        }

        navigate('/dashboard');
      } else {
        const { error: authError } = await auth.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw new Error(authError.message || 'Invalid email or password.');

        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google OAuth — we store the intent ('signup' | 'login') in sessionStorage
   * BEFORE the OAuth redirect so we can read it back when the user returns.
   * /complete-profile reads 'google_auth_intent' and only shows for 'signup'.
   */
  const handleGoogleAuth = async () => {
    try {
      // Persist the intent across the full-page OAuth redirect
      sessionStorage.setItem('google_auth_intent', mode);

      // Always callback to /complete-profile; that page decides where to go next
      const callbackURL = `${window.location.origin}/complete-profile`;

      await auth.signIn.social({
        provider: 'google',
        callbackURL,
      });
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col justify-center">
        {/* Title & Subtitle */}
        <div className="mb-4 text-center sm:text-left">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-1.5">
            {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            {mode === 'login'
              ? 'Enter your details to continue your journey.'
              : 'Fill in your traveler profile to start your journey.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="w-full bg-[#12151c] border border-white/10 rounded-xl p-1 flex gap-1 mb-4">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#1c2230] text-white shadow-sm border border-white/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#1c2230] text-white shadow-sm border border-white/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Signup
          </button>
        </div>

        {/* Photo Avatar — only shown in signup */}
        {mode === 'signup' && (
          <div className="flex flex-col items-center justify-center mb-3.5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-16 h-16 rounded-full bg-[#131722] border-2 border-teal-500/50 cursor-pointer hover:border-teal-400 group flex items-center justify-center overflow-hidden transition-all shadow-md"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <User size={20} className="text-gray-300 mb-0.5" />
                  <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase leading-none">Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl mb-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {mode === 'login' ? (
            /* ===== LOGIN FORM ===== */
            <>
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="email"
                  id="login-email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="login-password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mt-0.5">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] font-bold text-teal-400 hover:text-teal-300 uppercase tracking-wider transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </>
          ) : (
            /* ===== SIGNUP FORM ===== */
            <>
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone size={15} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: City & Country */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={15} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Globe size={15} />
                  </div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Row 5: Additional Info */}
              <div className="relative">
                <textarea
                  name="additionalInfo"
                  rows={2}
                  placeholder="Additional Information (e.g., travel style, preferences, interests)..."
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="w-full bg-[#10131a] border border-white/10 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a884] hover:bg-[#009272] active:scale-[0.99] text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 transition-all cursor-pointer mt-1 disabled:opacity-70"
          >
            <span>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </span>
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        {/* Social Auth */}
        <div className="relative flex items-center my-3.5">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full bg-[#12151c] hover:bg-[#181c25] border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-3 flex items-center justify-center gap-2.5 transition-all text-white cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z" />
            </svg>
            <span className="text-[11px] font-bold tracking-wider uppercase">Google</span>
          </button>

          <button
            type="button"
            disabled
            className="w-full bg-[#12151c] border border-white/10 rounded-xl py-2.5 px-3 flex items-center justify-center gap-2.5 opacity-60 cursor-not-allowed text-gray-300"
            title="Apple Sign-In coming soon"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.63-1.24z" />
            </svg>
            <span className="text-[11px] font-bold tracking-wider uppercase">Apple</span>
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-gray-300 underline hover:text-white transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-gray-300 underline hover:text-white transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  );
};

export default AuthPage;
