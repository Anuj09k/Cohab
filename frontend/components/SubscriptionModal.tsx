import React, { useState } from 'react';
import { useApp } from './AppContext';
import { PlanType } from './types';
import { Check, Crown, Zap, Shield, Sparkles, X, ArrowRight, Heart } from 'lucide-react';

export const SubscriptionModal: React.FC = () => {
  const {
    subscriptionModalOpen,
    setSubscriptionModalOpen,
    plan,
    changePlan,
    remoteConfig,
    haptic,
    currentUser,
    transferProMembership,
  } = useApp();

  type BillingCycle = 'weekly' | 'first_month' | 'monthly' | '3_months' | '6_months' | 'yearly';
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('6_months');
  const [targetTier, setTargetTier] = useState<'plus' | 'pro'>('pro');
  const [transferMode, setTransferMode] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferStatus, setTransferStatus] = useState<string | null>(null);

  if (!subscriptionModalOpen) return null;

  const prices = remoteConfig.prices;
  const gst = remoteConfig.gstRate;

  // Base price lookup
  const getBasePrice = (tier: 'plus' | 'pro', cycle: BillingCycle): number => {
    if (tier === 'plus') {
      switch (cycle) {
        case 'weekly':
          return prices.weeklyPlus;
        case 'first_month':
          return prices.firstTimeMonthlyPlus;
        case 'monthly':
          return prices.monthlyPlus;
        case '3_months':
          return prices.threeMonthsPlus;
        case '6_months':
          return prices.sixMonthsPlus;
        case 'yearly':
          return prices.yearlyPlus;
      }
    } else {
      switch (cycle) {
        case 'weekly':
          return 999999; // Pro not offered weekly
        case 'first_month':
          return prices.firstTimeMonthlyPro;
        case 'monthly':
          return prices.monthlyPro;
        case '3_months':
          return prices.threeMonthsPro;
        case '6_months':
          return prices.sixMonthsPro;
        case 'yearly':
          return prices.yearlyPro;
      }
    }
  };

  const basePrice = getBasePrice(targetTier, selectedCycle);
  const gstAmount = Math.round(basePrice * gst);
  const totalPrice = basePrice + gstAmount;

  const handleCheckout = () => {
    haptic('success');
    changePlan(targetTier);
    setSubscriptionModalOpen(false);
  };

  const handleTransfer = () => {
    if (!transferEmail.includes('@')) {
      setTransferStatus('Please enter a valid flatmate email.');
      return;
    }
    const res = transferProMembership(transferEmail);
    setTransferStatus(res.message);
    if (res.success) {
      setTimeout(() => {
        setSubscriptionModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setSubscriptionModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tier Tabs */}
        <div className="text-center pt-1 mb-4">
          <div className="inline-flex items-center justify-center p-1 bg-slate-800 rounded-2xl mb-3">
            <button
              onClick={() => {
                setTargetTier('plus');
                haptic('light');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                targetTier === 'plus'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cohab Plus
            </button>
            <button
              onClick={() => {
                setTargetTier('pro');
                haptic('light');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                targetTier === 'pro'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Cohab Pro
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {targetTier === 'pro' ? 'Unlock Complete Roommate Advantage' : 'Supercharge Your Discovery'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {targetTier === 'pro'
              ? 'Unlimited swipes, see who liked you, 3 weekly boosts & 10 superlikes'
              : '25 weekly swipes, unlocked filters, 2 boosts & 5 superlikes'}
          </p>
        </div>

        {/* Scrollable Cycles and breakdown */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
          {/* Cycle Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Weekly (Plus only) */}
            {targetTier === 'plus' && (
              <div
                onClick={() => {
                  setSelectedCycle('weekly');
                  haptic('light');
                }}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition relative ${
                  selectedCycle === 'weekly'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <p className="text-xs text-slate-400 font-medium">1 Week</p>
                <p className="text-lg font-bold text-white mt-0.5">₹{prices.weeklyPlus}</p>
                <span className="text-[10px] text-slate-500">Trial</span>
              </div>
            )}

            {/* First-Time Monthly */}
            <div
              onClick={() => {
                setSelectedCycle('first_month');
                haptic('light');
              }}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition relative ${
                selectedCycle === 'first_month'
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full uppercase">
                New User
              </span>
              <p className="text-xs text-slate-400 font-medium mt-1">1st Month</p>
              <p className="text-lg font-bold text-white mt-0.5">
                ₹{targetTier === 'plus' ? prices.firstTimeMonthlyPlus : prices.firstTimeMonthlyPro}
              </p>
              <span className="text-[10px] line-through text-slate-500">
                ₹{targetTier === 'plus' ? prices.monthlyPlus : prices.monthlyPro}
              </span>
            </div>

            {/* 3 Months */}
            <div
              onClick={() => {
                setSelectedCycle('3_months');
                haptic('light');
              }}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition relative ${
                selectedCycle === '3_months'
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <p className="text-xs text-slate-400 font-medium">3 Months</p>
              <p className="text-lg font-bold text-white mt-0.5">
                ₹{targetTier === 'plus' ? prices.threeMonthsPlus : prices.threeMonthsPro}
              </p>
              <span className="text-[10px] text-slate-500">₹{Math.round((targetTier === 'plus' ? prices.threeMonthsPlus : prices.threeMonthsPro)/3)}/mo</span>
            </div>

            {/* 6 Months - Best Value Highlight */}
            <div
              onClick={() => {
                setSelectedCycle('6_months');
                haptic('light');
              }}
              className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition relative col-span-1 sm:col-span-1 ${
                selectedCycle === '6_months'
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-amber-500/40 bg-slate-800/50'
              }`}
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <p className="text-xs text-amber-300 font-semibold mt-1">6 Months</p>
              <p className="text-lg font-extrabold text-white mt-0.5">
                ₹{targetTier === 'plus' ? prices.sixMonthsPlus : prices.sixMonthsPro}
              </p>
              <span className="text-[10px] text-amber-200/70">Transferable • Best Deal</span>
            </div>

            {/* Yearly */}
            <div
              onClick={() => {
                setSelectedCycle('yearly');
                haptic('light');
              }}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition relative ${
                selectedCycle === 'yearly'
                  ? 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <p className="text-xs text-slate-400 font-medium">1 Year</p>
              <p className="text-lg font-bold text-white mt-0.5">
                ₹{targetTier === 'plus' ? prices.yearlyPlus : prices.yearlyPro}
              </p>
              <span className="text-[10px] text-emerald-400">Save 60%</span>
            </div>
          </div>

          {/* Feature Matrix Comparison */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Weekly Likes Quota</span>
              <span className="font-bold text-white">{targetTier === 'pro' ? 'Unlimited' : '25 Swipes / wk'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">See Who Liked You</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Included
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Weekly Boosts (24h visibility)</span>
              <span className="font-bold text-amber-400">{targetTier === 'pro' ? '3 Boosts' : '2 Boosts'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Weekly Superlikes / Superchats</span>
              <span className="font-bold text-rose-400">{targetTier === 'pro' ? '10 Direct Notes' : '5 Direct Notes'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Gold Verified Badge</span>
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Auto-unlocked
              </span>
            </div>
            {targetTier === 'pro' && (
              <div className="flex items-center justify-between border-t border-slate-700/60 pt-2 text-slate-400 text-[11px]">
                <span>Membership Transfer (6mo / 1yr)</span>
                <span className="text-emerald-400 font-medium">1 Transfer Allowed</span>
              </div>
            )}
          </div>

          {/* Transfer policy tab for pro holders */}
          {currentUser.membershipPlan === 'pro' && (
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setTransferMode(!transferMode)}
                className="text-xs text-amber-400 font-semibold hover:underline flex items-center justify-between w-full"
              >
                <span>Transfer your Pro Membership to a flatmate?</span>
                <span>{transferMode ? '▲' : '▼'}</span>
              </button>
              {transferMode && (
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Pro plans (6-months and 1-year) can be transferred exactly once.
                  </p>
                  <input
                    type="email"
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    placeholder="Recipient's registered email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  {transferStatus && (
                    <p className="text-xs font-medium text-amber-300">{transferStatus}</p>
                  )}
                  <button
                    onClick={handleTransfer}
                    className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Confirm Transfer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transparent GST Invoice Breakdown */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Base Subscription Price</span>
              <span className="text-white font-medium">₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Government GST (18%)</span>
              <span className="text-slate-300 font-medium">+ ₹{gstAmount}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm pt-1.5 border-t border-slate-800">
              <span>Total Payable</span>
              <span className="text-emerald-400 font-extrabold">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Apple In-App Purchase & Google Play Billing CTA */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={handleCheckout}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-extrabold rounded-2xl text-white shadow-xl shadow-rose-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Proceed with {targetTier === 'pro' ? 'Pro' : 'Plus'} (₹{totalPrice})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-2">
            Billed securely via Apple In-App Purchase / Google Play. Cancel anytime from store subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
};
