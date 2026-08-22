import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, Mountain, MapPin, ArrowRight, ShieldCheck, Globe, UserCheck } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import LazyVideo from '../components/LazyVideo';

const itineraries = [
  {
    id: 'swiss-alps',
    title: 'Swiss Alps Traverse',
    badge: 'ALPINE',
    duration: '7 Days',
    image: '/images/pexels-alok-kumar-273007-15031440.jpg',
    description: 'A 7-day luxurious lodge-to-lodge hike through the pristine Bernese Oberland.'
  },
  {
    id: 'amalfi',
    title: 'Amalfi Elegance',
    badge: 'COASTAL',
    duration: '5 Days',
    image: '/images/pexels-frank-van-dijk-121009207-39078873.jpg',
    description: 'Boutique stays, private boat tours, and Michelin-starred dining overlooking the Mediterranean.'
  },
  {
    id: 'kyoto',
    title: 'Kyoto Traditions',
    badge: 'CULTURAL',
    duration: '10 Days',
    image: '/images/pexels-artosuraj-28762054.jpg',
    description: 'Immersive tea ceremonies, ancient temple tours, and stays in meticulously restored ryokans.'
  }
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['Culture', 'Adventure', 'Relaxation'];

  return (
    <div className="min-h-screen bg-gt-bg text-white font-sans antialiased selection:bg-gt-teal selection:text-black">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Background Video with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <LazyVideo
            src="/videos/optimized/15519794_3840_2160_24fps.mp4"
            poster="/videos/posters/15519794_3840_2160_24fps.webp"
            priority={true}
            className="w-full h-full object-cover scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gt-bg/80 via-gt-bg/50 to-gt-bg" />
        </div>

        {/* Navigation */}
        <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
            GlobalTrotter
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link to="#" className="text-gt-teal border-b-2 border-gt-teal pb-1">Explore</Link>
            <Link to="#" className="hover:text-white transition">Itineraries</Link>
            <Link to="#" className="hover:text-white transition">Community</Link>
            <Link to="#" className="hover:text-white transition">Journal</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition hidden sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gt-teal hover:bg-gt-teal-hover text-slate-950 font-semibold px-5 py-2.5 rounded-full text-sm transition duration-200 shadow-lg shadow-gt-teal/20"
            >
              Plan a Trip
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <main className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16 pb-20 flex-1 flex flex-col justify-center items-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Curate Your World
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Design deeply personal, premium travel experiences. From untamed wilderness to refined cultural capitals, orchestrate your next masterpiece.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-gt-teal hover:bg-gt-teal-hover text-slate-950 font-semibold px-8 py-3.5 rounded-xl transition duration-200 shadow-xl shadow-gt-teal/25"
            >
              Start Planning
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById('adventures');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-white font-medium px-7 py-3.5 rounded-xl backdrop-blur-md transition duration-200 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-gt-teal" />
              Explore Community
            </button>
          </div>
        </main>

        {/* Floating Search Bar */}
        <div className="relative z-10 max-w-4xl w-full mx-auto px-6 mb-8">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where is your next chapter?"
                className="w-full bg-slate-950/60 border border-slate-800/80 text-white text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-gt-teal transition placeholder-gray-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(activeCategory === category ? 'All' : category)}
                  className={`text-xs px-4 py-2.5 rounded-xl border flex items-center gap-2 whitespace-nowrap transition ${
                    activeCategory === category
                      ? 'bg-gt-teal/15 border-gt-teal text-gt-teal font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-gray-300 hover:border-slate-700'
                  }`}
                >
                  {category === 'Culture' && <MapPin className="w-3.5 h-3.5" />}
                  {category === 'Adventure' && <Mountain className="w-3.5 h-3.5" />}
                  {category === 'Relaxation' && <Globe className="w-3.5 h-3.5" />}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Adventures Section */}
      <section id="adventures" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Trending Adventures
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Highly curated itineraries for the discerning explorer.
            </p>
          </div>
          <Link
            to="/register"
            className="text-gt-teal text-sm font-medium hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itineraries.map((item) => (
            <div
              key={item.id}
              className="bg-gt-card border border-gt-border rounded-2xl overflow-hidden hover:border-gt-teal/50 hover:bg-gt-card-hover transition duration-300 flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden">
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  aspectRatio="16 / 9"
                  className="w-full h-full group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-4 left-4 bg-gt-teal/90 text-slate-950 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md z-10">
                  {item.badge}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-gt-teal transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gt-border/80 pt-4 text-xs">
                  <span className="text-gray-400 font-medium">{item.duration}</span>
                  <Link
                    to="/register"
                    className="text-gt-teal font-medium hover:underline flex items-center gap-1"
                  >
                    View Itinerary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Highlights Video Showcase */}
      <section className="bg-slate-950/60 border-y border-gt-border py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gt-teal text-xs font-semibold uppercase tracking-wider mb-2 block">
                Elevated Journeys
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                Crafted by Explorers, Tailored to Perfection
              </h2>
              <p className="text-gray-300 text-base leading-relaxed mb-8">
                Join a global network of avid travelers sharing bespoke guides, hidden gems, and handpicked local accommodations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-gt-teal/10 border border-gt-teal/20 text-gt-teal mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Verified Stays & Local Guides</h4>
                    <p className="text-gray-400 text-xs mt-1">Every itinerary is validated by experienced local connoisseurs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-gt-teal/10 border border-gt-teal/20 text-gt-teal mt-1">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Personalized Trip Assistant</h4>
                    <p className="text-gray-400 text-xs mt-1">Custom recommendations suited to your rhythm and tastes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <LazyVideo
                src="/videos/optimized/19096556-uhd_3840_2160_24fps.mp4"
                poster="/videos/posters/19096556-uhd_3840_2160_24fps.webp"
                priority={false}
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition duration-300 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gt-border bg-gt-bg py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xl font-serif font-bold text-white">GlobalTrotter</span>
            <p className="text-xs text-gray-500 mt-1">
              &copy; {new Date().getFullYear()} GlobalTrotter. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <Link to="#" className="hover:text-white transition">About Us</Link>
            <Link to="#" className="hover:text-white transition">Sustainability</Link>
            <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
