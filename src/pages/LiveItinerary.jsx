import React, { useState } from 'react';
import Sidebar from '../components/trips/Sidebar';
import ItineraryHero from '../components/itinerary/ItineraryHero';
import ActivityCard from '../components/itinerary/ActivityCard';
import TripCalendar from '../components/itinerary/TripCalendar';
import BudgetOverview from '../components/itinerary/BudgetOverview';
import AddActivityModal from '../components/itinerary/AddActivityModal';
import Footer from '../components/common/Footer';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

const initialItineraryDays = [
  {
    dayNumber: 1,
    date: 'Nov 14, 2024',
    title: 'Day 1: Arrival & Acclimation',
    activities: [
      {
        id: 'act-1',
        time: '14:00',
        timezone: 'JST',
        title: 'KIX Airport Arrival',
        iconType: 'plane',
        description: 'Clear customs, pick up JR Pass, and take the Haruka Express directly to Kyoto Station.',
        tag: 'Transport • Included in Pass',
        cost: 0,
        category: 'transport'
      },
      {
        id: 'act-2',
        time: '16:30',
        timezone: 'JST',
        title: 'Check-in: Machiya Stay',
        iconType: 'bed',
        description: 'Drop off luggage at the traditional townhouse in Gion district. Freshen up before dinner.',
        tag: 'Lodging • Paid',
        cost: 250,
        category: 'lodging'
      }
    ]
  },
  {
    dayNumber: 2,
    date: 'Nov 15, 2024',
    title: 'Day 2: The Golden Pavilion',
    activities: [
      {
        id: 'act-3',
        time: '09:00',
        timezone: 'JST',
        title: 'Kinkaku-ji Visit',
        iconType: 'temple',
        description: 'Early morning visit to beat the crowds. Capture photos of the pavilion reflecting in the pond.',
        tag: 'Activity • ¥500',
        cost: 4,
        category: 'activity'
      }
    ]
  },
  {
    dayNumber: 3,
    date: 'Nov 16, 2024',
    title: 'Day 3: Arashiyama Bamboo Grove',
    activities: [
      {
        id: 'act-4',
        time: '08:30',
        timezone: 'JST',
        title: 'Bamboo Forest Walk & Tenryu-ji',
        iconType: 'map',
        description: 'Stroll through the iconic bamboo grove and explore the UNESCO World Heritage temple garden.',
        tag: 'Sightseeing • Free',
        cost: 0,
        category: 'activity'
      }
    ]
  },
  {
    dayNumber: 4,
    date: 'Nov 17, 2024',
    title: 'Day 4: Fushimi Inari Shrine',
    activities: [
      {
        id: 'act-5',
        time: '07:00',
        timezone: 'JST',
        title: 'Torii Gates Summit Hike',
        iconType: 'map',
        description: 'Hike through thousands of vermilion torii gates up Mount Inari for sunrise views over Kyoto.',
        tag: 'Hiking • Free',
        cost: 0,
        category: 'activity'
      }
    ]
  },
  {
    dayNumber: 5,
    date: 'Nov 18, 2024',
    title: 'Day 5: Nara Ancient Capital Day Trip',
    activities: [
      {
        id: 'act-6',
        time: '10:00',
        timezone: 'JST',
        title: 'Todai-ji Great Buddha & Deer Park',
        iconType: 'temple',
        description: 'Take Kintetsu Line to Nara. Visit the giant bronze Buddha and feed friendly free-roaming deer.',
        tag: 'Excursion • Included in Pass',
        cost: 0,
        category: 'transport'
      }
    ]
  },
  {
    dayNumber: 6,
    date: 'Nov 19, 2024',
    title: 'Day 6: Kiyomizu-dera & Tea Ceremony',
    activities: [
      {
        id: 'act-7',
        time: '14:00',
        timezone: 'JST',
        title: 'Traditional Matcha Ceremony',
        iconType: 'temple',
        description: 'Experience an authentic Japanese tea ceremony in Higashiyama with a certified tea master.',
        tag: 'Cultural • Reserved',
        cost: 45,
        category: 'activity'
      }
    ]
  },
  {
    dayNumber: 7,
    date: 'Nov 20, 2024',
    title: 'Day 7: Nishiki Market & Kaiseki Dining',
    activities: [
      {
        id: 'act-8',
        time: '18:30',
        timezone: 'JST',
        title: 'Multi-Course Kaiseki Dinner',
        iconType: 'ticket',
        description: 'Savor seasonal Kyoto cuisine at a riverside ryokan overlooking the Kamogawa River.',
        tag: 'Dining • Reserved',
        cost: 120,
        category: 'food'
      }
    ]
  },
  {
    dayNumber: 8,
    date: 'Nov 21, 2024',
    title: 'Day 8: Departure & Farewell',
    activities: [
      {
        id: 'act-9',
        time: '11:00',
        timezone: 'JST',
        title: 'Souvenir Shopping & Haruka to KIX',
        iconType: 'plane',
        description: 'Pick up Yatsuhashi sweets at Kyoto Station before boarding Haruka Express to Kansai Airport.',
        tag: 'Transport • Departure',
        cost: 0,
        category: 'transport'
      }
    ]
  }
];

const LiveItinerary = () => {
  const [itineraryDays, setItineraryDays] = useState(initialItineraryDays);
  const [modalState, setModalState] = useState({ open: false, editData: null, targetDay: 1 });

  // Compute dynamic budget from activity costs
  const allActivities = itineraryDays.flatMap(d => d.activities);
  const totalAmount = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const byCategory = { lodging: 0, food: 0, transport: 0, activity: 0 };
  allActivities.forEach(a => {
    const cat = a.category || 'activity';
    byCategory[cat] = (byCategory[cat] || 0) + (a.cost || 0);
  });
  const safeTotal = totalAmount || 1;
  const lodgingPct  = Math.round((byCategory.lodging  / safeTotal) * 100);
  const foodPct     = Math.round((byCategory.food     / safeTotal) * 100);
  const transportPct = Math.round((byCategory.transport / safeTotal) * 100);
  const activityPct = Math.round((byCategory.activity / safeTotal) * 100);

  const openAddModal = (dayNum) => {
    setModalState({ open: true, editData: null, targetDay: dayNum });
  };

  const openEditModal = (dayNum, activity) => {
    setModalState({ open: true, editData: { ...activity, dayNumber: dayNum }, targetDay: dayNum });
  };

  const handleSaveActivity = (targetDayNum, activityObj, isEditing) => {
    setItineraryDays(prevDays =>
      prevDays.map(day => {
        if (day.dayNumber === targetDayNum) {
          if (isEditing) {
            return {
              ...day,
              activities: day.activities.map(a => a.id === activityObj.id ? activityObj : a)
            };
          }
          return { ...day, activities: [...day.activities, activityObj] };
        }
        return day;
      })
    );
  };

  const handleDeleteActivity = (dayNum, activityId) => {
    setItineraryDays(prevDays =>
      prevDays.map(day => {
        if (day.dayNumber === dayNum) {
          return { ...day, activities: day.activities.filter(a => a.id !== activityId) };
        }
        return day;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col md:flex-row antialiased selection:bg-teal-500/30 selection:text-teal-200">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <main className="w-full px-4 py-6 sm:p-8 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">

            <ItineraryHero
              title="Kyoto Autumn Retreat"
              dates="Nov 14 - Nov 21, 2024"
              location="Kyoto, Japan"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

              {/* Left Column: Daily Itinerary */}
              <div className="lg:col-span-8 space-y-8">

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                      Daily Itinerary
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">8 Days Planned (Nov 14 – Nov 21, 2024)</p>
                  </div>

                  <button
                    onClick={() => openAddModal(1)}
                    className="inline-flex items-center gap-2 bg-[#009688] hover:bg-[#008477] text-white px-4 py-2 rounded-xl text-xs font-medium transition shadow-lg cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add Activity</span>
                  </button>
                </div>

                <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-12">
                  {itineraryDays.map((dayItem) => {
                    const isFirstDay = dayItem.dayNumber === 1;
                    return (
                      <div key={dayItem.dayNumber} className="relative space-y-4 pt-1 group">
                        {/* Timeline Bullet */}
                        <div className={`
                          absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#0b0c10] border-2 flex items-center justify-center transition-all
                          ${isFirstDay ? 'border-[#009688] shadow-[0_0_8px_#009688]' : 'border-white/30 group-hover:border-teal-500/50'}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isFirstDay ? 'bg-[#14b8a6]' : 'bg-gray-400'}`}></div>
                        </div>

                        {/* Day Header */}
                        <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-2xl">
                          <div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                              {dayItem.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-teal-400/90 font-medium mt-0.5">
                              <CalendarIcon size={13} />
                              <span>{dayItem.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Activity Cards */}
                        <div className="space-y-4 pt-1">
                          {dayItem.activities.length === 0 ? (
                            <div className="bg-[#141622]/50 border border-dashed border-white/10 rounded-2xl p-5 text-center">
                              <p className="text-xs text-gray-400">No activities scheduled for Day {dayItem.dayNumber} yet.</p>
                            </div>
                          ) : (
                            dayItem.activities.map(activity => (
                              <ActivityCard
                                key={activity.id}
                                {...activity}
                                onEdit={() => openEditModal(dayItem.dayNumber, activity)}
                                onDelete={() => handleDeleteActivity(dayItem.dayNumber, activity.id)}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Calendar + Budget */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit">
                <TripCalendar />
                <BudgetOverview
                  totalAmount={totalAmount}
                  lodgingPct={lodgingPct}
                  foodPct={foodPct}
                  transportPct={transportPct}
                  activitiesPct={activityPct}
                />
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Unified Add/Edit Activity Modal */}
      <AddActivityModal
        isOpen={modalState.open}
        onClose={() => setModalState({ open: false, editData: null, targetDay: 1 })}
        initialDayNumber={modalState.targetDay}
        initialData={modalState.editData}
        totalDays={itineraryDays.length}
        onSaveActivity={handleSaveActivity}
      />
    </div>
  );
};

export default LiveItinerary;
