import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, reactAuth } from '../lib/auth';
import {
  User, Mail, Phone, MapPin, Globe, Compass,
  Camera, Save, LogOut, Trash2, Heart,
  AlertTriangle, Settings as SettingsIcon, CheckCircle2, ChevronRight
} from 'lucide-react';

const API = 'http://localhost:5000';

const Settings = () => {
  const { data: sessionData, isPending } = reactAuth.useSession();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [savedDestinations, setSavedDestinations] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    country: '',
    travelStyle: 'Solo Explorer',
    languagePreference: 'en',
    additionalInfo: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isPending && !sessionData?.user) {
      navigate('/login');
    }
  }, [isPending, sessionData, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (sessionData?.user?.id) {
        setLoading(true);
        try {
          const profileRes = await axios.get(`${API}/api/profile/${sessionData.user.id}`);
          if (profileRes.data?.profile) {
            const p = profileRes.data.profile;
            setProfileData(p);
            
            // Handle name splitting if they were null in DB but exist in Neon Auth
            const userRaw = sessionData.user;
            const [firstNameFallback, ...lastNameParts] = (userRaw.name || '').split(' ');
            
            setFormData({
              firstName: p.first_name || firstNameFallback || '',
              lastName: p.last_name || lastNameParts.join(' ') || '',
              phone: p.phone || '',
              city: p.city || '',
              country: p.country || '',
              travelStyle: p.travel_style || 'Solo Explorer',
              languagePreference: p.language_preference || 'en',
              additionalInfo: p.additional_info || ''
            });
            setPhotoPreview(p.photo || userRaw.image || null);
          }
          
          try {
            const destRes = await axios.get(`${API}/api/profile/${sessionData.user.id}/saved-destinations`);
            if (destRes.data?.savedDestinations) {
              setSavedDestinations(destRes.data.savedDestinations);
            }
          } catch (destErr) {
            console.warn('Failed to fetch saved destinations:', destErr);
          }
          
        } catch (err) {
          console.error('Profile fetch error:', err);
          setError('Failed to load profile data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [sessionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Very basic validation
      if (file.size > 5 * 1024 * 1024) {
         setError("Image must be smaller than 5MB");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const user = sessionData.user;
      await axios.post(`${API}/api/profile`, {
        id: user.id,
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        travelStyle: formData.travelStyle,
        languagePreference: formData.languagePreference,
        additionalInfo: formData.additionalInfo,
        photo: photoPreview,
        profileCompleted: true,
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      // Backend deletion cascades via Prisma
      await axios.delete(`${API}/api/profile/${sessionData.user.id}`);
      // Client-side signout
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Delete account failed:', err);
      setError('Failed to delete account.');
      setShowDeleteModal(false);
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gt-dark flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gt-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!sessionData?.user) return null;
  const user = sessionData.user;

  // Sidebar Tabs Configuration
  const tabs = [
    { id: 'profile', label: 'Personal Information', icon: <User size={18} /> },
    { id: 'preferences', label: 'Travel Preferences', icon: <Compass size={18} /> },
    { id: 'destinations', label: 'Saved Destinations', icon: <Heart size={18} /> },
    { id: 'account', label: 'Account Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gt-dark text-white font-sans selection:bg-gt-teal selection:text-white pb-20">
      {/* Top Navigation Placeholder (Could extract to common Header component) */}
      <nav className="border-b border-gt-border bg-gt-surface sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="font-serif text-xl font-bold tracking-tight text-white cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            GlobeTrotter
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</button>
             {photoPreview ? (
                <img src={photoPreview} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gt-border" />
             ) : (
                <div className="w-8 h-8 rounded-full bg-gt-teal/20 text-gt-teal flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
             )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-2">Settings</h1>
          <p className="text-gray-400 text-sm">Manage your profile, preferences, and account settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gt-surface border border-gt-border rounded-2xl overflow-hidden shadow-xl md:sticky md:top-24">
              <div className="p-5 border-b border-gt-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gt-input border border-gt-border flex-shrink-0">
                  {photoPreview ? (
                     <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gt-teal font-bold font-serif text-xl bg-gt-teal/10">
                       {user.name ? user.name.charAt(0) : 'U'}
                     </div>
                  )}
                </div>
                <div className="min-w-0">
                   <h3 className="font-medium text-white truncate text-sm">
                     {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : 'Traveler'}
                   </h3>
                   <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <nav className="p-2 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-sm transition-all text-left ${
                      activeTab === tab.id 
                        ? 'bg-gt-tab-active text-white font-medium border border-gt-border shadow-sm' 
                        : 'text-gray-400 hover:text-white hover:bg-gt-input'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={activeTab === tab.id ? 'text-gt-teal' : ''}>{tab.icon}</span>
                      {tab.label}
                    </div>
                    {activeTab === tab.id && <ChevronRight size={16} className="text-gray-500" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Global Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-start gap-3">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-gt-surface border border-gt-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8 border-b border-gt-border">
                  <h2 className="font-serif text-xl font-medium text-white mb-1">Personal Information</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">Update your photo and personal details here.</p>
                </div>
                
                <form onSubmit={handleSaveProfile} className="p-6 sm:p-8">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-6 mb-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gt-input border-2 border-gt-border hover:border-gt-teal/50 cursor-pointer overflow-hidden transition-all group flex-shrink-0"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <User size={28} className="text-gray-500 mb-1" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                        <Camera size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                      </div>
                    </div>
                    <div>
                       <h3 className="text-sm font-medium text-white mb-1">Profile Photo</h3>
                       <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-3">
                         Click the avatar to upload a new photo. Max size 5MB.
                       </p>
                       <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                       {photoPreview !== (profileData?.photo || user.image) && (
                         <span className="inline-block px-2 py-1 bg-gt-teal/20 text-gt-teal text-[10px] uppercase font-bold rounded-md">Unsaved</span>
                       )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><User size={16} /></div>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><User size={16} /></div>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                      Email Address <span className="text-[10px] bg-gt-border px-2 py-0.5 rounded text-gray-300 normal-case font-normal">Provided by Neon Auth</span>
                    </label>
                    <div className="relative opacity-60 cursor-not-allowed">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Mail size={16} /></div>
                      <input type="email" value={user.email} disabled className="w-full bg-gt-input border border-gt-border rounded-xl pl-10 pr-4 py-3 text-sm text-white cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Phone size={16} /></div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">City</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><MapPin size={16} /></div>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Country</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Globe size={16} /></div>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-6 border-t border-gt-border">
                    <button type="submit" disabled={saving} className="bg-gt-teal hover:bg-gt-teal-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-gt-teal/20 flex items-center gap-2 disabled:opacity-70">
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-gt-surface border border-gt-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8 border-b border-gt-border">
                  <h2 className="font-serif text-xl font-medium text-white mb-1">Travel Preferences</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">Customize how GlobeTrotter curates your experiences.</p>
                </div>
                
                <form onSubmit={handleSaveProfile} className="p-6 sm:p-8">
                  <div className="space-y-1.5 mb-6">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Primary Travel Style</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Compass size={16} /></div>
                      <select name="travelStyle" value={formData.travelStyle} onChange={handleChange} className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl pl-10 pr-10 py-3 text-sm text-white appearance-none outline-none transition-all cursor-pointer">
                        <option value="Solo Explorer" className="bg-gt-surface">Solo Explorer</option>
                        <option value="Couple" className="bg-gt-surface">Couple / Romance</option>
                        <option value="Family Vacations" className="bg-gt-surface">Family Vacations</option>
                        <option value="Friends Trip" className="bg-gt-surface">Friends Trip</option>
                        <option value="Digital Nomad" className="bg-gt-surface">Digital Nomad</option>
                        <option value="Luxury Seeker" className="bg-gt-surface">Luxury Seeker</option>
                        <option value="Adrenaline & Adventure" className="bg-gt-surface">Adrenaline & Adventure</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-8">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Bio / Additional Info</label>
                    <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} className="w-full bg-gt-input border border-gt-border focus:border-gt-teal focus:ring-1 focus:ring-gt-teal rounded-xl p-4 text-sm text-white outline-none transition-all resize-none" placeholder="Tell us more about your travel interests..." />
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gt-border">
                    <button type="submit" disabled={saving} className="bg-gt-teal hover:bg-gt-teal-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-gt-teal/20 flex items-center gap-2 disabled:opacity-70">
                      {saving ? 'Saving...' : <><Save size={16} /> Save Preferences</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
              <div className="bg-gt-surface border border-gt-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8 border-b border-gt-border">
                  <h2 className="font-serif text-xl font-medium text-white mb-1">Saved Destinations</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">Places you've added to your bucket list.</p>
                </div>
                
                <div className="p-6 sm:p-8">
                  {savedDestinations.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed border-gt-border rounded-2xl bg-gt-input/50">
                      <Heart size={48} className="mx-auto text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No saved destinations yet</h3>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Explore the world and tap the heart icon on cities you want to visit later.</p>
                      <button onClick={() => navigate('/dashboard')} className="bg-gt-input hover:bg-gt-border text-white border border-gt-border px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
                        Explore Destinations
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedDestinations.map((dest) => (
                        <div key={dest.id} className="group relative overflow-hidden rounded-2xl border border-gt-border hover:border-gt-teal/50 transition-all bg-gt-input">
                           {dest.cities?.image_url ? (
                             <img src={dest.cities.image_url} alt={dest.cities.name} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           ) : (
                             <div className="w-full h-32 bg-gt-dark flex items-center justify-center">
                               <MapPin size={24} className="text-gray-600" />
                             </div>
                           )}
                           <div className="p-4 flex items-start justify-between gap-2">
                             <div>
                               <h4 className="font-medium text-white text-base">{dest.cities?.name || 'Unknown City'}</h4>
                               <p className="text-xs text-gray-400">{dest.cities?.country || 'Unknown Country'}</p>
                             </div>
                             <button className="text-gt-teal hover:text-white transition-colors bg-gt-teal/10 hover:bg-red-500/20 p-2 rounded-full border border-gt-teal/20 hover:border-red-500/50" title="Remove">
                               <Heart size={16} fill="currentColor" />
                             </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Security / Provider Card */}
                <div className="bg-gt-surface border border-gt-border rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-gt-border">
                    <h2 className="font-serif text-xl font-medium text-white mb-1">Security & Authentication</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">Manage how you sign in to GlobeTrotter.</p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between p-4 border border-gt-border rounded-xl bg-gt-input">
                       <div className="flex items-center gap-4">
                          {user.image ? (
                             <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" /><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" /><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" /><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z" /></svg>
                          ) : (
                             <Mail size={24} className="text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-white">{user.image ? 'Google OAuth' : 'Email Authentication'}</p>
                            <p className="text-xs text-gray-400">Connected to {user.email}</p>
                          </div>
                       </div>
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                </div>

                {/* Session Actions Card */}
                <div className="bg-gt-surface border border-gt-border rounded-2xl shadow-xl overflow-hidden">
                   <div className="p-6 sm:p-8">
                     <h3 className="text-base font-medium text-white mb-2">Sign Out</h3>
                     <p className="text-sm text-gray-400 mb-4">Sign out of your account on this device.</p>
                     <button onClick={handleLogout} className="px-5 py-2.5 bg-gt-input border border-gt-border hover:border-gray-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                       <LogOut size={16} /> Sign Out
                     </button>
                   </div>
                </div>

                {/* Danger Zone Card */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl shadow-xl overflow-hidden">
                   <div className="p-6 sm:p-8">
                     <h3 className="text-base font-medium text-red-400 mb-2">Delete Account</h3>
                     <p className="text-sm text-red-400/80 mb-5 max-w-xl">
                       Permanently delete your account and all of your content. This action is not reversible.
                     </p>
                     <button 
                       onClick={() => setShowDeleteModal(true)} 
                       className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                     >
                       <Trash2 size={16} /> Delete Account
                     </button>
                   </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gt-surface border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-serif font-medium text-white mb-2">Delete your account?</h3>
            <p className="text-sm text-gray-400 mb-6">
              This action cannot be undone. All of your personal information, saved destinations, and travel preferences will be permanently erased.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
                className="px-4 py-2 bg-gt-input border border-gt-border hover:border-gray-500 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={saving}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? 'Deleting...' : 'Yes, delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
