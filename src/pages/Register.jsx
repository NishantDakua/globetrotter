import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import PasswordInput from '../components/PasswordInput';
import GoogleButton from '../components/GoogleButton';
import { auth, reactAuth } from '../lib/auth';

const Register = () => {
  const navigate = useNavigate();
  const { data: sessionData, isPending } = reactAuth.useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    travelStyle: 'Solo Explorer',
    terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && sessionData?.user) {
      navigate('/community', { replace: true });
    }
  }, [isPending, sessionData, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.terms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await auth.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
      });
      
      if (authError) {
        throw new Error(authError.message || 'Registration failed.');
      }
      navigate('/community');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        <h2 className="text-xl font-semibold text-blue-300 tracking-wide mb-6">GlobeTrotter</h2>
        
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Begin Your Journey</h1>
        <p className="text-sm text-gt-text-light mb-8 leading-relaxed">
          Create an account to unlock premium travel planning and exclusive community access.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-4">
            <AuthInput
              label="First Name"
              id="firstName"
              placeholder="Alex"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="flex-1"
            />
            <AuthInput
              label="Last Name"
              id="lastName"
              placeholder="Rivers"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="flex-1"
            />
          </div>

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
            <p className="text-[11px] text-gray-400 ml-1">Must be at least 8 characters long.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="travelStyle" className="text-xs text-gray-300 ml-1">
              Primary Travel Style
            </label>
            <div className="relative">
              <select
                id="travelStyle"
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                className="w-full bg-gt-input border border-gt-border rounded-xl px-4 py-3.5 text-sm text-white appearance-none focus:outline-none focus:border-gt-primary transition-colors cursor-pointer"
              >
                <option value="Solo Explorer">Solo Explorer</option>
                <option value="Luxury Seeker">Luxury Seeker</option>
                <option value="Digital Nomad">Digital Nomad</option>
                <option value="Family Vacations">Family Vacations</option>
                <option value="Adrenaline & Adventure">Adrenaline & Adventure</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 bg-gt-input checked:bg-gt-primary cursor-pointer accent-gt-primary"
            />
            <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
              I agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gt-primary hover:bg-gt-primary-hover text-white font-medium py-3.5 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating...' : 'Create Account'}
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
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
