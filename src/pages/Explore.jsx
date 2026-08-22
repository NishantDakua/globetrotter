import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/trips/Sidebar';
import Footer from '../components/common/Footer';
import { loadWishlist, saveWishlist } from '../lib/wishlistStore';
import { useSettings } from '../context/SettingsContext';
import { 
  Search, 
  Heart, 
  ArrowRight, 
  MapPin, 
  Compass, 
  Sparkles,
  Check,
  Star,
  Clock,
  SearchX,
  Filter,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';

// Featured Destination Data (Hero)
const FEATURED_DESTINATION = {
  id: 'norwegian-fjords',
  title: 'The Norwegian Fjords',
  category: 'Trending Destination',
  location: 'Norway',
  description: 'Experience the silent majesty of deep glacial valleys. A curated itinerary for the discerning adventurer seeking solitude and spectacle.',
  image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop',
  duration: '7 Days / 6 Nights',
  rating: '4.98'
};

// Editor's Picks Destinations Data
const EDITOR_PICKS = [
  {
    id: 'kyoto-autumn',
    title: 'Kyoto Ancient Temples & Gardens',
    category: 'Cultural Escape',
    location: 'Kyoto, Japan',
    description: 'Wander through golden bamboo groves, historic wooden shrines, and secluded tea houses in Japan’s cultural heartland.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
    duration: '8 Days / 7 Nights',
    rating: '4.95'
  },
  {
    id: 'amalfi-coast',
    title: 'Amalfi Cliffside Elegance',
    category: 'Coastal Retreat',
    location: 'Amalfi Coast, Italy',
    description: 'Discover pastel-hued villages clinging to dramatic coastal cliffs, azure waters, and sun-drenched lemon groves.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
    duration: '6 Days / 5 Nights',
    rating: '4.88'
  },
  {
    id: 'swiss-alps',
    title: 'Swiss Alps Glacier Traverse',
    category: 'Alpine Luxury',
    location: 'Zermatt, Switzerland',
    description: 'Ride high-altitude scenic railways, conquer snowy trails under Matterhorn peaks, and unwind in fireside chalet spas.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
    duration: '7 Days / 6 Nights',
    rating: '4.92'
  },
  {
    id: 'santorini-sunset',
    title: 'Santorini Island Sanctuary',
    category: 'Mediterranean Escape',
    location: 'Santorini, Greece',
    description: 'Iconic whitewashed architecture overlooking volcanic calderas, Aegean sunsets, and private cliffside infinity pools.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop',
    duration: '5 Days / 4 Nights',
    rating: '4.96'
  },
  {
    id: 'serengeti-safari',
    title: 'Serengeti Wilderness Expedition',
    category: 'Wilderness Adventure',
    location: 'Serengeti, Tanzania',
    description: 'Witness the Great Migration, luxury canvas safari camps, and golden sunsets across vast African plains.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop',
    duration: '9 Days / 8 Nights',
    rating: '4.94'
  },
  {
    id: 'reykjavik-aurora',
    title: 'Icelandic Northern Lights',
    category: 'Arctic Wonder',
    location: 'Reykjavik, Iceland',
    description: 'Bathe in geothermal hot springs, marvel at cascading frozen waterfalls, and dance under vibrant green auroras.',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1000&auto=format&fit=crop',
    duration: '6 Days / 5 Nights',
    rating: '4.91'
  }
];

const CATEGORIES = [
  'All',
  'Cultural Escape',
  'Alpine Luxury',
  'Coastal Retreat',
  'Mediterranean Escape',
  'Wilderness Adventure',
  'Arctic Wonder'
];

const Explore = () => {
  const navigate = useNavigate();
  const { t } = useSettings();

  // Search Query state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter & Sort States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy]                     = useState('recommended');

  // View All toggle state
  const [showAll, setShowAll] = useState(false);

  // Wishlist items state backed by wishlistStore & localStorage
  const [wishlist, setWishlist] = useState(() => loadWishlist());

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  const toggleWishlist = (dest) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === dest.id);
      if (exists) {
        return prev.filter(item => item.id !== dest.id);
      }
      return [...prev, dest];
    });
  };

  // Pre-fill trip creation flow when clicking "Explore Trip"
  const handleExploreTrip = (dest) => {
    navigate('/new-trip', {
      state: {
        title: dest.title,
        destination: dest.location || dest.destination || dest.title,
        coverImage: dest.image,
        from: '/explore'
      }
    });
  };

  // Filter & Sort Logic
  const query = searchQuery.trim().toLowerCase();

  const matchesFilter = (dest) => {
    // 1. Search query filter
    if (query) {
      const matchQuery = [dest.title, dest.location, dest.category, dest.description].some(text => 
        text.toLowerCase().includes(query)
      );
      if (!matchQuery) return false;
    }
    // 2. Category filter
    if (selectedCategory !== 'All' && dest.category !== selectedCategory) {
      return false;
    }
    return true;
  };

  const isFeaturedMatch = matchesFilter(FEATURED_DESTINATION);

  let filteredPicks = EDITOR_PICKS.filter(matchesFilter);

  // Apply Sorting
  filteredPicks = [...filteredPicks].sort((a, b) => {
    if (sortBy === 'rating') {
      return parseFloat(b.rating) - parseFloat(a.rating);
    }
    if (sortBy === 'duration-asc') {
      const daysA = parseInt(a.duration) || 0;
      const daysB = parseInt(b.duration) || 0;
      return daysA - daysB;
    }
    if (sortBy === 'duration-desc') {
      const daysA = parseInt(a.duration) || 0;
      const daysB = parseInt(b.duration) || 0;
      return daysB - daysA;
    }
    if (sortBy === 'name-asc') {
      return a.title.localeCompare(b.title);
    }
    return 0; // recommended order
  });

  const displayedPicks = showAll ? filteredPicks : filteredPicks.slice(0, 4);

  const hasResults = isFeaturedMatch || filteredPicks.length > 0;
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'recommended';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col md:flex-row antialiased selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Shared GlobalTrotter Sidebar */}
      <Sidebar onOpenNewTrip={() => navigate('/new-trip')} />

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-y-auto flex flex-col justify-between">
        <div className="px-4 py-6 sm:p-8 md:p-10 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* ─── Top Controls Area (Search, Filter, Sort) ─────────────────────────── */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Functional Search Bar */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-[#141622] border border-white/10 rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#009688] transition shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 px-1.5 py-0.5 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Workable Filter & Sort Controls */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                
                {/* Category Select Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#141622] border border-white/10 text-xs font-medium text-gray-200 hover:text-white rounded-xl pl-8 pr-7 py-2.5 appearance-none focus:outline-none focus:border-teal-500 transition cursor-pointer shadow-lg"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                  <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
                </div>

                {/* Sort By Select Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#141622] border border-white/10 text-xs font-medium text-gray-200 hover:text-white rounded-xl pl-8 pr-7 py-2.5 appearance-none focus:outline-none focus:border-teal-500 transition cursor-pointer shadow-lg"
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="rating">Sort: Highest Rated</option>
                    <option value="duration-asc">Sort: Duration (Shortest)</option>
                    <option value="duration-desc">Sort: Duration (Longest)</option>
                    <option value="name-asc">Sort: Name (A - Z)</option>
                  </select>
                  <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
                </div>

                {/* Reset Filters CTA if active */}
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-medium px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    title="Reset all filters"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 cursor-pointer ${
                      isActive 
                        ? 'bg-[#009688] text-white shadow-md shadow-teal-950/40' 
                        : 'bg-[#141622] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {cat === 'All' ? 'All Destinations' : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Featured Destination Hero Card ───────────────────────────────────── */}
          {isFeaturedMatch && (
            <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group min-h-[440px] sm:min-h-[480px] flex flex-col justify-between p-6 sm:p-10">
              {/* Background Cinematic Image */}
              <img
                src={FEATURED_DESTINATION.image}
                alt="The Norwegian Fjords"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Dark Gradient Overlay for Maximum Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/75 to-black/30 pointer-events-none" />

              {/* Watermark Branding Header */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-medium tracking-widest text-gray-300/80 uppercase">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Compass size={12} className="text-[#14b8a6]" />
                  <span>Destinations | GlobalTrotter</span>
                </div>
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 space-y-4 max-w-2xl pt-24 sm:pt-32">
                {/* Trending Badge */}
                <div className="inline-flex items-center gap-1.5 bg-teal-950/60 border border-[#009688]/40 text-[#67d9c9] text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                  <Sparkles size={13} className="text-[#67d9c9]" />
                  <span>{FEATURED_DESTINATION.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                  {FEATURED_DESTINATION.title}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                  {FEATURED_DESTINATION.description}
                </p>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleExploreTrip(FEATURED_DESTINATION)}
                    className="bg-[#67d9c9] hover:bg-[#52cbb9] text-[#0b0c10] font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-teal-950/50 hover:shadow-teal-900/60 transition-all flex items-center gap-2 cursor-pointer group/btn"
                  >
                    <span>{t('exploreTrip')}</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(FEATURED_DESTINATION)}
                    className={`
                      border backdrop-blur-md text-xs sm:text-sm font-medium px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer
                      ${wishlist.some(item => item.id === FEATURED_DESTINATION.id)
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-black/40 border-white/20 text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Heart 
                      size={16} 
                      className={wishlist.some(item => item.id === FEATURED_DESTINATION.id) ? 'fill-rose-500 text-rose-400' : ''} 
                    />
                    <span>
                      {wishlist.some(item => item.id === FEATURED_DESTINATION.id) ? t('inWishlist') : t('addToWishlist')}
                    </span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ─── Editor's Picks Section ─────────────────────────────────────────────── */}
          {filteredPicks.length > 0 && (
            <section className="space-y-5 pt-2">
              <div className="flex items-end justify-between border-b border-white/5 pb-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                    {t('editorsPicks')}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Handcrafted experiences for this season.
                  </p>
                </div>

                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="text-xs font-semibold text-[#67d9c9] hover:text-[#52cbb9] transition cursor-pointer flex items-center gap-1"
                >
                  <span>{showAll ? 'Show Featured Only' : 'View All'}</span>
                  <ArrowRight size={14} className={showAll ? 'rotate-180 transition-transform' : ''} />
                </button>
              </div>

              {/* Destination Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {displayedPicks.map(dest => {
                  const isWishlisted = wishlist.some(item => item.id === dest.id);

                  return (
                    <div 
                      key={dest.id}
                      className="bg-[#141622] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-teal-500/30 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative h-52 sm:h-56 overflow-hidden">
                          <img
                            src={dest.image}
                            alt={dest.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141622] via-transparent to-black/20" />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-teal-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                            {dest.category}
                          </div>

                          {/* Rating Pill */}
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span>{dest.rating}</span>
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-medium">
                            <MapPin size={13} />
                            <span>{dest.location}</span>
                          </div>

                          <h3 className="text-lg font-serif font-bold text-white group-hover:text-teal-200 transition-colors leading-snug">
                            {dest.title}
                          </h3>

                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                            {dest.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Clock size={12} />
                          <span>{dest.duration}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(dest)}
                            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-medium ${
                              isWishlisted 
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            aria-label="Add to Wishlist"
                          >
                            <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-400' : ''} />
                          </button>

                          <button
                            onClick={() => handleExploreTrip(dest)}
                            className="bg-[#009688] hover:bg-[#008477] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-950/40"
                          >
                            <span>Explore Trip</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Empty Search/Filter State ─────────────────────────────────────────── */}
          {!hasResults && (
            <div className="bg-[#141622] border border-white/10 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto">
                <SearchX size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-white">No destinations found</h3>
                <p className="text-xs text-gray-400">
                  We couldn't find any travel experiences matching your search and filter criteria.
                </p>
              </div>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-[#009688] text-white text-xs font-medium rounded-xl hover:bg-[#008477] transition cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Global Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Explore;
