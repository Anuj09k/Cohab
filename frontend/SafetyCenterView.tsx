import React, { useState } from 'react';
import { useApp } from './AppContext';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Trash2,
  FileText,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  EyeOff,
} from 'lucide-react';

export const SafetyCenterView: React.FC = () => {
  const { violations, currentUser, updateCurrentUser, haptic, t } = useApp();
  const [dataDeletionRequested, setDataDeletionRequested] = useState(false);

  const handleRequestDataDeletion = () => {
    haptic('heavy');
    setDataDeletionRequested(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto no-scrollbar p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-900">
        <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Trust, Safety & DPDP Center</h2>
          <p className="text-[11px] text-slate-400">Zero-compromise security for your roommate search on Cohab</p>
        </div>
      </div>

      {/* Account Safety Shield Status Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Account Standing</h3>
          </div>
          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
              violations.warningCount === 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {violations.warningCount === 0 ? 'Good Standing (0 Strikes)' : `${violations.warningCount} Strike(s)`}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Cohab protects your phone number and social handles from automated scraping. Anti-Leak Shields monitor match notes and direct chats.
        </p>

        <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-[11px] space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Contact Leak Warning Strike:</span>
            <span className="font-bold text-rose-400">{violations.warningCount} / 3 warnings</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Policy:</span>
            <span className="text-slate-400">&gt;3 strikes locks account for 3 days</span>
          </div>
          {violations.suspendedUntil && (
            <div className="pt-1 border-t border-slate-800 text-rose-400 font-bold">
              Account suspended until: {new Date(violations.suspendedUntil).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Verification Protocol & 15-day policy card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">15-Day Verification Rule</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          To maintain an ecosystem free of fake bots and ghost listings, every user must complete ID and multi-angle face verification within 15 days of sign-up. Accounts remaining unverified are locked for 75 days.
        </p>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <p className="font-semibold text-white">Current Status:</p>
            <p className="text-[11px] text-slate-400">
              {currentUser.verification.status === 'verified'
                ? `Verified on ${currentUser.verification.verifiedAt}`
                : `${currentUser.verification.daysRemainingToVerify} days remaining`}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold ${
              currentUser.verification.status === 'verified'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {currentUser.verification.status === 'verified' ? 'Active Verified' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* India DPDP Act Compliance & Data Rights */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-sky-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            India DPDP Act (2023) Rights
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Cohab adheres strictly to Section 6 (Consent) and Section 8 (Data Minimisation) of the Digital Personal Data Protection Act.
        </p>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Raw Government ID photos are purged immediately post cryptographic hash validation.</span>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Face angle scans are converted to a 256-bit mathematical template; images are never sold or retained.</span>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Right to Erasure: Trigger instant complete deletion of account and chats.</span>
          </div>
        </div>

        {/* Data Deletion Trigger */}
        <div className="pt-2">
          {dataDeletionRequested ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-white">Erasure Request Logged</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                All records, hashes, and chat threads scheduled for immediate purging per DPDP Rule 8.
              </p>
            </div>
          ) : (
            <button
              onClick={handleRequestDataDeletion}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Request Account & Data Erasure</span>
            </button>
          )}
        </div>
      </div>

      {/* In-Person Safe Meetup Protocols */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Meetup Guidelines</h3>
        </div>

        <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>Always schedule first meetups in public cafes or busy coffee shops.</li>
          <li>For flat visits, bring a friend or notify your trusted emergency contact before entering.</li>
          <li>Never transfer token cash or security deposit prior to physical verification.</li>
          <li>Use the in-chat Safe Meetup Scheduler for auto-alert timeout monitoring.</li>
        </ul>
      </div>
    </div>
  );
};
