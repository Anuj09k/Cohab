import { RentSplitModal } from './components/RentSplitModal';
import { CommuteModal } from './components/CommuteModal';
import { HouseRuleAgreementModal } from './components/HouseRuleAgreementModal';
import { PdfSpecModal } from './components/PdfSpecModal';
import { FoodPreference } from './types';
import {
  ShieldCheck,
  Crown,
  FileCheck,
  ChevronRight,
  Calculator,
  Navigation,
  FileText,
  Languages,
  Calendar,
  Utensils,
  FileDown,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    plan,
    setSubscriptionModalOpen,
    setVerificationModalOpen,
    setChecklistModalOpen,
    haptic,
    language,
    setLanguage,
    t,
  } = useApp();

  const [rentCalculatorOpen, setRentCalculatorOpen] = useState(false);
  const [commuteModalOpen, setCommuteModalOpen] = useState(false);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const toggleHideBadge = () => {
    haptic('light');
    updateCurrentUser({ hideMembershipBadge: !currentUser.hideMembershipBadge });
  };

  const toggleRole = () => {
    haptic('medium');
    const newRole = currentUser.role === 'seeker' ? 'lister' : 'seeker';
    updateCurrentUser({ role: newRole });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto no-scrollbar">
      {/* Profile Header */}
      <div className="p-5 border-b border-slate-900 bg-slate-950">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-18 h-18 rounded-3xl object-cover border-2 border-slate-800 shadow-xl"
            />
            {currentUser.verification.status === 'verified' && (
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full text-slate-950 ${
                  currentUser.verification.badgeLevel === 'gold' && !currentUser.hideMembershipBadge
                    ? 'bg-amber-400'
                    : 'bg-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{currentUser.name}</h2>
              <span className="text-slate-400 text-sm font-semibold">{currentUser.age}</span>
            </div>
            <p className="text-xs text-slate-400">{currentUser.occupation}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider border border-rose-500/30">
                {currentUser.role === 'seeker' ? t('lookingForPlace') : t('flatLister')}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  plan === 'pro'
                    ? 'bg-amber-400 text-slate-950'
                    : plan === 'plus'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {plan.toUpperCase()} Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Membership Upgrade Banner */}
        {plan !== 'pro' ? (
          <div
            onClick={() => {
              haptic('medium');
              setSubscriptionModalOpen(true);
            }}
            className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-xl shadow-rose-500/20 cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-950/80">
                Upgrade to Cohab Pro
              </p>
              <h4 className="text-base font-black text-slate-950 mt-0.5">
                Unlimited Swipes & Gold Verified
              </h4>
              <p className="text-xs text-slate-900/90 font-medium mt-0.5">
                Save with 6-month & yearly transferable plans.
              </p>
            </div>
            <Crown className="w-8 h-8 text-slate-950 shrink-0" />
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-slate-900 border border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Cohab Pro Active</p>
                <p className="text-[11px] text-slate-400">Unlimited discovery, 3 weekly boosts active</p>
              </div>
            </div>
            <button
              onClick={() => setSubscriptionModalOpen(true)}
              className="text-xs text-amber-400 font-semibold underline"
            >
              Manage
            </button>
          </div>
        )}

        {/* Verification Status Card */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">ID & Biometric Verification</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {currentUser.verification.status === 'verified' ? 'Verified' : 'Action Required'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Designed for India's DPDP Act: ID hashes verified, raw documents permanently deleted. 15-day verification rule enforces a bot-free ecosystem.
          </p>

          <button
            onClick={() => {
              haptic('light');
              setVerificationModalOpen(true);
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700/80 text-white rounded-xl text-xs font-semibold transition"
          >
            {currentUser.verification.status === 'verified'
              ? 'View Verification Certificate'
              : 'Complete Verification Now'}
          </button>
        </div>

        {/* Food & Kitchen Habit Configuration Card */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Diet & Kitchen Utensils Preferences
            </h3>
          </div>

          {/* Diet Selection */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-white">My Food Habit</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'veg', label: '🥗 Pure Vegetarian' },
                { id: 'eggetarian', label: '🍳 Eggetarian' },
                { id: 'non_veg', label: '🍗 Non-Vegetarian' },
                { id: 'jain', label: '🌿 Jain Diet' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    haptic('light');
                    updateCurrentUser({ foodPreference: d.id as FoodPreference });
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold border transition text-left ${
                    currentUser.foodPreference === d.id
                      ? 'border-amber-400 bg-amber-500/20 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shared Utensils Non-Veg Cooking Rule */}
          <div className="flex items-center justify-between py-2 border-t border-slate-800/80 pt-3">
            <div>
              <p className="text-xs font-semibold text-white">Non-Veg in Shared Utensils</p>
              <p className="text-[11px] text-slate-400">
                {currentUser.nonVegCookingAllowedInSharedUtensils
                  ? 'Permitted: Roommates may cook non-veg in shared pans'
                  : 'Separate cookware required: No non-veg in common utensils'}
              </p>
            </div>
            <button
              onClick={() => {
                haptic('light');
                updateCurrentUser({
                  nonVegCookingAllowedInSharedUtensils: !currentUser.nonVegCookingAllowedInSharedUtensils,
                });
              }}
              className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                currentUser.nonVegCookingAllowedInSharedUtensils ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>

          {/* Kitchen Diet Note */}
          <div className="border-t border-slate-800/80 pt-2">
            <label className="text-[11px] text-slate-400 block mb-1">Kitchen & Dietary Note</label>
            <input
              type="text"
              value={currentUser.kitchenDietNote || ''}
              onChange={(e) => updateCurrentUser({ kitchenDietNote: e.target.value })}
              placeholder="e.g. Okay with eggs and food delivery; separate cookware for non-veg"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Privacy & Member Preferences */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Account & Visibility Settings
          </h3>

          {/* Language Switcher */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-rose-400" />
              <div>
                <p className="text-xs font-semibold text-white">App Language / भाषा</p>
                <p className="text-[11px] text-slate-400">Switch between English & Hindi</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setLanguage('en');
                  haptic('light');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  language === 'en' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('hi');
                  haptic('light');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  language === 'hi' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Move-in Target Date */}
          <div className="flex items-center justify-between py-1 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-white">Target Move-in Date</p>
                <p className="text-[11px] text-slate-400">Used for ±7 days matching</p>
              </div>
            </div>
            <input
              type="date"
              value={currentUser.moveInDate}
              onChange={(e) => {
                const val = e.target.value;
                const timestamp = new Date(val).getTime();
                updateCurrentUser({ moveInDate: val, moveInDateTimestamp: timestamp });
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Hide membership status */}
          <div className="flex items-center justify-between py-1 border-t border-slate-800/80 pt-3">
            <div>
              <p className="text-xs font-semibold text-white">Hide Membership Badge</p>
              <p className="text-[11px] text-slate-400">Keep your Plus/Pro status private from other users</p>
            </div>
            <button
              onClick={toggleHideBadge}
              className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                currentUser.hideMembershipBadge ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>

          {/* Switch Role: Seeker vs Lister */}
          <div className="flex items-center justify-between py-1 border-t border-slate-800/80 pt-3">
            <div>
              <p className="text-xs font-semibold text-white">Current Mode: {currentUser.role === 'seeker' ? 'Seeker' : 'Lister'}</p>
              <p className="text-[11px] text-slate-400">
                {currentUser.role === 'seeker'
                  ? 'Switch to Lister if you have rented a flat and need flatmates'
                  : 'Switch to Seeker if you are looking for a room'}
              </p>
            </div>
            <button
              onClick={toggleRole}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold rounded-xl"
            >
              {t('switchMode')}
            </button>
          </div>

          {/* Gender & Identity Settings */}
          <div className="border-t border-slate-800/80 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">My Gender</p>
                <p className="text-[11px] text-slate-400">Displayed on your profile</p>
              </div>
              <div className="flex gap-1.5">
                {[
                  { id: 'male', label: 'Male' },
                  { id: 'female', label: 'Female' },
                  { id: 'others', label: 'Others' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      haptic('light');
                      updateCurrentUser({
                        gender: g.id as any,
                        othersSubtype: g.id === 'others' ? (currentUser.othersSubtype || 'queer') : undefined,
                      });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      currentUser.gender === g.id
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown if 'others' is selected */}
            {currentUser.gender === 'others' && (
              <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60 mt-1">
                <span className="text-[11px] text-slate-300 font-medium">Specify Category:</span>
                <select
                  value={currentUser.othersSubtype || 'queer'}
                  onChange={(e) => {
                    haptic('light');
                    updateCurrentUser({ othersSubtype: e.target.value as any });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-semibold focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="gay">Gay</option>
                  <option value="lesbian">Lesbian</option>
                  <option value="trans">Trans</option>
                  <option value="queer">Queer</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Due Diligence Checklist Trigger */}
        <div
          onClick={() => {
            haptic('light');
            setChecklistModalOpen(true);
          }}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('beforeYouSign')}</p>
              <p className="text-[11px] text-slate-400">Review deposit, guest, and maid agreements</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* Co-living House Rules Agreement Generator */}
        <div
          onClick={() => {
            haptic('light');
            setAgreementModalOpen(true);
          }}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('coLivingRules')}</p>
              <p className="text-[11px] text-slate-400">Generate printable house rules agreement</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* Tech Hub Commute Calculator Trigger */}
        <div
          onClick={() => {
            haptic('light');
            setCommuteModalOpen(true);
          }}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-sky-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('hubCommuteCalculator')}</p>
              <p className="text-[11px] text-slate-400">Metro vs. cab travel times to tech hubs</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* Rent & Bills Calculator Trigger */}
        <div
          onClick={() => {
            haptic('light');
            setRentCalculatorOpen(true);
          }}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs font-bold text-white">{t('fairRentSplitter')}</p>
              <p className="text-[11px] text-slate-400">Plan monthly maid, cook, and WiFi shares</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* Product Spec & Architecture PDF Dossier Trigger */}
        <div
          onClick={() => {
            haptic('light');
            setPdfModalOpen(true);
          }}
          className="p-4 rounded-3xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/30 flex items-center justify-between cursor-pointer hover:border-rose-500/60 transition"
        >
          <div className="flex items-center gap-3">
            <FileDown className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-xs font-bold text-white">Product Spec & Roadmap PDF</p>
              <p className="text-[11px] text-slate-400">Export built features, backend pipeline & future integrations</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* DPDP Act Compliance & Legal footer */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-900 text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-400">{t('dpdpNoticeTitle')}</p>
          <p className="text-[11px] leading-relaxed">{t('dpdpNoticeDesc')}</p>
        </div>
      </div>

      {/* Rent Splitter Modal */}
      <RentSplitModal
        isOpen={rentCalculatorOpen}
        onClose={() => setRentCalculatorOpen(false)}
        targetRent={currentUser.budget * 2}
        targetDeposit={currentUser.budget * 4}
      />

      {/* Commute Modal */}
      <CommuteModal
        isOpen={commuteModalOpen}
        onClose={() => setCommuteModalOpen(false)}
        locationName={currentUser.location}
        estimates={currentUser.commuteEstimates}
      />

      {/* Agreement Generator Modal */}
      <HouseRuleAgreementModal
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
      />

      {/* Complete Architecture & Feature Spec PDF Modal */}
      <PdfSpecModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
};
