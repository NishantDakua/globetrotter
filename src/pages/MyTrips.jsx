import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/trips/Sidebar';
import PageHeader from '../components/trips/PageHeader';
import CurrentTripCard from '../components/trips/CurrentTripCard';
import UpcomingTripCard from '../components/trips/UpcomingTripCard';
import PastAdventureItem from '../components/trips/PastAdventureItem';
import DeleteConfirmationModal from '../components/trips/DeleteConfirmationModal';
import TripModal from '../components/trips/TripModal';
import { loadWishlist, saveWishlist } from '../lib/wishlistStore';
import { ChevronRight, Heart, MapPin, Star, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { loadUpcomingTrips, saveUpcomingTrips } from '../lib/tripsStore';
import { useSettings } from '../context/SettingsContext';

const MyTrips = () => {
  const navigate = useNavigate();
  const { t, formatPrice } = useSettings();

  // Currently Exploring (loaded from localStorage so public status persists)
  const [currentlyExploring, setCurrentlyExploring] = useState(() => {
    const raw = localStorage.getItem('globetrotter_currently_exploring');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed) return parsed;
      } catch (e) {}
    }
    return {
      id: 'kyoto-01',
      destination: 'Kyoto, Japan',
      title: 'Kyoto Autumn Retreat',
      dates: 'Nov 12 - Nov 19, 2024',
      currentDay: 4,
      totalDays: 7,
      percentage: 57,
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop',
      isPublic: false
    };
  });

  useEffect(() => {
    if (currentlyExploring) {
      localStorage.setItem('globetrotter_currently_exploring', JSON.stringify(currentlyExploring));
    } else {
      localStorage.removeItem('globetrotter_currently_exploring');
    }
  }, [currentlyExploring]);

  // Toggle Public visibility of a trip
  const handleTogglePublic = (trip) => {
    const tripId = trip.id;
    if (currentlyExploring && currentlyExploring.id === tripId) {
      setCurrentlyExploring(prev => ({
        ...prev,
        isPublic: !prev.isPublic
      }));
    } else {
      setUpcomingTrips(prev => prev.map(t => {
        if (t.id === tripId) {
          return { ...t, isPublic: !t.isPublic };
        }
        return t;
      }));
    }
  };

  // Upcoming Bookings — loaded from localStorage so newly created trips appear
  const [upcomingTrips, setUpcomingTrips] = useState(() => loadUpcomingTrips());

  // Wishlist items loaded from wishlistStore & localStorage
  const [wishlistItems, setWishlistItems] = useState(() => loadWishlist());

  // Persist wishlist changes
  useEffect(() => {
    saveWishlist(wishlistItems);
  }, [wishlistItems]);

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  // Persist whenever upcomingTrips changes (but NOT on first mount to avoid overwrite)
  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    saveUpcomingTrips(upcomingTrips);
  }, [upcomingTrips]);

  // Past Adventures (static — not affected by new trip creation)
  const [pastAdventures] = useState([
    {
      id: 'tokyo-01',
      title: 'Neon Tokyo Nights',
      dates: 'Sep 01 - Sep 14, 2024',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'alps-01',
      title: 'Alpine Traverse',
      dates: 'Mar 15 - Mar 22, 2024',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
    }
  ]);

  // Modal control
  const [tripToDelete, setTripToDelete] = useState(null);
  const [activeModal, setActiveModal] = useState({ type: null, data: null });

  // Delete handler
  const handleDeleteConfirm = (tripId) => {
    if (currentlyExploring && currentlyExploring.id === tripId) {
      setCurrentlyExploring(null);
    } else {
      setUpcomingTrips(prev => prev.filter(t => t.id !== tripId));
    }
    setTripToDelete(null);
  };

  // Handle trip submission (both new trip creation and existing trip edit)
  const handleSaveTrip = (tripData) => {
    if (currentlyExploring && currentlyExploring.id === tripData.id) {
      setCurrentlyExploring(prev => ({ ...prev, ...tripData }));
    } else {
      setUpcomingTrips(prev => {
        const exists = prev.some(t => t.id === tripData.id);
        if (exists) {
          return prev.map(t => t.id === tripData.id ? { ...t, ...tripData } : t);
        }
        return [tripData, ...prev];
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col md:flex-row antialiased selection:bg-teal-500/30 selection:text-teal-200">

      {/* Sidebar — + New Trip navigates to /new-trip page */}
      <Sidebar onOpenNewTrip={() => navigate('/new-trip', { state: { from: '/trips' } })} />

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 overflow-y-auto px-4 py-6 sm:p-8 md:p-10 space-y-10">
        <div className="max-w-6xl mx-auto space-y-10">

          <PageHeader countryCount={31} />

          {/* Currently Exploring */}
          {currentlyExploring && (
            <section className="space-y-4">
              <CurrentTripCard
                trip={currentlyExploring}
                onViewLiveItinerary={() => navigate('/itinerary')}
                onEditPlanner={() => setActiveModal({ type: 'edit-planner', data: currentlyExploring })}
                onChangeTrip={() => setActiveModal({ type: 'change-trip', data: currentlyExploring })}
                onDelete={t => setTripToDelete(t)}
                onTogglePublic={handleTogglePublic}
              />
            </section>
          )}

          {/* Upcoming Bookings */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase">{t('upcomingBookings')}</h3>
              <span className="text-xs text-gray-500 font-medium">{upcomingTrips.length} Booked</span>
            </div>

            {upcomingTrips.length === 0 ? (
              <div className="bg-[#141622] border border-white/10 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-gray-400">No upcoming bookings planned yet.</p>
                <button
                  onClick={() => navigate('/new-trip', { state: { from: '/trips' } })}
                  className="px-4 py-2 bg-[#009688] text-white text-xs font-medium rounded-xl hover:bg-[#008477] transition cursor-pointer"
                >
                  + Plan a New Adventure
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingTrips.map(trip => (
                  <UpcomingTripCard
                    key={trip.id}
                    trip={trip}
                    onEdit={t => setActiveModal({ type: 'edit-planner', data: t })}
                    onChange={t => setActiveModal({ type: 'change-trip', data: t })}
                    onDelete={t => setTripToDelete(t)}
                    onTogglePublic={handleTogglePublic}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ─── MY WISHLIST SECTION ─────────────────────────────────────────── */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={15} className="text-rose-500 fill-rose-500" />
                <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase">{t('myWishlist')}</h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">{wishlistItems.length} Saved</span>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="bg-[#141622] border border-white/10 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-gray-400">No saved destinations in your wishlist yet.</p>
                <button
                  onClick={() => navigate('/explore')}
                  className="px-4 py-2 bg-[#009688] text-white text-xs font-medium rounded-xl hover:bg-[#008477] transition cursor-pointer"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#141622] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-teal-500/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141622] via-transparent to-black/30" />

                        {/* Category badge */}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-teal-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10">
                          {item.category}
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-gray-300 hover:text-rose-400 border border-white/10 transition cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-teal-400 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin size={13} />
                            <span>{item.location}</span>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-white text-[11px] font-bold bg-white/5 px-2 py-0.5 rounded-md">
                              <Star size={11} className="text-amber-400 fill-amber-400" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                        </div>

                        <h4 className="text-sm font-serif font-bold text-white leading-snug group-hover:text-teal-200 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Card Action */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock size={12} />
                        <span>{item.duration}</span>
                      </div>

                      <button
                        onClick={() => navigate('/new-trip', {
                          state: {
                            title: item.title,
                            destination: item.location || item.title,
                            coverImage: item.image,
                            from: '/trips'
                          }
                        })}
                        className="bg-[#009688] hover:bg-[#008477] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Plan Trip</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past Adventures */}
          <section className="space-y-4 pt-2 pb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase">PAST ADVENTURES</h3>
              <button
                onClick={() => setActiveModal({ type: 'change-trip', data: null })}
                className="text-xs font-medium text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="bg-[#141622] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-xl">
              {pastAdventures.map(adventure => (
                <PastAdventureItem
                  key={adventure.id}
                  adventure={adventure}
                  onReviewJournal={adv => setActiveModal({ type: 'review-journal', data: adv })}
                />
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={!!tripToDelete}
        trip={tripToDelete}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <TripModal
        type={activeModal.type}
        data={activeModal.data}
        isOpen={!!activeModal.type}
        onClose={() => setActiveModal({ type: null, data: null })}
        onSubmit={handleSaveTrip}
      />
    </div>
  );
};

export default MyTrips;
