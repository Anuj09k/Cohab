import React, { useState } from 'react';
import { useApp } from './AppContext';
import { MatchThread, MeetupScheduleData } from './types';
import { SafeMeetupSchedulerModal } from './components/SafeMeetupSchedulerModal';
import {
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Lock,
  Send,
  ChevronLeft,
  Info,
  AlertTriangle,
  Flag,
  FileCheck,
  Calendar,
  Coffee,
  Home,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

export const MatchesView: React.FC = () => {
  const {
    matches,
    plan,
    setSubscriptionModalOpen,
    sendChatMessage,
    currentUser,
    setChecklistModalOpen,
    setReportedProfileModalOpen,
    checkInMeetupSafely,
    haptic,
    t,
  } = useApp();

  const [activeThread, setActiveThread] = useState<MatchThread | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);

  const filteredMatches = matches.filter((m) =>
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!activeThread || !messageInput.trim()) return;
    const res = sendChatMessage(activeThread.id, messageInput.trim());
    if (res.success) {
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If chat thread is opened
  if (activeThread) {
    const thread = matches.find((m) => m.id === activeThread.id) || activeThread;

    return (
      <div className="flex flex-col h-full bg-slate-950">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                haptic('light');
                setActiveThread(null);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="relative">
              <img
                src={thread.user.avatar}
                alt={thread.user.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              {thread.user.verification.status === 'verified' && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{thread.user.name}</h3>
                <span className="text-xs text-rose-400 font-semibold">{thread.compatibilityScore}%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {thread.user.foodPreference === 'veg' && '🥗 Pure Veg'}
                {thread.user.foodPreference === 'eggetarian' && '🍳 Eggetarian'}
                {thread.user.foodPreference === 'non_veg' && '🍗 Non-Veg'}
                {thread.user.foodPreference === 'jain' && '🌿 Jain Diet'}
                {' • '}{thread.user.occupation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Safe Meetup Scheduler Button */}
            <button
              onClick={() => {
                haptic('light');
                setSchedulerModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:text-white flex items-center gap-1 text-xs font-bold"
              title="Schedule Safe Meetup"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('safeMeetup')}</span>
            </button>

            <button
              onClick={() => {
                haptic('light');
                setChecklistModalOpen(true);
              }}
              className="p-2 rounded-full bg-slate-800 text-amber-400 hover:bg-slate-700"
              title="Before You Sign Checklist"
            >
              <FileCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                haptic('light');
                setReportedProfileModalOpen(true);
              }}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400"
              title="Report or Block"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Anti-Leak Shield is active. Schedule meetups in public cafes or verified flats.</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {thread.messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Say hello! Break the ice by discussing dietary habits or scheduling a quick coffee meetup.
            </div>
          ) : (
            thread.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              // Render Live Safe Meetup Card
              if (msg.type === 'meetup_card' && msg.meetupData) {
                const mData = msg.meetupData;
                const isCheckedIn = mData.status === 'checked_in_safely';

                return (
                  <div key={msg.id} className="w-full flex justify-center my-2">
                    <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-rose-500/40 p-4 shadow-xl space-y-3">
                      {/* Top Meetup Banner */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          {mData.meetupType === 'public_cafe' ? (
                            <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                              <Coffee className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                              <Home className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                              Safe Meetup Card
                            </span>
                            <h4 className="text-xs font-bold text-white">
                              {mData.meetupType === 'public_cafe' ? t('publicCafe') : t('flatVisit')}
                            </h4>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isCheckedIn
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {isCheckedIn ? 'Checked In' : 'Active Scheduled'}
                        </span>
                      </div>

                      {/* Venue & Time Details */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-start gap-2 text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-white">{mData.venueName}</p>
                            <p className="text-[11px] text-slate-400">{mData.venueAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-300 pt-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-medium text-[11px]">
                            {new Date(mData.dateTime).toLocaleDateString([], {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at{' '}
                            {new Date(mData.dateTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {mData.notes && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                            "{mData.notes}"
                          </p>
                        )}
                      </div>

                      {/* Trusted Emergency Contact Info */}
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            {t('emergencyContact')}:
                          </span>
                          <span className="font-bold text-white">
                            {mData.emergencyContactName} ({mData.emergencyContactRelation})
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Auto Alert Timeout:</span>
                          <span className="text-amber-400 font-mono">
                            {new Date(mData.checkInDueTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Safe Check-In Button */}
                      {!isCheckedIn ? (
                        <button
                          onClick={() => {
                            checkInMeetupSafely(thread.id, mData.id);
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>{t('checkInSafe')}</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('checkInCompleted')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Standard Chat bubble
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-rose-500 text-white rounded-br-sm shadow'
                        : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message (contact numbers are blocked)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl transition active:scale-95 shadow-md shadow-rose-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Safe Meetup Scheduler Modal */}
        <SafeMeetupSchedulerModal
          isOpen={schedulerModalOpen}
          onClose={() => setSchedulerModalOpen(false)}
          threadId={thread.id}
          partnerName={thread.user.name}
        />
      </div>
    );
  }

  // Matches Listing View
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-900 bg-slate-950">
        <h2 className="text-xl font-black text-white">Your Flatmate Matches</h2>
        <p className="text-xs text-slate-400 mt-0.5">Compatible room seekers and flat listers</p>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matches by name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* "Likes You" Premium Teaser for Free Users */}
      {plan === 'free' ? (
        <div
          onClick={() => {
            haptic('medium');
            setSubscriptionModalOpen(true);
          }}
          className="m-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">4 People Liked Your Profile</p>
              <p className="text-[11px] text-slate-400">Upgrade to Plus or Pro to see who liked you</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl uppercase">
            Unlock
          </span>
        </div>
      ) : (
        <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Unlocked: You can see all mutual and incoming likes.
        </div>
      )}

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-900 no-scrollbar">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 px-6">
            <MessageCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-300">No matches yet</h4>
            <p className="text-xs text-slate-500 mt-1">
              Keep swiping on the Explore tab or activate a Boost to attract roommates!
            </p>
          </div>
        ) : (
          filteredMatches.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                haptic('light');
                setActiveThread(thread);
              }}
              className="p-4 flex items-center gap-3 hover:bg-slate-900/50 cursor-pointer transition"
            >
              <div className="relative">
                <img
                  src={thread.user.avatar}
                  alt={thread.user.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-slate-800"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {thread.compatibilityScore}%
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">{thread.user.name}</h4>
                  <span className="text-[10px] text-slate-500">{thread.matchedAt}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                    {thread.user.foodPreference === 'veg' && '🥗 Veg'}
                    {thread.user.foodPreference === 'eggetarian' && '🍳 Eggetarian'}
                    {thread.user.foodPreference === 'non_veg' && '🍗 Non-Veg'}
                    {thread.user.foodPreference === 'jain' && '🌿 Jain'}
                  </span>
                  <p className="text-xs text-slate-400 truncate">
                    {thread.lastMessage || `${thread.user.location} • ₹${thread.user.budget}/mo`}
                  </p>
                </div>
              </div>

              {thread.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
