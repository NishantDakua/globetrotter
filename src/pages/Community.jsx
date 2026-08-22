import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, reactAuth } from '../lib/auth';
import { buildTrip } from '../lib/tripsStore';
import { 
  Home, 
  Map, 
  Compass, 
  Users, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Heart, 
  MessageSquare, 
  Copy, 
  UserPlus, 
  UserCheck, 
  Award, 
  X, 
  Calendar, 
  MapPin, 
  Globe 
} from 'lucide-react';

const Community = () => {
  const { data: sessionData, isPending } = reactAuth.useSession();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!isPending && !sessionData?.user) {
      navigate('/login');
    }
  }, [isPending, sessionData, navigate]);

  // Tab navigation state: 'main' | 'trips' | 'explore' | 'community' (starts on community)
  const [activeTab, setActiveTab] = useState('community');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState(null);

  // Notifications dropdown & list
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Arthur Pendelton copied your Amalfi Coast itinerary!', time: '5 mins ago', read: false },
    { id: 2, text: 'Julian Rossi liked your comment.', time: '1 hour ago', read: false },
    { id: 3, text: 'Welcome to the GlobeTrotter Community! Start planning your next journey.', time: '2 hours ago', read: true },
  ]);

  // Settings dropdown
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Followed contributors list
  const [followedUsers, setFollowedUsers] = useState(new Set());

  // Expanded comments section state (post IDs)
  const [expandedComments, setExpandedComments] = useState(new Set());

  // Input for new comments per post
  const [commentInputs, setCommentInputs] = useState({});

  // Dynamic Travel Posts State
  const [posts, setPosts] = useState([
    {
      id: 1,
      isPublic: true,
      user: {
        name: 'Julian Rossi',
        avatar: 'JR',
        color: 'bg-emerald-600',
        location: 'Kyoto, Japan',
        time: '2 hours ago',
      },
      title: 'Autumn in Arashiyama',
      description: 'The bamboo grove was incredibly atmospheric at dawn. Highly recommend going before 7 AM to avoid the crowds. I\'ve compiled my 3-day serene Kyoto itinerary.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      likes: 248,
      likedByUser: false,
      comments: [
        { id: 1, user: 'Sarah Connor', text: 'Stunning! Added this to my upcoming autumn trip details.', time: '1 hour ago' },
        { id: 2, user: 'David Chen', text: 'Did you need a local guide or is it easy to explore alone?', time: '30 mins ago' },
      ],
      itinerary: {
        destination: 'Kyoto, Japan',
        duration: '3 Days',
        budget: '$650',
        stops: ['Arashiyama Bamboo Grove', 'Fushimi Inari Shrine', 'Kinkaku-ji'],
        activities: ['Dawn walk in bamboo forest', 'Hiking the Torii Gates', 'Traditional tea ceremony'],
      }
    },
    {
      id: 2,
      isPublic: true,
      user: {
        name: 'Elena Costa',
        avatar: 'EC',
        color: 'bg-purple-600',
        location: 'Amalfi Coast, Italy',
        time: '5 hours ago',
      },
      title: 'Hidden Coves of Positano',
      description: 'Rented a private vintage boat to explore the secluded beaches along the coast. An absolute must-do. Shared the contacts and route in this itinerary.',
      image: '', // no image, matches Elena card text-only look at the bottom
      likes: 156,
      likedByUser: false,
      comments: [
        { id: 1, user: 'Marcus Aurelius', text: 'Which rental shop did you use? The price seems very reasonable.', time: '3 hours ago' },
      ],
      itinerary: {
        destination: 'Amalfi Coast, Italy',
        duration: '4 Days',
        budget: '$1,200',
        stops: ['Positano Beach', 'Fiordo di Furore', 'Capri Island'],
        activities: ['Private boat charter', 'Hiking the Path of the Gods', 'Coastal seafood tasting'],
      }
    },
  ]);

  // Load and manage public trips from localStorage
  const [localPublicTrips, setLocalPublicTrips] = useState([]);

  useEffect(() => {
    const localTrips = [];
    const currentTripRaw = localStorage.getItem('globetrotter_currently_exploring');
    if (currentTripRaw) {
      try {
        const parsed = JSON.parse(currentTripRaw);
        if (parsed && parsed.isPublic) {
          localTrips.push(parsed);
        }
      } catch (e) {}
    }
    const upcomingTripsRaw = localStorage.getItem('globetrotter_upcoming_trips');
    if (upcomingTripsRaw) {
      try {
        const parsed = JSON.parse(upcomingTripsRaw);
        if (Array.isArray(parsed)) {
          parsed.forEach(t => {
            if (t.isPublic) {
              localTrips.push(t);
            }
          });
        }
      } catch (e) {}
    }
    setLocalPublicTrips(localTrips);
  }, []);

  // Remove local trip from public community feed
  const handleRemoveFromPublic = (tripId) => {
    const currentTripRaw = localStorage.getItem('globetrotter_currently_exploring');
    if (currentTripRaw) {
      try {
        const parsed = JSON.parse(currentTripRaw);
        if (parsed && parsed.id === tripId) {
          parsed.isPublic = false;
          localStorage.setItem('globetrotter_currently_exploring', JSON.stringify(parsed));
        }
      } catch (e) {}
    }
    const upcomingTripsRaw = localStorage.getItem('globetrotter_upcoming_trips');
    if (upcomingTripsRaw) {
      try {
        const parsed = JSON.parse(upcomingTripsRaw);
        if (Array.isArray(parsed)) {
          const updated = parsed.map(t => {
            if (t.id === tripId) {
              return { ...t, isPublic: false };
            }
            return t;
          });
          localStorage.setItem('globetrotter_upcoming_trips', JSON.stringify(updated));
        }
      } catch (e) {}
    }
    setLocalPublicTrips(prev => prev.filter(t => t.id !== tripId));
    showToast('Trip removed from public feed');
  };

  // Load user details from Neon Auth Session
  useEffect(() => {
    if (sessionData?.user) {
      const userRaw = sessionData.user;
      const [firstName, ...lastNameParts] = (userRaw.name || '').split(' ');
      const lastName = lastNameParts.join(' ');
      setUserProfile({
        id: userRaw.id,
        firstName: firstName || 'Explorer',
        lastName: lastName || '',
        name: userRaw.name || 'Explorer',
        email: userRaw.email,
        profilePicture: userRaw.image || null,
        travelStyle: 'Adventure & Nature',
      });
    }
  }, [sessionData]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  // Follow/unfollow contributor toggle
  const toggleFollowUser = (userId, name) => {
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
        showToast(`Unfollowed ${name}`);
      } else {
        next.add(userId);
        showToast(`Following ${name}!`);
      }
      return next;
    });
  };

  // Like post toggle
  const toggleLikePost = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedByUser;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedByUser: !isLiked
        };
      }
      return post;
    }));
  };

  // Toggle comments expand
  const toggleComments = (postId) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Handle posting a comment
  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              user: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'You',
              text: commentText,
              time: 'Just now'
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    showToast('Comment posted!');
  };

  // State for copying a trip modal
  const [copyTripModal, setCopyTripModal] = useState({ isOpen: false, post: null, startDate: '', endDate: '' });

  // Handle the confirmation of copying a trip with dates
  const handleConfirmCopyTrip = (e) => {
    e.preventDefault();
    const { post, startDate, endDate } = copyTripModal;
    if (!post || !startDate || !endDate) return;

    if (new Date(startDate) > new Date(endDate)) {
      showToast('Return date cannot be before departure date', 'error');
      return;
    }

    try {
      const newTrip = buildTrip({
        title: post.title,
        destination: post.itinerary.destination,
        departureDate: startDate,
        returnDate: endDate,
        coverImage: post.image
      });

      const raw = localStorage.getItem('globetrotter_upcoming_trips');
      let upcoming = [];
      if (raw) {
        upcoming = JSON.parse(raw);
      }
      upcoming = [newTrip, ...upcoming];
      localStorage.setItem('globetrotter_upcoming_trips', JSON.stringify(upcoming));

      setCopyTripModal({ isOpen: false, post: null, startDate: '', endDate: '' });
      showToast(`Successfully copied "${post.title}" to My Trips!`);
    } catch (err) {
      console.error(err);
      showToast('Error copying trip', 'error');
    }
  };

  // Copy itinerary - trigger date collection modal
  const handleCopyTrip = (post) => {
    setCopyTripModal({
      isOpen: true,
      post,
      startDate: '',
      endDate: ''
    });
  };

  // Notifications helpers
  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Merge static community posts + local public user trips
  const allPosts = [
    ...localPublicTrips.map(trip => ({
      id: trip.id,
      isPublic: true,
      isUserTrip: true, // Identify as user's own trip
      user: {
        name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Alex Explorer',
        avatar: userProfile ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}` : 'AE',
        color: 'bg-teal-600 border border-teal-500/30',
        location: trip.destination,
        time: 'Just now',
      },
      title: trip.title,
      description: `Check out my travel itinerary for ${trip.destination}! Dates: ${trip.dates || 'TBD'}. Currently sharing this trip with the GlobeTrotter community.`,
      image: trip.image,
      likes: 0,
      likedByUser: false,
      comments: [],
      itinerary: {
        destination: trip.destination,
        duration: trip.totalDays ? `${trip.totalDays} Days` : 'Multi-day',
        budget: '$500',
        stops: [trip.destination],
        activities: ['Sightseeing & landmarks', 'Exploring local attractions'],
      }
    })),
    ...posts
  ];

  // Filtering posts based on search query AND making sure only public trips are shown
  const filteredPosts = allPosts.filter(post => {
    if (!post.isPublic) return false; // Only show public trips from users

    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.user.location.toLowerCase().includes(query)
    );
  });

  if (isPending || !userProfile) {
    return (
      <div className="min-h-screen bg-[#08090d] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009b86] mb-4"></div>
        <p className="text-slate-400 font-medium">Assembling community records...</p>
      </div>
    );
  }

  const topContributors = [
    { id: 10, name: 'Arthur Pendelton', rank: 1, copies: '34 Trips Copied', avatar: 'AP', color: 'bg-blue-600' },
    { id: 11, name: 'Clara Vane', rank: 2, copies: '28 Trips Copied', avatar: 'CV', color: 'bg-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 animate-slide-in bg-slate-900/95 border-emerald-800/80 text-emerald-200`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#009b86] animate-pulse"></div>
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0c0d14] border-r border-[#1e2030] flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Logo Section */}
          <div className="p-6 border-b border-[#1e2030] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#009b86] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-[#009b86]/20">
              <Globe size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight tracking-wide text-white">GlobalTrotter</h2>
              <span className="text-xs font-medium text-slate-400">Premium Travel</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden ml-auto text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            <button
              onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                activeTab === 'main' 
                  ? 'bg-[#181a26] text-white border-r-2 border-[#009b86]' 
                  : 'text-slate-400 hover:bg-[#12131f] hover:text-white'
              }`}
            >
              <Home size={18} className={activeTab === 'main' ? 'text-[#009b86]' : ''} />
              <span>Main Page</span>
            </button>

            <button
              onClick={() => { navigate('/trips'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                activeTab === 'trips' 
                  ? 'bg-[#181a26] text-white border-r-2 border-[#009b86]' 
                  : 'text-slate-400 hover:bg-[#12131f] hover:text-white'
              }`}
            >
              <Map size={18} className={activeTab === 'trips' ? 'text-[#009b86]' : ''} />
              <span>My Trips</span>
            </button>

            <button
              onClick={() => { setActiveTab('explore'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                activeTab === 'explore' 
                  ? 'bg-[#181a26] text-white border-r-2 border-[#009b86]' 
                  : 'text-slate-400 hover:bg-[#12131f] hover:text-white'
              }`}
            >
              <Compass size={18} className={activeTab === 'explore' ? 'text-[#009b86]' : ''} />
              <span>Explore</span>
            </button>

            <button
              onClick={() => { setActiveTab('community'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                activeTab === 'community' 
                  ? 'bg-[#181a26] text-white border-r-2 border-[#009b86]' 
                  : 'text-slate-400 hover:bg-[#12131f] hover:text-white'
              }`}
            >
              <Users size={18} className={activeTab === 'community' ? 'text-[#009b86]' : ''} />
              <span>Community</span>
            </button>
          </nav>

          {/* User Footer & Action Placeholder */}
          <div className="p-4 border-t border-[#1e2030] space-y-4">
            <button
              onClick={() => showToast('New Trip creation belongs to My Trips page.')}
              className="w-full bg-[#009b86] hover:bg-[#008674] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#009b86]/10"
            >
              <Plus size={18} />
              <span>New Trip</span>
            </button>

            <div className="flex items-center gap-3 bg-[#11121b] p-3 rounded-xl border border-[#1e2030]">
              {userProfile.profilePicture ? (
                <img 
                  src={userProfile.profilePicture} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full object-cover border border-slate-700" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-sm text-white">
                  {userProfile.firstName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{`${userProfile.firstName} ${userProfile.lastName}`}</p>
                <p className="text-[10px] text-slate-400 truncate">{userProfile.travelStyle}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          ></div>
        )}

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* HEADER / NAVBAR */}
          <header className="h-20 bg-[#08090d]/80 backdrop-blur-md border-b border-[#181926] px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <h1 className="text-lg md:text-xl font-display font-medium text-white tracking-wide">
                {activeTab === 'community' ? "Traveler's Community" : "GlobeTrotter Plan"}
              </h1>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              {activeTab === 'community' && (
                <div className="relative hidden md:block w-64 lg:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search destinations, travel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#11121d] border border-[#212338] text-sm text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#009b86] focus:ring-1 focus:ring-[#009b86] placeholder-slate-500 transition-all"
                  />
                </div>
              )}

              {/* Notification Center */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsSettingsOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border border-[#1d1f30] text-slate-300 hover:bg-[#121320] transition-colors relative ${
                    isNotificationOpen ? 'bg-[#121320] border-[#009b86]' : 'bg-[#0f1019]'
                  }`}
                >
                  <Bell size={18} />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#08090d]"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-[#0f111d] border border-[#202236] rounded-2xl shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-[#202236] mb-3">
                      <span className="font-semibold text-sm text-white">Notifications</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-[10px] text-teal-400 hover:underline"
                        >
                          Mark read
                        </button>
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] text-slate-400 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">All caught up!</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={`p-2.5 rounded-lg text-xs leading-relaxed transition-colors ${
                              notif.read ? 'bg-transparent text-slate-400' : 'bg-[#181928] text-white border-l-2 border-[#009b86]'
                            }`}
                          >
                            <p>{notif.text}</p>
                            <span className="text-[9px] text-slate-500 mt-1 block">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings Action */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setIsNotificationOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border border-[#1d1f30] text-slate-300 hover:bg-[#121320] transition-colors ${
                    isSettingsOpen ? 'bg-[#121320] border-[#009b86]' : 'bg-[#0f1019]'
                  }`}
                >
                  <Settings size={18} />
                </button>

                {/* Settings Dropdown */}
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0f111d] border border-[#202236] rounded-2xl shadow-2xl p-4 z-50 space-y-4">
                    <h3 className="font-semibold text-sm text-white pb-2 border-b border-[#202236]">Profile Settings</h3>
                    <div className="space-y-2.5">
                      <label className="text-xs text-slate-400 block font-medium">Configure Travel Style</label>
                      <select 
                        value={userProfile.travelStyle}
                        onChange={(e) => {
                          setUserProfile(prev => ({ ...prev, travelStyle: e.target.value }));
                          showToast(`Travel style set to: ${e.target.value}`);
                        }}
                        className="w-full text-xs bg-[#171929] border border-[#23263f] text-white rounded-lg p-2 focus:outline-none focus:border-[#009b86]"
                      >
                        <option value="Adventure & Nature">Adventure & Nature</option>
                        <option value="Luxury Hotels & Dining">Luxury Hotels & Dining</option>
                        <option value="Backpacker & Budget">Backpacker & Budget</option>
                        <option value="Cultural Heritage">Cultural Heritage</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-[#202236]">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between text-xs text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                      >
                        <span>Sign Out of GlobeTrotter</span>
                        <LogOut size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* MAIN TAB LOGIC ROUTING */}
          <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
            
            {/* 1. COMMUNITY TAB (Mockup Page Implementation) */}
            {activeTab === 'community' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Community Feed Content (Column 1 & 2) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Community Feed Title Area */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">Traveler's Feed</h2>
                    {searchQuery && (
                      <span className="text-xs bg-[#191b29] border border-slate-700 text-slate-400 px-3 py-1 rounded-full">
                        Showing results for "{searchQuery}"
                      </span>
                    )}
                  </div>

                  {/* Traveler Feed Posts list */}
                  {filteredPosts.length === 0 ? (
                    <div className="bg-[#12131d] border border-[#212338] rounded-2xl p-12 text-center text-slate-400 space-y-3">
                      <p className="font-semibold text-lg text-white">No itineraries matching search criteria</p>
                      <button 
                        onClick={() => { setSearchQuery(''); }}
                        className="bg-[#009b86] hover:bg-[#008674] text-white px-4 py-2 rounded-xl text-xs font-semibold mt-2"
                      >
                        Reset Search
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <article key={post.id} className="bg-[#12131d] border border-[#212338] rounded-2xl p-5 shadow-xl space-y-4 hover:border-[#303350] transition-colors">
                        
                        {/* Post Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${post.user.color || 'bg-slate-700'}`}>
                              {post.user.avatar}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-white">{post.user.name}</h3>
                              <p className="text-xs text-slate-400 font-light flex items-center gap-1.5 mt-0.5">
                                <span>{post.user.location}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                                <span>{post.user.time}</span>
                              </p>
                            </div>
                          </div>
                          {post.isUserTrip && (
                            <button
                              onClick={() => handleRemoveFromPublic(post.id)}
                              className="text-[10px] font-semibold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                            >
                              Remove from Public
                            </button>
                          )}
                        </div>

                        {/* Post Body */}
                        <div className="space-y-3">
                          <h4 className="text-xl font-display font-bold text-white tracking-wide">{post.title}</h4>
                          <p className="text-sm text-slate-300 leading-relaxed font-light">{post.description}</p>
                          
                          {/* Details Itinerary Badge Panel */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#171927] border border-[#24263b] rounded-xl p-3 text-xs">
                            <div>
                              <span className="text-slate-400 block mb-0.5">Destination</span>
                              <span className="text-white font-medium flex items-center gap-1">
                                <MapPin size={12} className="text-[#009b86]" /> {post.itinerary.destination}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-0.5">Duration & Budget</span>
                              <span className="text-white font-medium flex items-center gap-1">
                                <Calendar size={12} className="text-[#0ea5e9]" /> {post.itinerary.duration} • {post.itinerary.budget}
                              </span>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <span className="text-slate-400 block mb-0.5">Key Stop</span>
                              <span className="text-white font-medium truncate block">
                                {post.itinerary.stops[0]}
                              </span>
                            </div>
                          </div>

                          {/* Post Image */}
                          {post.image && (
                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#222437] group">
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>
                          )}
                        </div>

                        {/* Post Actions Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#1e2030] text-slate-400">
                          <div className="flex items-center gap-5">
                            {/* Likes */}
                            <button 
                              onClick={() => toggleLikePost(post.id)}
                              className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors text-xs font-semibold ${
                                post.likedByUser ? 'text-rose-500' : ''
                              }`}
                            >
                              <Heart size={16} fill={post.likedByUser ? 'currentColor' : 'none'} />
                              <span>{post.likes}</span>
                            </button>
                            
                            {/* Comments Count Trigger */}
                            <button 
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center gap-1.5 hover:text-white transition-colors text-xs font-semibold"
                            >
                              <MessageSquare size={16} />
                              <span>{post.comments.length}</span>
                            </button>
                          </div>

                          {/* Copy Trip Button */}
                          <button 
                            onClick={() => handleCopyTrip(post)}
                            className="border border-[#009b86]/50 text-[#00a896] hover:bg-[#009b86]/10 hover:border-[#009b86] px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <Copy size={13} />
                            <span>Copy Trip</span>
                          </button>
                        </div>

                        {/* Expanded Comments Drawer */}
                        {expandedComments.has(post.id) && (
                          <div className="bg-[#171928] border border-[#22243c] rounded-xl p-4 mt-2 space-y-4">
                            <span className="text-xs font-semibold text-white tracking-wide block uppercase pb-2 border-b border-[#22243c]">
                              Comments
                            </span>
                            
                            {/* List of comments */}
                            {post.comments.length === 0 ? (
                              <p className="text-xs text-slate-500 py-2">No comments yet. Start the conversation!</p>
                            ) : (
                              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {post.comments.map(c => (
                                  <div key={c.id} className="text-xs space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-white">{c.user}</span>
                                      <span className="text-[10px] text-slate-500 font-light">{c.time}</span>
                                    </div>
                                    <p className="text-slate-300 bg-[#11121d] px-3 py-2 rounded-lg border border-[#1e2030] leading-relaxed">
                                      {c.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Comment Input */}
                            <form 
                              onSubmit={(e) => handleAddComment(e, post.id)} 
                              className="flex gap-2"
                            >
                              <input 
                                type="text"
                                placeholder="Add a comment on this itinerary..."
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                className="flex-1 bg-[#11121d] border border-[#262842] text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-[#009b86]"
                              />
                              <button 
                                type="submit"
                                className="bg-[#009b86] hover:bg-[#008674] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                              >
                                Post
                              </button>
                            </form>
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </div>

                {/* Right Widgets Sidebar Column (Column 3) */}
                <div className="space-y-6">
                  

                  {/* TOP CONTRIBUTORS CARD */}
                  <section className="bg-[#12131d] border border-[#212338] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#212338]">
                      <Award size={18} className="text-[#0ea5e9]" />
                      <h3 className="font-display font-semibold text-base text-white tracking-wide">Top Contributors</h3>
                    </div>

                    <div className="space-y-3.5">
                      {topContributors.map(contrib => (
                        <div key={contrib.id} className="flex items-center justify-between gap-3 p-2 hover:bg-[#171927] rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-9 h-9 rounded-full ${contrib.color || 'bg-slate-700'} flex items-center justify-center font-bold text-xs text-white`}>
                                {contrib.avatar}
                              </div>
                              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-[#12131d] ${
                                contrib.rank === 1 ? 'bg-teal-500' : 'bg-amber-500'
                              }`}>
                                {contrib.rank}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs text-white">{contrib.name}</h4>
                              <p className="text-[10px] text-slate-400 font-light mt-0.5">{contrib.copies}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleFollowUser(contrib.id, contrib.name)}
                            className={`p-2 rounded-lg transition-colors ${
                              followedUsers.has(contrib.id)
                                ? 'bg-teal-950 text-teal-400 border border-teal-800'
                                : 'bg-[#1b1c2b] text-slate-400 hover:text-white border border-slate-700'
                            }`}
                            title={followedUsers.has(contrib.id) ? 'Following' : 'Follow'}
                          >
                            {followedUsers.has(contrib.id) ? <UserCheck size={14} /> : <UserPlus size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              /* Other tabs (Main Page, My Trips, Explore) are kept empty as they will be pulled from teammates later */
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 animate-pulse">
                  <Globe size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-300 font-display">Teammate Page Placeholder</h2>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  This page tab ({activeTab}) will be created by another developer. The community page content remains isolated under the **Community** tab.
                </p>
                <button
                  onClick={() => setActiveTab('community')}
                  className="bg-[#1b1c2b] border border-slate-700 text-slate-300 hover:text-white py-2 px-4 rounded-xl text-xs font-semibold transition-colors"
                >
                  Return to Community Feed
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {copyTripModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-200">
          <div className="bg-[#141622] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Copy size={16} className="text-[#009b86]" />
                <span>Copy Trip Details</span>
              </h3>
              <button 
                onClick={() => setCopyTripModal(prev => ({ ...prev, isOpen: false, post: null }))}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Specify dates for copying <strong>"{copyTripModal.post?.title}"</strong> to your trips list.</p>
            </div>

            <form onSubmit={handleConfirmCopyTrip} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-gray-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={copyTripModal.startDate}
                    onChange={(e) => setCopyTripModal(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full bg-[#0c0d12] border border-[#212338] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#009b86]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-gray-300">End Date</label>
                  <input
                    type="date"
                    required
                    value={copyTripModal.endDate}
                    onChange={(e) => setCopyTripModal(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full bg-[#0c0d12] border border-[#212338] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#009b86]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCopyTripModal(prev => ({ ...prev, isOpen: false, post: null }))}
                  className="px-4 py-2 rounded-xl text-gray-300 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-[#009b86] hover:bg-[#008674] transition shadow-lg shadow-teal-950/50 cursor-pointer font-semibold"
                >
                  Confirm Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Community;
