import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ShieldAlert, AlertTriangle, UserX, Flag, CheckCircle2, X } from 'lucide-react';

export const SafetyModals: React.FC = () => {
  const {
    safetyModalData,
    clearWarning,
    reportedProfileModalOpen,
    setReportedProfileModalOpen,
    reportProfile,
    violations,
    haptic,
  } = useApp();

  const [reportReason, setReportReason] = useState('Suspicious / Asking for money');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportConfirm = () => {
    haptic('medium');
    setReportSuccess(true);
    setTimeout(() => {
      reportProfile('target', reportReason);
      setReportSuccess(false);
    }, 1500);
  };

  return (
    <>
      {/* Contact Leak Detected Warning Modal */}
      {safetyModalData.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl relative">
            <div className="w-14 h-14 mx-auto bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-center text-white mb-2">
              {safetyModalData.title}
            </h3>

            <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">
              {safetyModalData.message}
            </p>

            {safetyModalData.pattern && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Detected pattern: <strong>{safetyModalData.pattern}</strong></span>
              </div>
            )}

            <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] text-slate-400 mb-6 space-y-1">
              <p>• Warning Count: <strong>{violations.warningCount} / 3</strong></p>
              <p>• Accounts exceeding 3 offences are automatically locked for several days.</p>
            </div>

            <button
              onClick={() => {
                haptic('light');
                clearWarning();
              }}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 font-bold rounded-2xl text-white transition active:scale-[0.98]"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* Report and Block Flow Modal */}
      {reportedProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setReportedProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {reportSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">User Reported & Blocked</h3>
                <p className="text-xs text-slate-400">
                  This profile will no longer appear in your discovery deck or messages. Our moderation team reviews every report within 2 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 text-rose-500 mb-2">
                  <Flag className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Report & Block Profile</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Help us maintain high safety standards. Select why you are reporting this user:
                </p>

                <div className="space-y-2.5 mb-6">
                  {[
                    'Suspicious flat photos / fake listing',
                    'Asking for token advance before flat visit',
                    'Sharing off-platform phone numbers or handles',
                    'Disrespectful or abusive behavior',
                    'Not matching verified identity',
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                        reportReason === reason
                          ? 'border-rose-500 bg-rose-500/10 text-white font-medium'
                          : 'border-slate-800 bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setReportedProfileModalOpen(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportConfirm}
                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 rounded-2xl text-xs font-bold text-white shadow-lg shadow-rose-500/25"
                  >
                    Report & Block
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
