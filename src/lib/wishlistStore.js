// Storage utility for My Wishlist across Explore and MyTrips pages

const WISHLIST_STORAGE_KEY = 'globetrotter_wishlist';

export const DEFAULT_WISHLIST = [
  {
    id: 'norwegian-fjords',
    title: 'The Norwegian Fjords',
    category: 'Trending Destination',
    location: 'Norway',
    description: 'Experience the silent majesty of deep glacial valleys. A curated itinerary for the discerning adventurer seeking solitude and spectacle.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop',
    duration: '7 Days / 6 Nights',
    rating: '4.98'
  }
];

export const loadWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return DEFAULT_WISHLIST;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_WISHLIST;
  } catch {
    return DEFAULT_WISHLIST;
  }
};

export const saveWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save wishlist items to localStorage', e);
  }
};
