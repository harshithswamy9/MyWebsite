import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, Sparkles, AlertCircle } from 'lucide-react';
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

export const EditItemModal: React.FC = () => {
  const { editingItem, closeEditModal, updateItem } = usePortal();

  if (!editingItem) return null;

  const [title, setTitle] = useState(editingItem.title);
  const [description, setDescription] = useState(editingItem.description);
  const [category, setCategory] = useState<Category>(editingItem.category);
  const [status, setStatus] = useState<ItemStatus>(editingItem.status);
  const [location, setLocation] = useState(editingItem.location);
  const [date, setDate] = useState(editingItem.date);
  const [imageUrl, setImageUrl] = useState(editingItem.imageUrl);
  const [reporterName, setReporterName] = useState(editingItem.reporterName);
  const [contactPhone, setContactPhone] = useState(editingItem.contactPhone);
  const [reward, setReward] = useState(editingItem.reward || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Item title is mandatory.');
      return;
    }
    if (!reporterName.trim()) {
      setErrorMsg('Name is mandatory.');
      return;
    }
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('A valid 10-digit mobile number is mandatory.');
      return;
    }

    updateItem(editingItem.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      location: location.trim(),
      date: date.trim(),
      imageUrl: imageUrl.trim(),
      reporterName: reporterName.trim(),
      contactPhone: contactPhone.trim(),
      reward: reward.trim() || undefined,
    });
    closeEditModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8">
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-base">Edit Item Details</h3>
          </div>
          <button onClick={closeEditModal} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
                <option value="claimed">Claimed / Reunited</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mandatory Name & Mobile Number (NO EMAIL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Reporter Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Reward (Optional)
              </label>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
