import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Compass, MapPin, Phone, Clock, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteConfig, setActiveTab, openReportModal, isAdmin } = usePortal();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Identity & Motto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {siteConfig.portalName}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Official lost and found community portal serving students, faculty, and campus staff across {siteConfig.collegeName}.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Open Admin Console' : 'Administrator Portal Login'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Campus Security & Desk (NO EMAIL) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Central Lost & Found Desk
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{siteConfig.contactDesk.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${siteConfig.contactDesk.phone}`} className="hover:text-white transition font-mono">
                  {siteConfig.contactDesk.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{siteConfig.contactDesk.hours}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Campus Portal Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="hover:text-white transition"
                >
                  Browse All Lost & Found
                </button>
              </li>
              <li>
                <button
                  onClick={() => openReportModal('lost')}
                  className="hover:text-white transition"
                >
                  Report a Lost Item
                </button>
              </li>
              <li>
                <button
                  onClick={() => openReportModal('found')}
                  className="hover:text-white transition"
                >
                  Submit a Found Object
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-white transition"
                >
                  Administrator Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Retention Policy
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Items are retained by campus security for <strong className="text-gray-200">60 days</strong>. High-value property requires physical student verification and matching phone number record to release.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.collegeName} • Powered by CMRTC ReFind</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-blue-900/50 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded">
              Official Campus Belongings Portal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
