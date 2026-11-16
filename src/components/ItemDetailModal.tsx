import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  X,
  MapPin,
  Calendar,
  Tag,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  Lock,
  MessageCircle,
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedItem,
    closeItemDetail,
    deleteItem,
    openEditModal,
    submitClaimRequest,
    openUploaderVerify,
    isAdmin,
  } = usePortal();

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimantName, setClaimantName] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimError, setClaimError] = useState('');

  if (!selectedItem) return null;

  const isLost = selectedItem.status === 'lost';
  const isFound = selectedItem.status === 'found';
  const isClaimed = selectedItem.status === 'claimed';

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError('');

    if (!claimantName.trim()) {
      setClaimError('Your Name is mandatory.');
      return;
    }
    const cleanPhone = claimantPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setClaimError('A valid 10-digit Mobile Number is mandatory.');
      return;
    }
    if (!proofDetails.trim()) {
      setClaimError('Please provide details/proof of ownership.');
      return;
    }

    submitClaimRequest({
      itemId: selectedItem.id,
      itemTitle: selectedItem.title,
      claimantName: claimantName.trim(),
      claimantPhone: claimantPhone.trim(),
      proofDetails: proofDetails.trim(),
    });

    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimSubmitted(false);
      setShowClaimForm(false);
    }, 2500);
  };

  const cleanPhoneForWa = selectedItem.contactPhone.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 transform transition-all">
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-gray-900 overflow-hidden">
          <img
            src={selectedItem.imageUrl}
            alt={selectedItem.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={closeItemDetail}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {isLost && (
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white shadow-md uppercase tracking-wider">
                Lost Item
              </span>
            )}
            {isFound && (
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-md uppercase tracking-wider">
                Found Item
              </span>
            )}
            {isClaimed && (
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-purple-600 text-white shadow-md uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reunited with Owner
              </span>
            )}
          </div>

          {/* Title on Image bottom */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{selectedItem.category}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow">
              {selectedItem.title}
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Grid (NO EMAIL) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Location</p>
                <p className="font-semibold">{selectedItem.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Date Reported</p>
                <p className="font-semibold">
                  {selectedItem.date} {selectedItem.time && `• ${selectedItem.time}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Reported By</p>
                <p className="font-semibold truncate">{selectedItem.reporterName}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Item Details & Distinctive Marks
            </h4>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed bg-white p-4 rounded-2xl border border-gray-200/80">
              {selectedItem.description}
            </p>
          </div>

          {/* Reward Alert if any */}
          {selectedItem.reward && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Owner Reward Offered
                </span>
                <p className="text-sm font-semibold text-amber-950 mt-0.5">
                  {selectedItem.reward}
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
          )}

          {/* Direct Contact to Uploader (Mobile Phone & WhatsApp) */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">
                Direct Contact to {selectedItem.reporterName}
              </p>
              <p className="text-base font-extrabold text-blue-950 font-mono mt-0.5">
                {selectedItem.contactPhone}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${selectedItem.contactPhone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${cleanPhoneForWa}?text=Hi%20${encodeURIComponent(selectedItem.reporterName)},%20I%20saw%20your%20post%20on%20CMRTC%20ReFind%20regarding%20${encodeURIComponent(selectedItem.title)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Claim / Ownership Verification Form (NO EMAIL, MANDATORY NAME & PHONE) */}
          {!isClaimed && (
            <div className="border border-indigo-100 bg-indigo-50/40 rounded-2xl p-5">
              {!showClaimForm ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Is this your item?
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Submit your ownership verification to connect with the uploader.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowClaimForm(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition active:scale-95 shrink-0"
                  >
                    Claim This Item
                  </button>
                </div>
              ) : claimSubmitted ? (
                <div className="text-center py-4 text-emerald-700">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2 animate-bounce" />
                  <p className="font-bold text-sm">Claim Request Submitted Successfully!</p>
                  <p className="text-xs text-gray-600 mt-1">
                    The uploader and campus desk have received your details and phone number.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                    <span className="text-xs font-bold text-indigo-950 uppercase">
                      Submit Claim Request (Name & Phone Mandatory)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowClaimForm(false)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>

                  {claimError && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                      {claimError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suresh Kumar"
                        value={claimantName}
                        onChange={(e) => setClaimantName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Your Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={claimantPhone}
                        onChange={(e) => setClaimantPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Proof of Ownership <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Describe specific features (e.g. phone lockscreen wallpaper, stickers, scratches, internal items)..."
                      value={proofDetails}
                      onChange={(e) => setProofDetails(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      Send Claim Details
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Action Row: Reunited & Edit (Protected for Uploader or Admin Only!) */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Editing & Reunited status can only be modified by the uploader ({selectedItem.reporterName}) or Admin.</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!isClaimed && (
                <button
                  onClick={() => {
                    closeItemDetail();
                    openUploaderVerify(selectedItem, 'reunite');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Mark as Reunited
                </button>
              )}

              <button
                onClick={() => {
                  closeItemDetail();
                  openUploaderVerify(selectedItem, 'edit');
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                title="Only uploader or admin can edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Post</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm(`Admin Action: Delete "${selectedItem.title}"?`)) {
                      deleteItem(selectedItem.id);
                    }
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Admin Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
