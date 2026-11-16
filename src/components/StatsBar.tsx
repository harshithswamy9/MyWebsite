import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Package, Search, CheckCircle, Sparkles } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const { stats, filterStatus, setFilterStatus, setActiveTab } = usePortal();

  const handleStatClick = (status: 'all' | 'lost' | 'found' | 'claimed') => {
    setFilterStatus(status);
    setActiveTab('browse');
  };

  return (
    <div className="bg-white border-b border-gray-200/80 shadow-xs py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* TOTAL ITEMS */}
          <button
            onClick={() => handleStatClick('all')}
            className={`flex items-center gap-3.5 p-3 rounded-2xl transition text-left group ${
              filterStatus === 'all'
                ? 'bg-blue-50/80 border border-blue-200'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">
                {stats.total}
              </p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                TOTAL ITEMS
              </p>
            </div>
          </button>

          {/* LOST */}
          <button
            onClick={() => handleStatClick('lost')}
            className={`flex items-center gap-3.5 p-3 rounded-2xl transition text-left group ${
              filterStatus === 'lost'
                ? 'bg-rose-50/80 border border-rose-200'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight leading-none mb-1">
                {stats.lost}
              </p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                LOST
              </p>
            </div>
          </button>

          {/* FOUND */}
          <button
            onClick={() => handleStatClick('found')}
            className={`flex items-center gap-3.5 p-3 rounded-2xl transition text-left group ${
              filterStatus === 'found'
                ? 'bg-emerald-50/80 border border-emerald-200'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight leading-none mb-1">
                {stats.found}
              </p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                FOUND
              </p>
            </div>
          </button>

          {/* CLAIMED / REUNITED */}
          <button
            onClick={() => handleStatClick('claimed')}
            className={`flex items-center gap-3.5 p-3 rounded-2xl transition text-left group ${
              filterStatus === 'claimed'
                ? 'bg-purple-50/80 border border-purple-200'
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 tracking-tight leading-none mb-1">
                {stats.claimed}
              </p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                CLAIMED & REUNITED
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
