import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, ShieldCheck, Lock, Phone, AlertCircle } from 'lucide-react';

export const UploaderVerifyModal: React.FC = () => {
  const {
    uploaderActionItem,
    closeUploaderVerify,
    verifyAndExecuteUploaderAction,
    setActiveTab,
  } = usePortal();

  const [inputPhone, setInputPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!uploaderActionItem) return null;

  const { item, action } = uploaderActionItem;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!inputPhone.trim()) {
      setErrorMsg('Please enter your 10-digit mobile number.');
      return;
    }

    const res = verifyAndExecuteUploaderAction(inputPhone.trim());
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-5 relative">
          <button
            onClick={closeUploaderVerify}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Uploader Verification</h3>
              <p className="text-xs text-blue-100">
                Security check to protect reported items
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Only the student who uploaded <strong>"{item.title}"</strong> can {action === 'reunite' ? 'mark it as Reunited' : 'edit it'}. Please enter the mobile number used when submitting the report.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Your Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                autoFocus
                placeholder="Enter 10-digit mobile number"
                value={inputPhone}
                onChange={(e) => {
                  setInputPhone(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Hint: Uploader's name is {item.reporterName}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                closeUploaderVerify();
                setActiveTab('admin');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Are you an Admin?
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeUploaderVerify}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                Verify & {action === 'reunite' ? 'Reunite' : 'Edit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
