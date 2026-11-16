import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Shield,
  Lock,
  LogOut,
  Sliders,
  Package,
  FileCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Phone,
  Search,
  Key,
  Download,
  RotateCcw,
  PlusCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Cloud,
  ExternalLink,
  Copy,
  RefreshCw,
  Wifi,
  WifiOff,
  Check,
} from 'lucide-react';
import { CAMPUS_PRESET_IMAGES } from '../data/initialData';
import { compressImage } from '../utils/imageCompressor';

export const AdminPortal: React.FC = () => {
  const {
    isAdmin,
    adminLogin,
    adminLogout,
    siteConfig,
    updateSiteConfig,
    items,
    claimRequests,
    deleteItem,
    openEditModal,
    openReportModal,
    markItemAsClaimed,
    resetToDefaults,
    cloudStatus,
    testCloudConnection,
    lastSavedAt,
  } = usePortal();

  // Login form state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Admin tab state
  const [adminTab, setAdminTab] = useState<'inventory' | 'claims' | 'customize' | 'security' | 'cloud'>('inventory');
  const [tableSearch, setTableSearch] = useState('');

  // Cloud DB sync state
  const [cloudUrlInput, setCloudUrlInput] = useState(siteConfig.cloudDbUrl || '');
  const [cloudTestResult, setCloudTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [cloudSaveSuccess, setCloudSaveSuccess] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  useEffect(() => {
    if (siteConfig.cloudDbUrl) {
      setCloudUrlInput(siteConfig.cloudDbUrl);
    }
  }, [siteConfig.cloudDbUrl]);

  // Change PIN state
  const [newPin, setNewPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const success = adminLogin(pinInput);
    if (!success) {
      setPinError('Invalid Admin Passkey. Please try again.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      alert('PIN must be at least 4 characters.');
      return;
    }
    updateSiteConfig({ adminPin: newPin.trim() });
    setNewPin('');
    setPinSuccessMsg('Admin Passkey updated successfully!');
    setTimeout(() => setPinSuccessMsg(''), 3000);
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1920, 1080, 0.8);
        updateSiteConfig({ heroImage: compressed });
      } catch (err) {
        console.warn('Hero image compression fallback:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            updateSiteConfig({ heroImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleExportData = () => {
    const data = {
      siteConfig,
      items,
      claimRequests,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cmrtc-refind-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If NOT logged in, show secure login screen
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 text-center">
            <div className="w-14 h-14 bg-blue-600/30 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-400/30">
              <Shield className="w-7 h-7 text-blue-300" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">CMRTC Administrator Portal</h2>
            <p className="text-xs text-blue-200 mt-1">
              Protected access for campus administration, site editing & inventory control
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Enter Admin Passkey / PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter administrator passkey"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <span>Default Passkey:</span>
                <code className="bg-gray-100 text-gray-800 font-bold px-1.5 py-0.5 rounded">
                  cmrtc123
                </code>
              </p>
            </div>

            {pinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition active:scale-95"
            >
              Sign In to Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered inventory items for admin table
  const filteredItems = items.filter((item) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.reporterName.toLowerCase().includes(q) ||
      item.contactPhone.includes(q)
    );
  });

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  CMRTC Admin Control Portal
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Full administrative rights: edit any item, customize portal branding, and review claims
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
              title="Backup JSON Data"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setAdminTab('inventory')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'inventory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventory Manager ({items.length})
          </button>

          <button
            onClick={() => setAdminTab('claims')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'claims'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Student Claims
            {claimRequests.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {claimRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('customize')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'customize'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Site Customizer (Branding & Hero)
          </button>

          <button
            onClick={() => setAdminTab('security')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Key className="w-4 h-4" />
            Security & Passkey
          </button>

          <button
            onClick={() => setAdminTab('cloud')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'cloud'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Cloud Sync (Netlify)
            {cloudStatus === 'connected' ? (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Online Sync
              </span>
            ) : siteConfig.cloudDbUrl ? (
              <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Error
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Setup
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGER */}
        {adminTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item, uploader name, or phone..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <button
                onClick={() => openReportModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Item as Admin</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-900 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Uploader Details</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[180px]">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[180px]">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {item.status === 'lost' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                            Lost
                          </span>
                        )}
                        {item.status === 'found' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                            Found
                          </span>
                        )}
                        {item.status === 'claimed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase">
                            Reunited
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{item.reporterName}</div>
                        <a
                          href={`tel:${item.contactPhone}`}
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{item.contactPhone}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{item.location}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'claimed' && (
                            <button
                              onClick={() => markItemAsClaimed(item.id)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold border border-emerald-200"
                              title="Mark as Reunited"
                            >
                              Reunited
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 rounded hover:bg-blue-50"
                            title="Edit Item Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Admin Action: Permanently delete "${item.title}"?`)) {
                                deleteItem(item.id);
                              }
                            }}
                            className="p-1.5 text-gray-500 hover:text-rose-600 rounded hover:bg-rose-50"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT CLAIMS */}
        {adminTab === 'claims' && (
          <div className="space-y-4">
            {claimRequests.length > 0 ? (
              claimRequests.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Claim on: {claim.itemTitle}
                      </span>
                      <span className="text-xs text-gray-400">• {claim.submittedAt}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      Student: {claim.claimantName}
                    </p>
                    <p className="text-xs font-mono text-blue-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {claim.claimantPhone}
                    </p>
                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 mt-2">
                      <strong>Submitted Proof:</strong> {claim.proofDetails}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${claim.claimantPhone}`}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Student
                    </a>
                    <button
                      onClick={() => markItemAsClaimed(claim.itemId)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Reunited
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-base font-bold text-gray-900">No Pending Ownership Claims</h3>
                <p className="text-xs text-gray-500 mt-1">
                  When a student submits ownership verification on any item, it will show up here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SITE CUSTOMIZATION */}
        {adminTab === 'customize' && (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Customize Portal Branding & Hero</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                All changes save live to the server and update worldwide immediately.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Portal Brand Name
                </label>
                <input
                  type="text"
                  value={siteConfig.portalName}
                  onChange={(e) => updateSiteConfig({ portalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  College / Campus Name
                </label>
                <input
                  type="text"
                  value={siteConfig.collegeName}
                  onChange={(e) => updateSiteConfig({ collegeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Tagline (Heading)
                </label>
                <input
                  type="text"
                  value={siteConfig.tagline}
                  onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={siteConfig.subtagline}
                  onChange={(e) => updateSiteConfig({ subtagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Hero Campus Image (Upload from device)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileUpload}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Or Image URL
                </label>
                <input
                  type="url"
                  value={siteConfig.heroImage}
                  onChange={(e) => updateSiteConfig({ heroImage: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              {/* Overlay darkness */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Hero Overlay Darkness</span>
                  <span>{siteConfig.heroOverlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={siteConfig.heroOverlayOpacity}
                  onChange={(e) =>
                    updateSiteConfig({ heroOverlayOpacity: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Announcement */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Announcement Banner
                  </label>
                  <input
                    type="checkbox"
                    checked={siteConfig.showAnnouncement}
                    onChange={(e) => updateSiteConfig({ showAnnouncement: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>
                {siteConfig.showAnnouncement && (
                  <textarea
                    rows={2}
                    value={siteConfig.announcement}
                    onChange={(e) => updateSiteConfig({ announcement: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                )}
              </div>

              {/* Campus Desk Contact Details (NO EMAIL) */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase">Campus Desk Details</h4>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Desk Location
                  </label>
                  <input
                    type="text"
                    value={siteConfig.contactDesk.location}
                    onChange={(e) =>
                      updateSiteConfig({
                        contactDesk: { ...siteConfig.contactDesk, location: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Desk Phone Number
                  </label>
                  <input
                    type="text"
                    value={siteConfig.contactDesk.phone}
                    onChange={(e) =>
                      updateSiteConfig({
                        contactDesk: { ...siteConfig.contactDesk, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Office Timings
                  </label>
                  <input
                    type="text"
                    value={siteConfig.contactDesk.hours}
                    onChange={(e) =>
                      updateSiteConfig({
                        contactDesk: { ...siteConfig.contactDesk, hours: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & PASSKEY */}
        {adminTab === 'security' && (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Change Admin Passkey</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Set a secret passkey to prevent unauthorized access to this Admin Portal.
              </p>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Current Passkey
                </label>
                <input
                  type="text"
                  disabled
                  value={siteConfig.adminPin}
                  className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  New Passkey (minimum 4 characters)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter new passkey"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono"
                />
              </div>

              {pinSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  {pinSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
              >
                Save New Passkey
              </button>
            </form>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm('Reset entire portal to default demo state?')) {
                    resetToDefaults();
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: CLOUD DATABASE & NETLIFY SYNC */}
        {adminTab === 'cloud' && (
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">
                  Cloud Database & Multi-Device Synchronization
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Netlify is a static host. Connecting a free Cloud Database (Google Firebase Realtime Database) enables live real-time sync across all mobile phones, PCs, and laptops worldwide.
              </p>
            </div>

            {/* Sync Status Badge */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                cloudStatus === 'connected'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : siteConfig.cloudDbUrl
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <div
                className={`p-2 rounded-xl text-white shrink-0 ${
                  cloudStatus === 'connected'
                    ? 'bg-emerald-600'
                    : siteConfig.cloudDbUrl
                    ? 'bg-rose-600'
                    : 'bg-amber-600'
                }`}
              >
                {cloudStatus === 'connected' ? (
                  <Wifi className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {cloudStatus === 'connected'
                    ? 'Worldwide Real-Time Sync is Active'
                    : siteConfig.cloudDbUrl
                    ? 'Cloud Database Connection Error'
                    : 'Single-Device Local Storage Only'}
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {cloudStatus === 'connected'
                    ? `All items, status updates, and custom settings sync instantly across all devices. Last synced at: ${lastSavedAt || 'Just now'}.`
                    : siteConfig.cloudDbUrl
                    ? 'Could not connect to the configured cloud database URL. Please check the URL and Firebase database permissions.'
                    : 'Changes are currently saved only to this specific browser. To sync across other phones and PCs on Netlify, connect a free Firebase database below.'}
                </p>
              </div>
            </div>

            {/* Cloud Database URL Form */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Cloud Database REST URL (Firebase Realtime Database)
                </label>
                <input
                  type="url"
                  placeholder="https://your-project-id-default-rtdb.firebaseio.com/portalData.json"
                  value={cloudUrlInput}
                  onChange={(e) => {
                    setCloudUrlInput(e.target.value);
                    setCloudSaveSuccess(false);
                    setCloudTestResult(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Tip: Firebase Realtime Database URLs must end with <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono">/portalData.json</code>
                </p>
              </div>

              {/* Feedback messages */}
              {cloudSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Cloud Database URL saved successfully! Syncing live.</span>
                </div>
              )}

              {cloudTestResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 border ${
                    cloudTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {cloudTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <span>{cloudTestResult.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = cloudUrlInput.trim();
                    updateSiteConfig({ cloudDbUrl: trimmed });
                    setCloudSaveSuccess(true);
                    setTimeout(() => setCloudSaveSuccess(false), 3000);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Save Database URL
                </button>

                <button
                  type="button"
                  disabled={isTestingCloud || !cloudUrlInput.trim()}
                  onClick={async () => {
                    setIsTestingCloud(true);
                    setCloudTestResult(null);
                    const res = await testCloudConnection(cloudUrlInput.trim());
                    setCloudTestResult(res);
                    setIsTestingCloud(false);
                  }}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? 'animate-spin' : ''}`} />
                  <span>{isTestingCloud ? 'Testing...' : 'Test Connection'}</span>
                </button>

                {siteConfig.cloudDbUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Disconnect from Cloud Database and revert to local storage?')) {
                        setCloudUrlInput('');
                        updateSiteConfig({ cloudDbUrl: '' });
                        setCloudTestResult(null);
                      }
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>

            {/* 1-Click Multi-Device Share Link */}
            {cloudUrlInput.trim() && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Instant Multi-Device Link (Share with Phones / Sir)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}${window.location.pathname}?db=${encodeURIComponent(cloudUrlInput.trim())}`}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-600 truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const shareLink = `${window.location.origin}${window.location.pathname}?db=${encodeURIComponent(cloudUrlInput.trim())}`;
                      navigator.clipboard.writeText(shareLink);
                      setCopiedShareLink(true);
                      setTimeout(() => setCopiedShareLink(false), 2500);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1"
                  >
                    {copiedShareLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShareLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Opening this link on any mobile phone or computer will automatically connect that device to your cloud database!
                </p>
              </div>
            )}

            {/* 2-Minute Google Firebase Step-by-Step Guide */}
            <div className="pt-5 border-t border-gray-100 bg-gray-50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>How to create your Free Firebase Database (2 mins)</span>
                </h4>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Firebase Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Go to <strong className="text-gray-900">console.firebase.google.com</strong> with your Google account and click <strong className="text-gray-900">Add project</strong> (e.g. named <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-gray-800">cmrtc-refind</code>).
                </li>
                <li>
                  In the left sidebar menu, click <strong className="text-gray-900">Build</strong> &rarr; <strong className="text-gray-900">Realtime Database</strong> &rarr; click <strong className="text-gray-900">Create Database</strong>.
                </li>
                <li>
                  Choose any location (e.g. Singapore / US), select <strong className="text-gray-900">"Start in test mode"</strong> (read & write true), and click <strong className="text-gray-900">Enable</strong>.
                </li>
                <li>
                  Copy the database URL shown at the top (e.g., <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-gray-800">https://cmrtc-refind-default-rtdb.firebaseio.com</code>).
                </li>
                <li>
                  Add <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-bold">/portalData.json</code> to the end and paste it into the input above!
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
