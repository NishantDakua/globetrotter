import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, reactAuth } from '../lib/auth';
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

  // Followed contributors and Joined groups list
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [joinedGroups, setJoinedGroups] = useState(new Set([1])); // default join Group 1

  // Modals state
  const [isExploreGroupsModalOpen, setIsExploreGroupsModalOpen] = useState(false);

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

  // Form states for creating a new post
  const [isPostFormExpanded, setIsPostFormExpanded] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    location: '',
    description: '',
    duration: '3 Days',
    budget: '$500',
    stops: '',
    activities: '',
    category: 'nature'
  });

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

  // Join/leave group toggle
  const toggleJoinGroup = (groupId, name) => {
    setJoinedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
        showToast(`Left ${name}`);
      } else {
        next.add(groupId);
        showToast(`Joined ${name}! Welcome aboard!`);
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

  // Copy itinerary mock helper
  const handleCopyTrip = (post) => {
    showToast(`"${post.title}" copied! (My Trips page will be integrated by your teammate)`);
  };

  // Create new post in community feed (only structured trips allowed)
  const handleCreatePost = (e) => {
    e.preventDefault();
    const { title, location, description, duration, budget, stops, activities, category } = newPostData;
    
    // Strict validation: must provide stops and activities to share a trip itinerary
    if (!title.trim() || !location.trim() || !description.trim() || !stops.trim() || !activities.trim()) {
      showToast('Itinerary error: Multi-city stops and activities are required to share a trip.', 'error');
      return;
    }

    const categoryImages = {
      nature: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80',
      mountains: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    };

    const newPost = {
      id: Date.now(),
      isPublic: true, // Mark trip as public so it's visible in the community feed
      user: {
        name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'You',
        avatar: userProfile ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}` : 'U',
        color: 'bg-teal-600',
        location: location,
        time: 'Just now'
      },
      title,
      description,
      image: categoryImages[category] || categoryImages.nature,
      likes: 0,
      likedByUser: false,
      comments: [],
      itinerary: {
        destination: location,
        duration: duration || '3 Days',
        budget: budget || '$500',
        stops: stops.split(',').map(s => s.trim()).filter(Boolean),
        activities: activities.split(',').map(a => a.trim()).filter(Boolean),
      }
    };

    setPosts([newPost, ...posts]);
    setIsPostFormExpanded(false);
    setNewPostData({
      title: '',
      location: '',
      description: '',
      duration: '3 Days',
      budget: '$500',
      stops: '',
      activities: '',
      category: 'nature'
    });
    showToast('Published your public trip route to the feed!');
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

  // Filtering posts based on search query AND making sure only public trips are shown
  const filteredPosts = posts.filter(post => {
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

  const groupsToFind = [
    { id: 1, name: 'Solo Luxury Travelers', count: '1.2k Members', desc: 'Connect with others wh...', icon: '💎' },
    { id: 2, name: 'Culinary Explorers', count: '850 Members', desc: 'Fine dining and hidden...', icon: '🍜' },
    { id: 3, name: 'Backpackers & Hostels', count: '2.1k Members', desc: 'Budget-friendly travel...', icon: '🎒' },
    { id: 4, name: 'Scuba & Marine Life', count: '520 Members', desc: 'Undersea exploration...', icon: '🤿' }
  ];

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

                  {/* Create New Post Form Card */}
                  <div className="bg-[#12131d] border border-[#212338] rounded-2xl p-5 shadow-xl transition-all">
                    {!isPostFormExpanded ? (
                      <div 
                        onClick={() => setIsPostFormExpanded(true)}
                        className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-white"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white">
                          {userProfile.firstName.charAt(0)}
                        </div>
                        <div className="flex-1 bg-[#181928] border border-[#262842] rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-[#1a1c2f]">
                          Add a new structured trip itinerary to share with the community...
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleCreatePost} className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-[#212338]">
                          <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Share Structured Trip Itinerary</span>
                          <button 
                            type="button" 
                            onClick={() => setIsPostFormExpanded(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Itinerary Rules Banner */}
                        <div className="bg-amber-950/20 border border-amber-800/40 text-amber-200/90 p-3 rounded-xl text-[10px] leading-relaxed">
                          <strong>Trip Itinerary Rule:</strong> To share a trip in this community, you must specify multi-city stops, activities, and budget. General travel updates or experiences without a route itinerary are not allowed.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Trip Title (Required)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 5 Days in Positano Beaches"
                              required
                              value={newPostData.title}
                              onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Destination (Required)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Amalfi Coast, Italy"
                              required
                              value={newPostData.location}
                              onChange={(e) => setNewPostData({ ...newPostData, location: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-medium">Trip Notes & Route Details (Required)</label>
                          <textarea 
                            placeholder="Describe your itinerary tips, sunset views, where to eat, or boat rental contacts..."
                            rows="3"
                            required
                            value={newPostData.description}
                            onChange={(e) => setNewPostData({ ...newPostData, description: e.target.value })}
                            className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86] resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Trip Duration (Required)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 3 Days"
                              required
                              value={newPostData.duration}
                              onChange={(e) => setNewPostData({ ...newPostData, duration: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Estimated Budget (Required)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. $800"
                              required
                              value={newPostData.budget}
                              onChange={(e) => setNewPostData({ ...newPostData, budget: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Visual Style theme</label>
                            <select
                              value={newPostData.category}
                              onChange={(e) => setNewPostData({ ...newPostData, category: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            >
                              <option value="nature">Bamboo Forest / Nature</option>
                              <option value="beach">Tropical Beach</option>
                              <option value="city">Historic City Center</option>
                              <option value="mountains">Snowy Peak / Alps</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Multi-City Stops (Required, Comma separated)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Stop A, Stop B, Stop C"
                              required
                              value={newPostData.stops}
                              onChange={(e) => setNewPostData({ ...newPostData, stops: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-medium">Planned Activities (Required, Comma separated)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Sightseeing, Food Tour, Boat Ride"
                              required
                              value={newPostData.activities}
                              onChange={(e) => setNewPostData({ ...newPostData, activities: e.target.value })}
                              className="w-full bg-[#181928] border border-[#262842] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#009b86]"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="confirm-public-trip"
                              required 
                              className="rounded border-[#262842] bg-[#181928] text-[#009b86] focus:ring-0 cursor-pointer"
                            />
                            <label htmlFor="confirm-public-trip" className="text-[10px] text-slate-400 cursor-pointer select-none">
                              Make this trip route public to all travelers in the community feed
                            </label>
                          </div>

                          <div className="flex justify-end gap-3">
                            <button 
                              type="button" 
                              onClick={() => setIsPostFormExpanded(false)}
                              className="bg-transparent hover:bg-slate-800 text-slate-300 font-medium px-4 py-2 rounded-xl text-xs transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="bg-[#009b86] hover:bg-[#008674] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-[#009b86]/10"
                            >
                              Publish Trip Route
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Traveler Feed Posts list */}
                  {filteredPosts.length === 0 ? (
                    <div className="bg-[#12131d] border border-[#212338] rounded-2xl p-12 text-center text-slate-400 space-y-3">
                      <p className="font-semibold text-lg text-white">No itineraries matching search criteria</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setIsPostFormExpanded(true); }}
                        className="bg-[#009b86] hover:bg-[#008674] text-white px-4 py-2 rounded-xl text-xs font-semibold mt-2"
                      >
                        Reset Search
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <article key={post.id} className="bg-[#12131d] border border-[#212338] rounded-2xl p-5 shadow-xl space-y-4 hover:border-[#303350] transition-colors">
                        
                        {/* Post Header */}
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
                  
                  {/* FIND TRAVEL GROUPS CARD */}
                  <section className="bg-[#12131d] border border-[#212338] rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#212338]">
                      <Users size={18} className="text-[#009b86]" />
                      <h3 className="font-display font-semibold text-base text-white tracking-wide">Find Travel Groups</h3>
                    </div>

                    <div className="space-y-3.5">
                      {groupsToFind.slice(0, 2).map(group => (
                        <div key={group.id} className="p-3 bg-[#171927] border border-[#202235] rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors">
                          <div className="flex items-start gap-2.5">
                            <span className="text-xl mt-0.5">{group.icon}</span>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-xs text-white truncate">{group.name}</h4>
                              <p className="text-[10px] text-teal-400 font-medium mt-0.5">{group.count}</p>
                              <p className="text-[10px] text-slate-400 mt-1 truncate">{group.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleJoinGroup(group.id, group.name)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                              joinedGroups.has(group.id)
                                ? 'bg-teal-950 border border-teal-800 text-teal-300'
                                : 'bg-[#1b1c2b] border border-slate-700 hover:border-slate-500 text-slate-200'
                            }`}
                          >
                            {joinedGroups.has(group.id) ? 'Joined ✓' : 'Join'}
                          </button>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setIsExploreGroupsModalOpen(true)}
                      className="w-full bg-[#1b1c2b] border border-[#272942] hover:border-slate-600 text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Explore All Groups
                    </button>
                  </section>

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

      {/* MODAL: EXPLORE ALL GROUPS */}
      {isExploreGroupsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f111d] border border-[#202236] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#202236]">
              <h3 className="font-display font-semibold text-lg text-white">Explore Travel Communities</h3>
              <button 
                onClick={() => setIsExploreGroupsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 max-h-96 overflow-y-auto">
              {groupsToFind.map(group => (
                <div key={group.id} className="p-3 bg-[#171927] border border-[#202235] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-2xl mt-0.5">{group.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-white truncate">{group.name}</h4>
                      <p className="text-[10px] text-teal-400 font-medium mt-0.5">{group.count}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{group.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleJoinGroup(group.id, group.name)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
                      joinedGroups.has(group.id)
                        ? 'bg-teal-950 border border-teal-800 text-teal-300'
                        : 'bg-[#1b1c2b] border border-slate-700 hover:border-slate-500 text-slate-200'
                    }`}
                  >
                    {joinedGroups.has(group.id) ? 'Joined ✓' : 'Join Group'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsExploreGroupsModalOpen(false)}
                className="bg-[#1b1c2b] hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
