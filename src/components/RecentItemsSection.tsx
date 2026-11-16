import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ItemCard } from './ItemCard';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { ItemStatus } from '../types';

export const RecentItemsSection: React.FC = () => {
  const { items, setActiveTab, openReportModal } = usePortal();
  const [localFilter, setLocalFilter] = useState<'all' | ItemStatus>('all');

  const filteredItems = items.filter((item) => {
    if (localFilter === 'all') return true;
    return item.status === localFilter;
  });

  // Recent items - show up to 8
  const recentItems = filteredItems.slice(0, 8);

  return (
    <section className="py-12 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Recent Items
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Latest items reported lost or found across campus buildings and grounds
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick status filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-1 flex items-center shadow-xs">
              <button
                onClick={() => setLocalFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  localFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setLocalFilter('lost')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  localFilter === 'lost'
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setLocalFilter('found')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  localFilter === 'found'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Found
              </button>
            </div>

            {/* View All -> Link */}
            <button
              onClick={() => setActiveTab('browse')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Item Cards Grid */}
        {recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              No items listed yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              All newly reported lost or found objects across CMRTC campus will appear here automatically.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => openReportModal('lost')}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                <Plus className="w-4 h-4" /> Report Lost Item
              </button>
              <button
                onClick={() => openReportModal('found')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                <Plus className="w-4 h-4" /> Report Found Item
              </button>
            </div>
          </div>
        )}

        {/* Callout Banner at bottom of recent items */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              Found an unattended item anywhere on campus?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Take 30 seconds to upload a photo and drop off the item at Campus Security or your hall's front desk.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openReportModal('found')}
              className="bg-white hover:bg-gray-100 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              Report Found Item
            </button>
            <button
              onClick={() => openReportModal('lost')}
              className="bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-400/40 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition active:scale-95"
            >
              I Lost Something
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
