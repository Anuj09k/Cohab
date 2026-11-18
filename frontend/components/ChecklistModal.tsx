import React, { useState } from 'react';
import { useApp } from './AppContext';
import { CheckCircle2, ShieldAlert, Sparkles, X, ChevronRight, FileCheck, IndianRupee } from 'lucide-react';

export const ChecklistModal: React.FC = () => {
  const { checklistModalOpen, setChecklistModalOpen, haptic } = useApp();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!checklistModalOpen) return null;

  const toggleCheck = (id: string) => {
    haptic('light');
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checklist = [
    {
      id: 'c1',
      category: 'Financial Clarity',
      title: 'Security Deposit & Lock-in Period',
      desc: 'Verify the exact deposit refund terms, lock-in duration (usually 6-11 months), and painting/damage deduction clauses in writing.',
    },
    {
      id: 'c2',
      category: 'Utilities & Split',
      title: 'Maid, Cook & Electricity Bill Split',
      desc: 'Clarify how electricity meter readings (commercial vs domestic), LPG cylinders, WiFi, and cook/maid leave policies are settled.',
    },
    {
      id: 'c3',
      category: 'Lifestyle & Boundaries',
      title: 'Overnight Guests & Party Agreement',
      desc: 'Agree on weekend visitor protocols, notice before having friends over, and quiet hours during weeknights.',
    },
    {
      id: 'c4',
      category: 'Physical Inspection',
      title: 'Water Pressure, Geysers & Power Backup',
      desc: 'Test water taps in morning hours, verify UPS/generator backup capability during Bangalore/Mumbai monsoon power cuts.',
    },
    {
      id: 'c5',
      category: 'Legal Safety',
      title: 'Registered Rental Agreement with Police Verification',
      desc: 'Ensure the agreement is notarized/e-stamped directly with the actual legal landlord, not an unauthorized sub-lease.',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Before You Sign Anything</h2>
              <p className="text-xs text-slate-400">Essential Flatmate Due-Diligence Checklist</p>
            </div>
          </div>
          <button
            onClick={() => setChecklistModalOpen(false)}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="py-4">
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>Safety Readiness</span>
            <span className="text-amber-400 font-semibold">{completedCount} of {checklist.length} checked</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300 rounded-full"
              style={{ width: `${(completedCount / checklist.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
          {checklist.map((item) => {
            const isDone = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer select-none ${
                  isDone
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-slate-800/80 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-600 bg-slate-800 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-amber-400/90 mb-1">
                      {item.category}
                    </span>
                    <h4 className={`text-sm font-semibold mb-1 ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            Never transfer token money without visiting in person.
          </p>
          <button
            onClick={() => setChecklistModalOpen(false)}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
