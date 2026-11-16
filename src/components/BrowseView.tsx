import React, { useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { ItemCard } from './ItemCard';
import {
  Search,
  X,
  PlusCircle,
  Tag,
  Sparkles,
} from 'lucide-react';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  'Electronics',
  'Books & Notes',
  'Wallets & Bags',
  'Clothing & Shoes',
  'ID & Cards',
  'Keys',
  'Bottles & Tumblers',
  'Jewelry & Watches',
  'Miscellaneous',
];

export const BrowseView: React.FC = () => {
  const {
    items,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    openReportModal,
    siteConfig,
  } = usePortal();

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }
      // Category filter
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false;
      }
      // Text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [items, filterStatus, filterCategory, searchQuery]);

  const hasActiveFilters =
    filterStatus !== 'all' || filterCategory !== 'all' || searchQuery.trim() !== '';

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with College Background (Matches bottom-right screenshot "Lost Items") */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-blue-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Campus Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {filterStatus === 'lost'
                ? 'Lost Items Directory'
                : filterStatus === 'found'
                ? 'Found Belongings Directory'
                : 'Browse All Campus Items'}
            </h1>
            <p className="text-sm sm:text-base text-blue-200">
              Search and filter through all items reported across {siteConfig.collegeName}.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-6 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, model, location (e.g. MacBook, Webster Hall, Library)..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === 'all'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterStatus('lost')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  filterStatus === 'lost'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Lost ({items.filter((i) => i.status === 'lost').length})
              </button>
              <button
                onClick={() => setFilterStatus('found')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  filterStatus === 'found'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Found ({items.filter((i) => i.status === 'found').length})
              </button>
              <button
                onClick={() => setFilterStatus('claimed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === 'claimed'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reunited ({items.filter((i) => i.status === 'claimed').length})
              </button>
            </div>
          </div>

          {/* Categories Horizontal Scroll / Select */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 shrink-0 mr-1">
                <Tag className="w-3.5 h-3.5" /> Category:
              </span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  filterCategory === 'all'
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 whitespace-nowrap flex items-center gap-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count & Actions */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-gray-600">
            Showing <span className="text-gray-900 font-bold">{filteredItems.length}</span> items
            {hasActiveFilters && ' (filtered)'}
          </p>

          <button
            onClick={() => openReportModal()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <PlusCircle className="w-4 h-4" /> Report an item
          </button>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No matching items found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any items matching your search or filters. Try adjusting your query or report this item if you lost or found it.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
              >
                Clear Filters
              </button>
              <button
                onClick={() => openReportModal('lost')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
              >
                Report Missing Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
