import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, ImagePlus, AlertCircle, Loader2 } from 'lucide-react';
import { buildTrip, loadUpcomingTrips, saveUpcomingTrips } from '../lib/tripsStore';
import Footer from '../components/common/Footer';

// ─── Fallback cinematic background shown before user picks an image ────────────
const PLACEHOLDER_BG = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop';

const NewTrip = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle]             = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDeparture] = useState('');
  const [returnDate, setReturn]       = useState('');
  const [coverImage, setCoverImage]   = useState(null);   // data URL or null
  const [coverPreview, setCoverPreview] = useState(PLACEHOLDER_BG);
  const [errors, setErrors]           = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const fileInputRef = useRef(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!title.trim())       e.title = 'Trip title is required.';
    if (!destination.trim()) e.destination = 'Destination is required.';
    if (!departureDate)      e.departureDate = 'Departure date is required.';
    if (!returnDate)         e.returnDate = 'Return date is required.';
    if (departureDate && returnDate && returnDate < departureDate) {
      e.returnDate = 'Return date must be after departure date.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Cover image picker ──────────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCoverImage(ev.target.result);
      setCoverPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Form submission ─────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const newTrip = buildTrip({
        title: title.trim(),
        destination: destination.trim(),
        departureDate,
        returnDate,
        coverImage: coverImage || null
      });

      const existing = loadUpcomingTrips();
      saveUpcomingTrips([newTrip, ...existing]);

      navigate('/trips');
    } catch (err) {
      console.error('Failed to create trip:', err);
      setErrors({ submit: 'Something went wrong. Please try again.' });
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/trips');

  // ── Shared input class helper ───────────────────────────────────────────────
  const inputClass = (hasErr) =>
    `w-full bg-[#0c0d12] border ${hasErr ? 'border-red-500/60' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#009688] transition`;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 flex flex-col antialiased selection:bg-teal-500/30 selection:text-teal-200">

      {/* ── Top Back Bar ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#0b0c10]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 py-3">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white tracking-widest uppercase transition cursor-pointer group"
          aria-label="Back to My Trips"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#14b8a6]" />
          <span>Back</span>
        </button>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-5xl">

          {/* Card */}
          <div className="bg-[#141622] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[520px]">

            {/* ── LEFT: Cover Image Panel ──────────────────────────────────── */}
            <div
              className="relative lg:w-[45%] min-h-[260px] lg:min-h-full flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              aria-label="Set cover image"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              {/* Background Image */}
              <img
                src={coverPreview}
                alt="Trip cover"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/60 transition-all duration-300" />

              {/* Pick image CTA */}
              <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-teal-500/20 group-hover:border-teal-500/40 transition-all duration-300">
                  <ImagePlus size={24} className="text-white group-hover:text-[#14b8a6]" />
                </div>
                <span className="text-xs font-bold text-white tracking-[0.15em] uppercase drop-shadow">
                  {coverImage ? 'Change Cover' : 'Set Cover Image'}
                </span>
                {!coverImage && (
                  <span className="text-[11px] text-gray-300/70">Click to upload from your device</span>
                )}
              </div>

              {/* Hidden actual file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                aria-label="Upload cover image"
              />
            </div>

            {/* ── RIGHT: Form Panel ────────────────────────────────────────── */}
            <div className="flex-1 p-7 sm:p-10 flex flex-col justify-center space-y-7">

              {/* Heading */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  New Journey
                </h1>
                <p className="text-sm text-gray-400">Where does the road lead next?</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Global submit error */}
                {errors.submit && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3">
                    <AlertCircle size={14} />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Trip Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase" htmlFor="tripTitle">
                    Trip Title
                  </label>
                  <input
                    id="tripTitle"
                    type="text"
                    value={title}
                    onChange={e => { setTitle(e.target.value); setErrors(p => ({...p, title: null})); }}
                    placeholder="e.g., Autumn in Kyoto"
                    className={inputClass(errors.title)}
                    autoComplete="off"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />{errors.title}
                    </p>
                  )}
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase" htmlFor="tripDestination">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14b8a6] pointer-events-none" />
                    <input
                      id="tripDestination"
                      type="text"
                      value={destination}
                      onChange={e => { setDestination(e.target.value); setErrors(p => ({...p, destination: null})); }}
                      placeholder="Search cities, countries..."
                      className={`${inputClass(errors.destination)} pl-9`}
                      autoComplete="off"
                    />
                  </div>
                  {errors.destination && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />{errors.destination}
                    </p>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Departure */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase" htmlFor="departure">
                      Departure
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14b8a6] pointer-events-none" />
                      <input
                        id="departure"
                        type="date"
                        value={departureDate}
                        onChange={e => { setDeparture(e.target.value); setErrors(p => ({...p, departureDate: null, returnDate: null})); }}
                        className={`${inputClass(errors.departureDate)} pl-9 [color-scheme:dark]`}
                        min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                      />
                    </div>
                    {errors.departureDate && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} />{errors.departureDate}
                      </p>
                    )}
                  </div>

                  {/* Return */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase" htmlFor="return">
                      Return
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14b8a6] pointer-events-none" />
                      <input
                        id="return"
                        type="date"
                        value={returnDate}
                        onChange={e => { setReturn(e.target.value); setErrors(p => ({...p, returnDate: null})); }}
                        className={`${inputClass(errors.returnDate)} pl-9 [color-scheme:dark]`}
                        min={departureDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.returnDate && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} />{errors.returnDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#009688] hover:bg-[#008477] disabled:opacity-60 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-950/50 active:scale-[0.98] text-sm cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Creating…</span>
                      </>
                    ) : (
                      <>
                        <span>Start Planning</span>
                        <ArrowLeft size={16} className="rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

          {/* Breadcrumb hint below card */}
          <p className="text-center text-[11px] text-gray-600 mt-5">
            GlobalTrotter &mdash; Plan your next adventure
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewTrip;
