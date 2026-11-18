import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Calculator, IndianRupee, Users, Sparkles, X, Check, ShieldCheck } from 'lucide-react';

export const RentSplitModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  targetRent?: number;
  targetDeposit?: number;
}> = ({ isOpen, onClose, targetRent = 54000, targetDeposit = 100000 }) => {
  const { haptic } = useApp();

  const [totalRent, setTotalRent] = useState(targetRent);
  const [flatmatesCount, setFlatmatesCount] = useState(3);
  const [maidCost, setMaidCost] = useState(4500);
  const [cookCost, setCookCost] = useState(6000);
  const [wifiCost, setWifiCost] = useState(1200);
  const [electricityEstimated, setElectricityEstimated] = useState(3000);
  const [includeDeposit, setIncludeDeposit] = useState(true);
  const [totalDeposit, setTotalDeposit] = useState(targetDeposit);

  if (!isOpen) return null;

  const totalMonthlyBills = maidCost + cookCost + wifiCost + electricityEstimated;
  const grandMonthlyExpense = totalRent + totalMonthlyBills;
  const perPersonMonthly = Math.round(grandMonthlyExpense / Math.max(1, flatmatesCount));
  const perPersonDeposit = Math.round(totalDeposit / Math.max(1, flatmatesCount));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Fair Rent & Bill Splitter</h3>
              <p className="text-[11px] text-slate-400">Calculate realistic monthly flatmate costs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculator Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 no-scrollbar text-xs">
          {/* Flatmates count */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Total Flatmates Sharing Flat
              </label>
              <span className="text-sm font-bold text-rose-400">{flatmatesCount} people</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setFlatmatesCount(num);
                    haptic('light');
                  }}
                  className={`py-2 rounded-xl font-bold border transition ${
                    flatmatesCount === num
                      ? 'border-rose-500 bg-rose-500/20 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400'
                  }`}
                >
                  {num} People
                </button>
              ))}
            </div>
          </div>

          {/* Base Rent input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-medium">Total Apartment Monthly Rent</label>
              <span className="font-bold text-white">₹{totalRent.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="15000"
              max="150000"
              step="1000"
              value={totalRent}
              onChange={(e) => setTotalRent(Number(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Monthly Utility Splits */}
          <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Common Monthly Expenses
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Maid & Housekeeping</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
                  <span className="text-slate-500 text-[11px] mr-1">₹</span>
                  <input
                    type="number"
                    value={maidCost}
                    onChange={(e) => setMaidCost(Number(e.target.value) || 0)}
                    className="w-full bg-transparent focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Cook (Lunch & Dinner)</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
                  <span className="text-slate-500 text-[11px] mr-1">₹</span>
                  <input
                    type="number"
                    value={cookCost}
                    onChange={(e) => setCookCost(Number(e.target.value) || 0)}
                    className="w-full bg-transparent focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">High-Speed WiFi</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
                  <span className="text-slate-500 text-[11px] mr-1">₹</span>
                  <input
                    type="number"
                    value={wifiCost}
                    onChange={(e) => setWifiCost(Number(e.target.value) || 0)}
                    className="w-full bg-transparent focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Electricity (Est.)</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
                  <span className="text-slate-500 text-[11px] mr-1">₹</span>
                  <input
                    type="number"
                    value={electricityEstimated}
                    onChange={(e) => setElectricityEstimated(Number(e.target.value) || 0)}
                    className="w-full bg-transparent focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Deposit split toggle */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Include Security Deposit</p>
              <p className="text-[10px] text-slate-400">One-time refundable lock-in split</p>
            </div>
            <button
              onClick={() => {
                setIncludeDeposit(!includeDeposit);
                haptic('light');
              }}
              className={`w-10 h-5 rounded-full transition p-0.5 flex items-center ${
                includeDeposit ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>

          {includeDeposit && (
            <div className="flex justify-between items-center px-1">
              <span className="text-slate-400">Total Security Deposit:</span>
              <span className="font-bold text-amber-300">₹{totalDeposit.toLocaleString()}</span>
            </div>
          )}

          {/* Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 via-slate-900 to-amber-500/20 border border-rose-500/40 space-y-2">
            <span className="text-[10px] uppercase font-black text-rose-400 tracking-wider">
              Your Estimated Share
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl font-black text-white">
                  ₹{perPersonMonthly.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Includes rent (₹{Math.round(totalRent / flatmatesCount).toLocaleString()}) + utilities (₹{Math.round(totalMonthlyBills / flatmatesCount).toLocaleString()})
                </p>
              </div>
            </div>

            {includeDeposit && (
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Your Refundable Deposit:</span>
                <span className="font-extrabold text-amber-300">₹{perPersonDeposit.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              haptic('success');
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-2xl text-xs shadow-lg transition active:scale-[0.98]"
          >
            Done Calculating
          </button>
        </div>
      </div>
    </div>
  );
};
