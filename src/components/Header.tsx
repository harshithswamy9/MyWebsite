import React from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Compass,
  PlusCircle,
  Shield,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    siteConfig,
    activeTab,
    setActiveTab,
    openReportModal,
    items,
    isAdmin,
    isSyncing,
  } = usePortal();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-colors">
      {/* Announcement Banner */}
      {siteConfig.showAnnouncement && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs sm:text-sm px-4 py-2 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full">
            <span className="truncate">{siteConfig.announcement}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition">
                    {siteConfig.portalName}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    CMRTC
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate max-w-[180px] sm:max-w-[240px]">
                  {siteConfig.collegeName}
                </p>
              </div>
            </button>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'home'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'browse'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Browse Items
                <span className="text-xs bg-gray-200/80 text-gray-700 px-1.5 py-0.5 rounded-full font-mono">
                  {items.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isAdmin ? <Shield className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-gray-400" />}
                Admin Portal
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Cloud Sync Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-full"
              title="Edits automatically sync across all devices"
            >
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-medium text-gray-600">{isSyncing ? 'Saving...' : 'Live Synced'}</span>
            </div>

            {/* Separate Admin Portal Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition active:scale-95 ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
              }`}
              title="Campus Administration Portal"
            >
              {isAdmin ? <Shield className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-gray-500" />}
              <span className="hidden sm:inline">{isAdmin ? 'Admin Console' : 'Admin Login'}</span>
            </button>

            {/* + Report Button for Students */}
            <button
              onClick={() => openReportModal('lost')}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav bar */}
      <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`text-xs font-medium py-1 px-3 rounded ${
            activeTab === 'home' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`text-xs font-medium py-1 px-3 rounded flex items-center gap-1 ${
            activeTab === 'browse' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600'
          }`}
        >
          Browse ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`text-xs font-medium py-1 px-3 rounded flex items-center gap-1 ${
            activeTab === 'admin' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600'
          }`}
        >
          {isAdmin ? 'Admin (Active)' : 'Admin Portal'}
        </button>
      </div>
    </header>
  );
};
