import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/trips/Sidebar';
import PageHeader from '../components/trips/PageHeader';
import CurrentTripCard from '../components/trips/CurrentTripCard';
import UpcomingTripCard from '../components/trips/UpcomingTripCard';
import PastAdventureItem from '../components/trips/PastAdventureItem';
import DeleteConfirmationModal from '../components/trips/DeleteConfirmationModal';
import TripModal from '../components/trips/TripModal';
import { ChevronRight } from 'lucide-react';
import { loadUpcomingTrips, saveUpcomingTrips } from '../lib/tripsStore';

const MyTrips = () => {
  const navigate = useNavigate();

  // Currently Exploring (stays as local state — it's the active trip)
  const [currentlyExploring, setCurrentlyExploring] = useState({
    id: 'kyoto-01',
    destination: 'Kyoto, Japan',
    title: 'Kyoto Autumn Retreat',
    dates: 'Nov 12 - Nov 19, 2024',
    currentDay: 4,
    totalDays: 7,
    percentage: 57,
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop'
  });

  // Upcoming Bookings — loaded from localStorage so newly created trips appear
  const [upcomingTrips, setUpcomingTrips] = useState(() => loadUpcomingTrips());

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

  // Add new trip from TripModal (edit flow, etc.)
  const handleAddNewTrip = (newTrip) => {
    setUpcomingTrips(prev => [newTrip, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col md:flex-row antialiased selection:bg-teal-500/30 selection:text-teal-200">

      {/* Sidebar — + New Trip navigates to /new-trip page */}
      <Sidebar onOpenNewTrip={() => navigate('/new-trip')} />

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
              />
            </section>
          )}

          {/* Upcoming Bookings */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase">UPCOMING BOOKINGS</h3>
              <span className="text-xs text-gray-500 font-medium">{upcomingTrips.length} Booked</span>
            </div>

            {upcomingTrips.length === 0 ? (
              <div className="bg-[#141622] border border-white/10 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-gray-400">No upcoming bookings planned yet.</p>
                <button
                  onClick={() => navigate('/new-trip')}
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
                  />
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
        onSubmit={handleAddNewTrip}
      />
    </div>
  );
};

export default MyTrips;
