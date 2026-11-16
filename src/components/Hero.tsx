import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Search, Image as ImageIcon, Sparkles, Check, ArrowRight } from 'lucide-react';
import { CAMPUS_PRESET_IMAGES } from '../data/initialData';

export const Hero: React.FC = () => {
  const {
    siteConfig,
    updateSiteConfig,
    searchQuery,
    setSearchQuery,
    openReportModal,
    setActiveTab,
    isAdmin,
  } = usePortal();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setActiveTab('browse');
  };

  return (
    <section className="relative min-h-[520px] md:min-h-[580px] flex items-center justify-center text-white overflow-hidden">
      {/* Background College Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteConfig.heroImage}
          alt={`${siteConfig.collegeName} Campus`}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Darkening Overlay for readable text */}
        <div
          className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]"
          style={{ opacity: siteConfig.heroOverlayOpacity / 100 + 0.15 }}
        />
        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/40" />
      </div>

      {/* Floating Change Photo Pill (Visible to Admin Only!) */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              onClick={() => setShowPhotoPicker(!showPhotoPicker)}
              className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg transition active:scale-95"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin: Change Campus Photo</span>
            </button>

            {/* Quick Photo Switcher Popover */}
            {showPhotoPicker && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 text-gray-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Choose Campus Photo
                  </span>
                  <button
                    onClick={() => setShowPhotoPicker(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {CAMPUS_PRESET_IMAGES.map((preset) => {
                    const isSelected = siteConfig.heroImage === preset.url;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          updateSiteConfig({ heroImage: preset.url });
                          setShowPhotoPicker(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition border ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-12 h-10 object-cover rounded-lg shrink-0 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {preset.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Image URL input */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Or Paste Custom Image URL:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="https://...campus-photo.jpg"
                      defaultValue={siteConfig.heroImage}
                      id="custom-hero-input"
                      className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          'custom-hero-input'
                        ) as HTMLInputElement;
                        if (input && input.value.trim()) {
                          updateSiteConfig({ heroImage: input.value.trim() });
                          setShowPhotoPicker(false);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        {/* College Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase mb-6 border border-white/20">
          <span>🎓</span>
          <span>{siteConfig.collegeName}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md leading-tight">
          {siteConfig.tagline}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-gray-200/95 max-w-2xl mx-auto mb-8 font-normal drop-shadow">
          {siteConfig.subtagline}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto mb-6 relative"
        >
          <div className="flex items-center bg-white rounded-full p-1.5 shadow-2xl border border-white/30 focus-within:ring-4 focus-within:ring-blue-500/30 transition-all">
            <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search for items... (e.g., Laptop, keys, ID card, shoes)"
              className="w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 bg-transparent rounded-full focus:outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold transition active:scale-95 shrink-0 shadow-md"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => openReportModal('lost')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            I Lost Something
          </button>

          <button
            onClick={() => openReportModal('found')}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            I Found Something
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className="text-white/80 hover:text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition underline-offset-4 hover:underline"
          >
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
