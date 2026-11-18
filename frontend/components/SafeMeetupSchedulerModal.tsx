import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MeetupScheduleData } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Home,
  ShieldCheck,
  Phone,
  User,
  X,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface SafeMeetupSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: string;
  partnerName: string;
}

export const SafeMeetupSchedulerModal: React.FC<SafeMeetupSchedulerModalProps> = ({
  isOpen,
  onClose,
  threadId,
  partnerName,
}) => {
  const { scheduleMeetupInThread, haptic, t } = useApp();

  const [meetupType, setMeetupType] = useState<'public_cafe' | 'flat_visit'>('public_cafe');
  const [venueName, setVenueName] = useState('Third Wave Coffee (12th Main Indiranagar)');
  const [venueAddress, setVenueAddress] = useState('100ft Road / 12th Main Junction, Indiranagar, Bengaluru');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('17:30');
  const [emergencyContactName, setEmergencyContactName] = useState('Pooja Mehta');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98765 43210');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Sister');
  const [notes, setNotes] = useState('Meeting in person to review flat keys and discuss maid & cook split.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueName.trim() || !emergencyContactName.trim()) {
      return;
    }

    const dateTimeCombined = `${date}T${time}:00`;
    const checkInDue = new Date(new Date(dateTimeCombined).getTime() + 90 * 60 * 1000).toISOString();

    const newMeetup: MeetupScheduleData = {
      id: `mt_${Date.now()}`,
      meetupType,
      venueName: venueName.trim(),
      venueAddress: venueAddress.trim(),
      dateTime: dateTimeCombined,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation: emergencyContactRelation.trim(),
      status: 'scheduled',
      checkInDueTime: checkInDue,
      notes: notes.trim(),
    };

    scheduleMeetupInThread(threadId, newMeetup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Safe Meetup Scheduler</h3>
              <p className="text-[11px] text-slate-400">Plan visit or cafe meetup with {partnerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 no-scrollbar text-xs">
          {/* Meetup Type: Public Cafe vs Flat Physical Inspection */}
          <div>
            <label className="text-slate-400 block mb-1.5 font-semibold uppercase tracking-wider text-[11px]">
              Meetup Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMeetupType('public_cafe');
                  setVenueName('Third Wave Coffee (12th Main Indiranagar)');
                  setVenueAddress('100ft Road / 12th Main, Indiranagar');
                  haptic('light');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                  meetupType === 'public_cafe'
                    ? 'border-rose-500 bg-rose-500/15 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400'
                }`}
              >
                <Coffee className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs text-white">Public Cafe</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Recommended for 1st talk</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMeetupType('flat_visit');
                  setVenueName('Flat Physical Visit / Walkthrough');
                  setVenueAddress('Palm Heights, 12th Main, Indiranagar');
                  haptic('light');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                  meetupType === 'flat_visit'
                    ? 'border-amber-500 bg-amber-500/15 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400'
                }`}
              >
                <Home className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs text-white">Flat Inspection</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Daylight visit with trusted person</p>
                </div>
              </button>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="space-y-2">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Venue / Cafe Name</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mr-2" />
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Blue Tokai Coffee Roasters / Flat address"
                  className="w-full bg-transparent focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Address / Landmark</label>
              <input
                type="text"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Street address or nearest landmark"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Meetup Date</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0 mr-2" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Time</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mr-2" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Trusted Emergency Contact Box */}
          <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Trusted Emergency Contact
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Check-in Link
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              We send your meetup itinerary to this contact and auto-alert them if you don't check in safely within 90 minutes.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Contact Name</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
                  <User className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                  <input
                    type="text"
                    required
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Pooja Mehta"
                    className="w-full bg-transparent focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Relationship</label>
                <input
                  type="text"
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                  placeholder="e.g. Sister / Friend"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Phone Number</label>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
                <Phone className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <input
                  type="tel"
                  required
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent focus:outline-none text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Agenda Note */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Meetup Agenda / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Check water pressure, balcony view, and discuss house rules"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Never visit unfamiliar flats alone late at night. Always keep GPS location sharing active.</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 font-bold rounded-2xl text-white shadow-xl shadow-rose-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Schedule & Share Check-in Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
