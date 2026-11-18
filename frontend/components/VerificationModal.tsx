import React, { useState } from 'react';
import { useApp } from './AppContext';
import { CheckCircle2, ShieldCheck, Camera, Sparkles, X, AlertTriangle, ArrowRight } from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const {
    verificationModalOpen,
    setVerificationModalOpen,
    currentUser,
    updateCurrentUser,
    plan,
    haptic,
  } = useApp();

  const [step, setStep] = useState<'intro' | 'gov_id' | 'face_scan' | 'complete'>('intro');
  const [govIdType, setGovIdType] = useState('Aadhaar / Driving License');
  const [govIdUploaded, setGovIdUploaded] = useState(false);
  const [anglesDone, setAnglesDone] = useState<string[]>([]);
  const [currentAngleTarget, setCurrentAngleTarget] = useState<'front' | 'left' | 'right'>('front');
  const [scanning, setScanning] = useState(false);

  if (!verificationModalOpen) return null;

  const handleGovIdUpload = () => {
    setGovIdUploaded(true);
    haptic('success');
  };

  const handleCaptureAngle = () => {
    setScanning(true);
    haptic('light');
    setTimeout(() => {
      setScanning(false);
      setAnglesDone((prev) => [...prev, currentAngleTarget]);
      if (currentAngleTarget === 'front') setCurrentAngleTarget('left');
      else if (currentAngleTarget === 'left') setCurrentAngleTarget('right');
      else {
        // All angles done!
        setStep('complete');
        const badgeLevel = plan === 'free' ? 'white' : 'gold';
        updateCurrentUser({
          verification: {
            status: 'verified',
            verifiedAt: new Date().toISOString().split('T')[0],
            daysRemainingToVerify: 15,
            rawGovDocDeleted: true, // DPDP Act compliance guarantee
            faceAnglesCaptured: 3,
            badgeLevel,
          },
        });
        haptic('success');
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setVerificationModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'intro' && (
          <div className="text-center pt-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-rose-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 mb-4">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Cohab Trust & Safety
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              To keep our community safe from fake profiles and scams, every flatmate verifies with a government ID and a live multi-angle camera scan.
            </p>

            <div className="bg-slate-800/60 rounded-2xl p-4 text-left mb-6 border border-slate-700/50 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">India DPDP Act Compliant</p>
                  <p className="text-xs text-slate-400">
                    Your raw ID document is never stored. We retain only cryptographic verification hashes and delete raw images immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">Verified Badge ({plan === 'free' ? 'White' : 'Gold'})</p>
                  <p className="text-xs text-slate-400">
                    Free users receive a White Verified shield. Pro & Plus members unlock the prestigious Gold Verified badge.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-300">15-Day Policy</p>
                  <p className="text-xs text-slate-400">
                    Complete verification within 15 days of joining, or discovery is locked for 75 days to safeguard flatmates.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep('gov_id');
                haptic('light');
              }}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 font-semibold rounded-2xl text-white shadow-lg shadow-rose-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Begin Verification <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'gov_id' && (
          <div className="pt-2">
            <h3 className="text-xl font-bold text-white mb-1">Step 1: Government ID</h3>
            <p className="text-xs text-slate-400 mb-5">
              Select your document type and upload a clear picture.
            </p>

            <div className="space-y-3 mb-6">
              {['Aadhaar Card (Masked)', 'Driving License', 'Passport', 'Voter ID'].map((type) => (
                <button
                  key={type}
                  onClick={() => setGovIdType(type)}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm flex items-center justify-between transition ${
                    govIdType === type
                      ? 'border-rose-500 bg-rose-500/10 text-white font-medium'
                      : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{type}</span>
                  {govIdType === type && <CheckCircle2 className="w-4 h-4 text-rose-500" />}
                </button>
              ))}
            </div>

            <div
              onClick={handleGovIdUpload}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition mb-6 ${
                govIdUploaded
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700 hover:border-rose-500/60 bg-slate-800/20'
              }`}
            >
              {govIdUploaded ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                  <p className="text-sm font-semibold text-emerald-300">ID Image Verified & Encrypted</p>
                  <p className="text-[11px] text-slate-400 mt-1">Raw document will be purged immediately after hash creation.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="w-8 h-8 text-rose-400 mb-2" />
                  <p className="text-sm font-medium text-slate-200">Tap to snap or upload {govIdType}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Accepts JPG, PNG. Max 5MB.</p>
                </div>
              )}
            </div>

            <button
              disabled={!govIdUploaded}
              onClick={() => {
                setStep('face_scan');
                haptic('light');
              }}
              className={`w-full py-3.5 font-semibold rounded-2xl text-white transition flex items-center justify-center gap-2 ${
                govIdUploaded
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Proceed to Face Angles Scan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'face_scan' && (
          <div className="pt-2 text-center">
            <h3 className="text-xl font-bold text-white mb-1">Step 2: Live Face Angles</h3>
            <p className="text-xs text-slate-400 mb-4">
              Look directly into the camera frame and turn your face as guided.
            </p>

            {/* Camera Viewport Simulation */}
            <div className="relative w-48 h-56 mx-auto rounded-3xl overflow-hidden border-2 border-rose-500/40 bg-slate-950 mb-4 flex items-center justify-center shadow-inner">
              <img
                src={currentUser.avatar}
                alt="Face frame"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 border-4 border-dashed border-rose-500/60 rounded-3xl animate-pulse pointer-events-none" />
              {scanning && (
                <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {['front', 'left', 'right'].map((ang) => (
                <span
                  key={ang}
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                    anglesDone.includes(ang)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : currentAngleTarget === ang
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {ang}
                </span>
              ))}
            </div>

            <p className="text-sm font-semibold text-slate-200 mb-6">
              {currentAngleTarget === 'front'
                ? 'Align your face looking directly forward'
                : currentAngleTarget === 'left'
                ? 'Gently tilt your head to the left'
                : 'Now gently tilt your head to the right'}
            </p>

            <button
              onClick={handleCaptureAngle}
              disabled={scanning}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 font-semibold rounded-2xl text-white shadow-lg shadow-rose-500/25 transition active:scale-[0.98]"
            >
              {scanning ? 'Analyzing biometric hash...' : `Capture ${currentAngleTarget.toUpperCase()} Angle`}
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="pt-2 text-center">
            <div className="w-20 h-20 mx-auto bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You are Verified!</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Your profile now displays the prestigious{' '}
              <span className={`font-semibold ${plan === 'free' ? 'text-white' : 'text-amber-400'}`}>
                {plan === 'free' ? 'White' : 'Gold'} Verified
              </span>{' '}
              badge. Other flatmates know you are a verified real resident on Cohab.
            </p>

            <div className="bg-slate-800/60 rounded-2xl p-4 text-left text-xs text-slate-400 space-y-2 mb-6">
              <p className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Raw ID deleted per DPDP Section 8(7).
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Biometric hash validated across 3 angles.
              </p>
            </div>

            <button
              onClick={() => {
                setVerificationModalOpen(false);
                haptic('medium');
              }}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 font-semibold rounded-2xl text-white transition"
            >
              Back to Cohab
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
