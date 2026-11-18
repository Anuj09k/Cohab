import React, { useState } from 'react';
import { useApp } from './AppContext';
import { UserProfile } from './types';
import { FileText, Download, Check, ShieldCheck, Sparkles, X, Printer, Share2 } from 'lucide-react';

interface HouseRuleAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherProfile?: UserProfile;
}

export const HouseRuleAgreementModal: React.FC<HouseRuleAgreementModalProps> = ({
  isOpen,
  onClose,
  otherProfile,
}) => {
  const { currentUser, haptic } = useApp();
  const partner = otherProfile || {
    name: 'Selected Flatmate',
    location: 'Bengaluru / Mumbai',
    budget: 24000,
  } as any;

  const [quietHours, setQuietHours] = useState('11:00 PM – 7:30 AM on weekdays');
  const [guestNotice, setGuestNotice] = useState('Minimum 12 hours advance notice via WhatsApp/chat');
  const [kitchenDishesRule, setKitchenDishesRule] = useState('Within 2 hours or before maid arrives next morning');
  const [fridgeSplit, setFridgeSplit] = useState('Top 2 shelves for Flatmate A, bottom 2 shelves for Flatmate B');
  const [billDueDay, setBillDueDay] = useState('5th of each month');
  const [depositNoticeMonths, setDepositNoticeMonths] = useState('1 month written notice');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const agreementText = `=====================================================
COHAB CO-LIVING HOUSE RULES AGREEMENT
Generated via Cohab Safe Discovery Engine
=====================================================
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
Flatmate A: ${currentUser.name} (${currentUser.location})
Flatmate B: ${partner.name} (${partner.location})

1. FINANCIAL & DEPOSIT TERMS:
- Estimated Rent Split: ₹${currentUser.budget.toLocaleString()} / ₹${partner.budget.toLocaleString()}
- Monthly Bill Due Date: ${billDueDay}
- Move-out Notice Period: ${depositNoticeMonths}
- Deposit Refund: Mutual sign-off on landlord deductions before final payout.

2. QUIET HOURS & WORKING FROM HOME:
- Designated Quiet Hours: ${quietHours}
- WFH Calls: Headphone policy in shared living spaces after 8:00 PM.

3. OVERNIGHT GUESTS & SOCIAL GATHERINGS:
- Guest Notice: ${guestNotice}
- Maximum consecutive guest stay: 3 nights without prior mutual consent.

4. KITCHEN HYGIENE & MAID PROTOCOL:
- Used Dishes: ${kitchenDishesRule}
- Fridge & Pantry Allocation: ${fridgeSplit}
- Common spices, oil, cleaning liquids: Split equally at start of month.

5. DISPUTE RESOLUTION:
- Direct and respectful conversation within 48 hours of any friction.
- Agreement can be updated mutually anytime.

Signed digitally in mutual faith:
[x] ${currentUser.name} (Verified via Cohab)
[x] ${partner.name} (Verified via Cohab)
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(agreementText);
    setIsCopied(true);
    haptic('success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Co-Living House Rules Agreement</h3>
              <p className="text-[11px] text-slate-400">Customized for {currentUser.name} & {partner.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form & Agreement Preview */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 no-scrollbar text-xs">
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Customize Your House Norms
            </h4>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Quiet Hours Window</label>
              <input
                type="text"
                value={quietHours}
                onChange={(e) => setQuietHours(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Overnight Guest Notice</label>
              <input
                type="text"
                value={guestNotice}
                onChange={(e) => setGuestNotice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Kitchen Sink Rule</label>
                <input
                  type="text"
                  value={kitchenDishesRule}
                  onChange={(e) => setKitchenDishesRule(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Monthly Bill Due Day</label>
                <input
                  type="text"
                  value={billDueDay}
                  onChange={(e) => setBillDueDay(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Fridge & Pantry Allocation</label>
              <input
                type="text"
                value={fridgeSplit}
                onChange={(e) => setFridgeSplit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Monospace Agreement Document Box */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap select-text max-h-56 overflow-y-auto no-scrollbar shadow-inner">
            {agreementText}
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>DPDP & Legal ready: Keep this as mutual clarity before paying deposits or drafting stamp paper.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 font-bold rounded-2xl text-white shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'Copied Agreement!' : 'Copy & Share Agreement'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
