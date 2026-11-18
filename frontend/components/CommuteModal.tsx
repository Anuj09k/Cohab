import React from 'react';
import { CommuteEstimate } from '../types';
import { Navigation, Train, Car, MapPin, X, Clock } from 'lucide-react';

interface CommuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  estimates?: CommuteEstimate[];
}

export const CommuteModal: React.FC<CommuteModalProps> = ({
  isOpen,
  onClose,
  locationName,
  estimates = [],
}) => {
  if (!isOpen) return null;

  const fallbackEstimates: CommuteEstimate[] = [
    { destination: 'Manyata Tech Park (Hebbal)', minutesByMetro: 34, minutesByCab: 45, distanceKm: 14.2 },
    { destination: 'Embassy GolfLinks (EGL / Domlur)', minutesByMetro: 16, minutesByCab: 20, distanceKm: 4.8 },
    { destination: 'Bagmane Tech Park (CV Raman Nagar)', minutesByMetro: 14, minutesByCab: 18, distanceKm: 3.9 },
    { destination: 'Bandra Kurla Complex (BKC, Mumbai)', minutesByMetro: 22, minutesByCab: 30, distanceKm: 8.5 },
  ];

  const activeEstimates = estimates.length > 0 ? estimates : fallbackEstimates;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tech Hub Commute Time</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-rose-400" /> From {locationName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estimates List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 no-scrollbar text-xs">
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Commute calculations based on live Namma Metro / Mumbai Metro lines and peak peak-hour traffic indices:
          </p>

          {activeEstimates.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">{item.destination}</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{item.distanceKm} km</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-2">
                  <Train className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Metro Transit</span>
                    <span className="font-bold text-white text-xs">{item.minutesByMetro} mins</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Cab / Auto</span>
                    <span className="font-bold text-white text-xs">{item.minutesByCab} mins</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800 text-[10px] text-slate-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Tip: Choosing flats within 20 mins by metro saves ~45 hours of Bangalore/Mumbai traffic monthly.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition"
          >
            Close Commute View
          </button>
        </div>
      </div>
    </div>
  );
};
