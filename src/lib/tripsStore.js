// Shared trip store backed by localStorage.
// Both MyTrips and NewTrip pages use this to keep data in sync across navigation.

const STORAGE_KEY = 'globetrotter_upcoming_trips';

// Default seed trips (static placeholders matching UpcomingTripCard shape)
const DEFAULT_UPCOMING = [
  {
    id: 'iceland-01',
    title: 'Icelandic Ring Road',
    destination: 'Iceland',
    dates: 'Feb 10 - Feb 24, 2025',
    departureDate: '2025-02-10',
    returnDate: '2025-02-24',
    countdownDays: 42,
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=1000&auto=format&fit=crop',
    status: 'upcoming'
  },
  {
    id: 'amalfi-01',
    title: 'Amalfi Coast Escape',
    destination: 'Amalfi Coast, Italy',
    dates: 'May 05 - May 12, 2025',
    departureDate: '2025-05-05',
    returnDate: '2025-05-12',
    countdownDays: 115,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
    status: 'upcoming'
  }
];

/** Load upcoming trips from localStorage, seeding with defaults on first run */
export function loadUpcomingTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 0) return parsed;
    }
  } catch (e) {
    console.warn('GlobalTrotter: failed to parse trips from storage', e);
  }
  // First run — seed with defaults
  saveUpcomingTrips(DEFAULT_UPCOMING);
  return DEFAULT_UPCOMING;
}

/** Persist the current upcoming trips list to localStorage */
export function saveUpcomingTrips(trips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.warn('GlobalTrotter: failed to save trips to storage', e);
  }
}

/** Compute days until departure from today */
export function computeCountdownDays(departureDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dep = new Date(departureDate);
  dep.setHours(0, 0, 0, 0);
  const diff = Math.ceil((dep - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

/** Format a date range string e.g. "Sep 10 - Sep 17, 2026" */
export function formatDateRange(departureDate, returnDate) {
  const opts = { month: 'short', day: 'numeric' };
  const dep = new Date(departureDate + 'T00:00:00');
  const ret = new Date(returnDate + 'T00:00:00');
  const depStr = dep.toLocaleDateString('en-US', opts);
  const retStr = ret.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  return `${depStr} - ${retStr}`;
}

/** Build a new trip object compatible with UpcomingTripCard */
export function buildTrip({ title, destination, departureDate, returnDate, coverImage }) {
  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    destination,
    dates: formatDateRange(departureDate, returnDate),
    departureDate,
    returnDate,
    countdownDays: computeCountdownDays(departureDate),
    image: coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
    status: 'upcoming'
  };
}
