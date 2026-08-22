import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import PasswordInput from '../components/PasswordInput';
import GoogleButton from '../components/GoogleButton';
import { auth, reactAuth } from '../lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const { data: sessionData, isPending } = reactAuth.useSession();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && sessionData?.user) {
      navigate('/community', { replace: true });
    }
  }, [isPending, sessionData, navigate]);

  // Read URL params for Google OAuth errors
  const urlParams = new URLSearchParams(window.location.search);
  const authError = urlParams.get('error');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    setLoading(true);
    try {
      const { data, error: authError } = await auth.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error(authError.message || 'Login failed.');
      }
      navigate('/community');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    await auth.signIn.social({ 
      provider: 'google',
      callbackURL: '/community'
    });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="GlobeTrotter Logo" className="w-8 h-8 rounded-lg object-contain p-0.5" />
          <h2 className="text-xl font-semibold text-blue-300 tracking-wide">GlobalTrotter</h2>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
        <p className="text-sm text-gt-text-light mb-8 leading-relaxed">
          Sign in to access your itinerary and continue your journey.
        </p>

        {(error || authError) && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-6">
            {error || 'Authentication with Google failed.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AuthInput
            label="Email Address"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1.5">
            <PasswordInput
              label="Password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end mt-1">
              <a href="#" className="text-xs text-blue-400 hover:underline">Forgot password?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gt-primary hover:bg-gt-primary-hover text-white font-medium py-3.5 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33331 8H12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33331L12.6667 7.99998L8 12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-6 mt-2">
          <div className="flex-grow border-t border-gt-border"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-gt-border"></div>
        </div>

        <div className="flex gap-4">
          <GoogleButton onClick={handleGoogleAuth} />
          <button
            type="button"
            disabled
            className="flex-1 flex items-center justify-center bg-gt-input border border-gt-border rounded-xl py-3 opacity-60 cursor-not-allowed"
            title="Coming Soon"
          >
            <span className="text-sm font-medium">Apple</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Create account</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
