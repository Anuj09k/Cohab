import React, { useState } from 'react';
import { useApp } from './AppContext';
import { generateCohabSpecPdf } from '../services/pdfGenerator';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  FileCheck,
  Share2,
} from 'lucide-react';

interface PdfSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfSpecModal: React.FC<PdfSpecModalProps> = ({ isOpen, onClose }) => {
  const { haptic } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'built' | 'integrations' | 'suggested'>('all');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectPdfDownload = () => {
    haptic('heavy');
    setDownloading(true);
    try {
      generateCohabSpecPdf();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    haptic('medium');
    window.print();
  };

  const sections = [
    {
      id: 'core_product',
      category: 'built',
      title: '1. Core Discovery & Matching Engine',
      status: 'Live & Operational',
      statusColor: 'emerald',
      items: [
        {
          name: 'Seekers vs. Listers Taxonomy',
          desc: 'Distinct profiles: Seekers use their original profile photo with a "Looking for a place" badge (no flat photos needed). Listers must provide 2 interior photos and 1 exterior photo with deposit, total rent, and furnishing badges.',
        },
        {
          name: '100-Point Algorithmic Compatibility Score',
          desc: 'The default ranking algorithm across 8 vectors: Sleep rhythm (15 pts), Smoker alignment (15 pts), Drinker alignment (10 pts), Fitness/Yoga (10 pts), Maid & Cleaning frequency (15 pts), Food & cookware rules (20 pts), Budget compatibility (10 pts), and Move-in timeline proximity (5 pts). Interactive modal shows exact point-by-point breakdown on tap.',
        },
        {
          name: 'Full Inclusive Gender Taxonomy & Dropdown',
          desc: 'Primary selector options: Male, Female, and Others. When "Others" is selected, a dedicated sub-menu reveals specific identities: Gay, Lesbian, Transgender, and Queer. Configurable on profiles and as granular discovery filters.',
        },
        {
          name: 'Dietary & Kitchen Cookware Preferences',
          desc: 'Classifications: Pure Veg, Eggetarian, Non-Veg, and Jain Diet. Includes dedicated shared utensils policy toggle: "Separate Veg Utensils Only" vs. "Non-Veg Allowed in Shared Pans", plus custom kitchen notes.',
        },
        {
          name: 'Physics-Based Swipe Deck & Quota Guard',
          desc: 'Right swipe (Like), Left swipe (Pass), Superlike (with note), Superchat, and Boost. Free accounts capped at 5 likes/wk with left-swipe lockout when exhausted. Plus: 25 likes/wk; Pro: Unlimited likes.',
        },
        {
          name: 'Move-in Date Proximity Filter',
          desc: 'Matches flatmates within ±7 or ±14 days of target move-in dates with green indicator pill on discovery cards.',
        },
        {
          name: '15-Second Ambient Video Walkthrough Snippet',
          desc: 'In-app video player for lister flats with daylight inspection, kitchen hygiene checks, and audio mute controls.',
        },
      ],
    },
    {
      id: 'safety_dpdp',
      category: 'built',
      title: '2. Safety, Anti-Leak & India DPDP Act (2023) Compliance',
      status: 'Live & Operational',
      statusColor: 'emerald',
      items: [
        {
          name: 'Contact & Social Handle Leak Shield',
          desc: 'Real-time heuristic & regex parser detecting direct 10-digit phone numbers, social handles (@insta, snap, telegram, wa.me), and word-spelled digits ("nine 8 two 4..."). Includes 3-strike policy leading to temporary account suspensions.',
        },
        {
          name: 'In-Chat Safe Meetup Scheduler with Live Safety Card',
          desc: 'Allows matched flatmates to schedule Public Cafe or Flat Visits with venue, date, time, and a Trusted Emergency Contact field. Generates an interactive live card in the chat with a 90-minute safety check-in countdown and 1-tap "Check In as Safe" confirmation.',
        },
        {
          name: 'India DPDP Act (2023) Architecture',
          desc: 'Raw government ID photos are permanently purged from memory immediately post cryptographic SHA-256 hash validation. Biometric 3-angle facial scan templates are mathematically hashed with zero raw face retention. Dedicated Right-to-Erasure 1-tap complete data purge in the Safety Center.',
        },
        {
          name: '15-Day Verification Rule & Lockout',
          desc: 'Countdown banner requiring ID + liveness scan within 15 days or account triggers 75-day lockout. Badging: Clean White shield for Free users; Glowing Gold shield for Plus and Pro members.',
        },
        {
          name: 'In-App Reporting & Instant Blocking',
          desc: 'Accessible on all profile cards and active chat streams with 5 pre-configured report categories and 2-hour moderation escalation triggers.',
        },
      ],
    },
    {
      id: 'financial_tools',
      category: 'built',
      title: '3. Financial, Due-Diligence & Co-Living Utilities',
      status: 'Live & Operational',
      statusColor: 'emerald',
      items: [
        {
          name: 'Fair Rent & Utility Bill Splitter',
          desc: 'Interactive simulator calculating per-person monthly obligations combining base room rent, maid/housekeeping, cook, high-speed WiFi, electricity, and one-time refundable security deposit.',
        },
        {
          name: 'Tech Park & Metro Commute Calculator',
          desc: 'Live estimates of Metro transit vs. Cab/Auto peak-hour travel times and distance to key hubs (Manyata, EGL, Bagmane, BKC Mumbai, ITPL, EcoSpace).',
        },
        {
          name: 'Co-Living House Rules Agreement Generator',
          desc: 'Generates a customizable, digitally signed co-living agreement detailing quiet hours, overnight guest notices, kitchen sink protocols, and deposit notice periods with 1-tap copy/share.',
        },
        {
          name: '"Before You Sign Anything" Due-Diligence Checklist',
          desc: '5-point interactive safety checklist covering lock-in periods, meter readings, power backup capability, and registered rental agreements.',
        },
        {
          name: 'Remote Config Pricing & Subscriptions Engine',
          desc: 'Tier pricing (Weekly Plus ₹99, 1-mo first-time discount, 3-mo, 6-mo, and Yearly) with separate 18% GST line-item checkout, Pro transferability for 6mo/yearly plans, and boost stacking math (1 boost = 24h, 2 boosts = 60h total).',
        },
        {
          name: 'Bilingual Localization (English ⇄ Hindi)',
          desc: 'Instant 1-tap toggle in the top bar translating all navigation tabs, filter drawers, due-diligence checklists, and DPDP notices.',
        },
      ],
    },
    {
      id: 'integrations_pipeline',
      category: 'integrations',
      title: '4. Third-Party Backend & API Integrations Pipeline',
      status: 'Production Architecture',
      statusColor: 'amber',
      items: [
        {
          name: 'Aadhaar XML & DigiLocker Provider (HyperVerge / Digio / IDfy)',
          desc: 'Replaces simulated client-side verification with DigiLocker OTP/offline XML parsing. Verifies government identity without storing raw Aadhaar card images, fully satisfying India DPDP Act Section 8(7).',
        },
        {
          name: 'Apple StoreKit 2 & Google Play Billing (via RevenueCat)',
          desc: 'Integration with native App Store and Google Play subscription engines with server-side receipt validation, auto-renewals, promotional intro pricing (₹149 first-month), and GST invoice generation.',
        },
        {
          name: 'Google Maps Distance Matrix & Namma Metro GTFS Transit API',
          desc: 'Dynamically computes live peak-hour metro transit and cab traffic estimates from flat coordinates to Bangalore/Mumbai tech corridors.',
        },
        {
          name: 'Twilio / Exotel SMS & WhatsApp Cloud API',
          desc: 'Dispatches automated WhatsApp/SMS notifications with location coordinates to the Trusted Emergency Contact when an in-chat Safe Meetup is scheduled or when the 90-minute check-in deadline expires.',
        },
        {
          name: 'AWS S3 / Google Cloud Storage with Signed Presigned URLs',
          desc: 'Encrypted storage for 2 interior + 1 exterior flat photos and 15s ambient walkthrough videos with client-side image compression prior to upload.',
        },
      ],
    },
    {
      id: 'suggested_features',
      category: 'suggested',
      title: '5. Suggested High-Impact Features for Future Releases',
      status: 'Product Roadmap',
      statusColor: 'sky',
      items: [
        {
          name: 'AI Landlord Lease Clause Analyzer',
          desc: 'Upload a rental agreement PDF or photo; Gemini AI parses unfair clauses (excessive deposit deductions, sudden rent escalation clauses, unannounced landlord entry rights) and flags risks.',
        },
        {
          name: 'Sublet & Temporary Flat Sharing Mode (1–3 Months)',
          desc: 'Dedicated tag and discovery bucket for tech interns and consultants seeking short-term furnished rooms without a 11-month lock-in commitment.',
        },
        {
          name: 'Chore Wheel & Monthly Expense Ledger (Splitwise Sync)',
          desc: 'In-app recurring chore rotator (cleaning, trash, buying groceries) and integrated UPI split expense ledger once two users mark each other as "Living Together".',
        },
        {
          name: 'Virtual 3D Room Spatial View (WebGL / Three.js)',
          desc: 'Interactive 3D camera pan allowing prospective flatmates to inspect room dimensions, window orientation, and wardrobe storage space before scheduling an in-person visit.',
        },
        {
          name: 'Verified Landlord Ownership Verification (RERA / Property Tax ID)',
          desc: 'Direct cross-check against municipal property tax receipts (BBMP / BMC) to eliminate sub-leasing fraud and ensure deposits are paid to the rightful title deed owner.',
        },
      ],
    },
  ];

  const filteredSections = sections.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      {/* Modal Dialog Container */}
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl text-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Printable Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-500/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Cohab Product Specification & Architecture Dossier</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  v2.4 • PDF Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Complete audit of built features, third-party backend integrations, and future roadmap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Instant PDF File Download Button */}
            <button
              onClick={handleDirectPdfDownload}
              disabled={downloading}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 text-xs font-black text-slate-950 flex items-center gap-1.5 transition shadow-lg shadow-rose-500/20 active:scale-95"
              title="Download .PDF File Directly to Your Device"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded!' : downloading ? 'Generating...' : 'Download .PDF File'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white hidden sm:flex items-center gap-1.5 transition border border-slate-700"
              title="Print to PDF or Paper"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Sections' },
              { id: 'built', label: '1. Built Features' },
              { id: 'integrations', label: '2. Backend Integrations' },
              { id: 'suggested', label: '3. Suggested Roadmap' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  haptic('light');
                  setActiveCategory(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  activeCategory === tab.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-emerald-400 font-semibold hidden md:inline flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct PDF Generator Ready
          </span>
        </div>

        {/* Printable Document Body */}
        <div
          id="cohab-pdf-document"
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 no-scrollbar bg-slate-950 text-slate-200 font-sans"
        >
          {/* Direct Download Callout Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-emerald-500/15 border border-rose-500/30 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-white">
                Looking for the actual <strong>.pdf file</strong> on your system? Click <strong>"Download .PDF File"</strong> to instantly save <code className="text-amber-300 font-mono text-[11px]">Cohab-Product-Specification-Dossier.pdf</code>.
              </p>
            </div>
            <button
              onClick={handleDirectPdfDownload}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get PDF Now</span>
            </button>
          </div>

          {/* Executive Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Executive Platform Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Cohab (कोहैब)</strong> is a high-trust, cross-platform flatmate and room discovery ecosystem.
              Engineered specifically for Indian urban metro hubs (Bengaluru, Mumbai, NCR), it solves roommate friction
              via a 100-point compatibility algorithm, food and kitchen utensil segregation rules, live emergency check-in
              cards, zero-knowledge biometric verification complying with India’s <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>,
              and itemized GST rental subscription infrastructure.
            </p>
          </div>

          {/* Section Renderers */}
          {filteredSections.map((sec) => (
            <div
              key={sec.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{sec.title}</span>
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                    sec.statusColor === 'emerald'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : sec.statusColor === 'amber'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {sec.status}
                </span>
              </div>

              <div className="space-y-3">
                {sec.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          sec.statusColor === 'emerald'
                            ? 'text-emerald-400'
                            : sec.statusColor === 'amber'
                            ? 'text-amber-400'
                            : 'text-sky-400'
                        }`}
                      />
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Verification & Legal Disclaimer Block */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">Statutory & Compliance Notice</p>
            <p className="leading-relaxed">
              All architectural specifications and safety policies within this dossier align with the provisions of the
              Digital Personal Data Protection Act (DPDP), 2023 of India. No raw Aadhaar or passport images are persisted on Cohab servers.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Generate & download the raw <strong>.PDF file</strong> with full typography and headers directly to your Downloads folder.</span>
          </p>
          <button
            onClick={handleDirectPdfDownload}
            disabled={downloading}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95 transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{downloadSuccess ? 'Downloaded!' : downloading ? 'Generating...' : 'Download .PDF File'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};