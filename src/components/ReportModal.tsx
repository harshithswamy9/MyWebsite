import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, Upload, Check, Sparkles, Image as ImageIcon, Phone, User, AlertCircle } from 'lucide-react';
import { Category, ItemStatus } from '../types';

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

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    closeReportModal,
    reportType,
    addItem,
  } = usePortal();

  const [status, setStatus] = useState<ItemStatus>(reportType || 'lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Miscellaneous');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  );
  const [time, setTime] = useState('');

  // MANDATORY Name and Mobile Number
  const [reporterName, setReporterName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reward, setReward] = useState('');

  // Direct image upload (NO presets)
  const [imageUrl, setImageUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isReportModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Mandatory validations
    if (!title.trim()) {
      setErrorMsg('Please enter the item name.');
      return;
    }
    if (!reporterName.trim()) {
      setErrorMsg('Your Full Name is mandatory.');
      return;
    }
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const finalImage =
      imageTab === 'url' && customUrl.trim()
        ? customUrl.trim()
        : imageUrl ||
          'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80';

    addItem({
      title: title.trim(),
      description: description.trim() || 'No additional description provided.',
      category,
      status,
      location: location.trim() || 'CMRTC Campus Grounds',
      date:
        date.trim() ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      time: time.trim() || undefined,
      imageUrl: finalImage,
      reporterName: reporterName.trim(),
      contactPhone: contactPhone.trim(),
      reward: status === 'lost' && reward.trim() ? reward.trim() : undefined,
    });

    closeReportModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-5 relative">
          <button
            onClick={closeReportModal}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {status === 'lost' ? 'Add Lost Item' : 'Report Found Item'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              {status === 'lost'
                ? 'Did you lose an item on campus? Please enter details below.'
                : 'Did you find an item on campus? Please enter details to help reunite it.'}
            </p>
          </div>

          {/* Toggle Type */}
          <div className="mt-4 flex justify-center">
            <div className="bg-black/25 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 border border-white/20">
              <button
                type="button"
                onClick={() => setStatus('lost')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  status === 'lost'
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                I Lost an Item
              </button>
              <button
                type="button"
                onClick={() => setStatus('found')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  status === 'found'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                I Found an Item
              </button>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Blue Dell Laptop, AirPods Pro, Car Keys, Student ID"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Mandatory Contact Details: Name & Mobile Number (NO EMAIL) */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <span>Your Identity & Contact (Mandatory)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Used to verify your identity when marking as Reunited.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Provide distinctive features, color, brand, stickers, serial details, or specific marks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Photo Upload ONLY (Presets Removed) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Upload Photo (Optional)
              </label>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`font-semibold ${imageTab === 'upload' ? 'text-blue-600 underline' : 'text-gray-500'}`}
                >
                  From Device / Camera
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`font-semibold ${imageTab === 'url' ? 'text-blue-600 underline' : 'text-gray-500'}`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {imageTab === 'upload' ? (
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center hover:border-blue-500 transition">
                {imageUrl ? (
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-xs"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600" /> Photo attached
                      </p>
                      <label className="mt-1 inline-block text-[11px] text-blue-600 hover:underline cursor-pointer">
                        Change photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-gray-700">
                      Tap to choose photo from mobile camera or gallery
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Supports JPG, PNG, WEBP</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="mt-2 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
              />
            )}
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Last seen / Found Location
              </label>
              <input
                type="text"
                placeholder="e.g. Canteen, CSE Lab 3, Library 1st Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date & Optional Reward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm"
              />
            </div>

            {status === 'lost' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Reward (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹500 or Treat at Canteen"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Time (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={closeReportModal}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
