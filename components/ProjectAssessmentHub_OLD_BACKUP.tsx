import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Zap, ArrowRight, Loader2, ShieldCheck, Network, Mail, Fingerprint, Activity, X, ShieldAlert, Check, MessageSquare, Calendar, Video, Cpu, FileText, Database, Target, Linkedin, Smartphone, Info, Clock, AlertCircle, FileCode, PlayCircle, Presentation, Lock, Terminal, Sparkles, Timer, RefreshCw, XCircle, AlertTriangle, User, Globe, Share2, Headphones, Layers, Binary, Bot, CheckCircle2, Shield,
  ArrowUpRight, Upload, CheckCircle, Send, BookOpen, Phone, Eye
} from 'lucide-react';
import { validateStep, checkSchedulingWindow, normalizePhone, isValidE164 } from '../core/validation';

// NEW FLOW - All steps in the new flow
type Step = 'audit_protocol' | 'goals_and_video' | 'privy_auth' | 'linkedin_phone_validation' | 'account_activation' | 'google_meet_booking' | 'confirmation_email' | 'chat_box';
const STEPS: Step[] = ['audit_protocol', 'goals_and_video', 'privy_auth', 'linkedin_phone_validation', 'account_activation', 'google_meet_booking', 'confirmation_email', 'chat_box'];

/* OLD FLOW - COMMENTED OUT - NO LONGER IN USE
type Step = 'initiation' | 'intent' | 'materials' | 'identity' | 'verification' | 'privy_handshake' | 'scheduling' | 'summary';
const STEPS: Step[] = ['initiation', 'intent', 'materials', 'identity', 'verification', 'privy_handshake', 'scheduling', 'summary'];
*/

const OTPInput = ({ length = 6, onComplete, disabled, hasError }: { length?: number, onComplete: (otp: string) => void, disabled?: boolean, hasError?: boolean }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const cleanValue = String(value).replace(/[^0-9]/g, "").slice(-1);
    if (!cleanValue && value !== "") return;
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    if (cleanValue && index < length - 1) inputs.current[index + 1]?.focus();
    if (newOtp.every(v => v !== "")) onComplete(newOtp.join(""));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  return (
    <div className="flex gap-1 sm:gap-2 lg:gap-3 justify-center">
      {otp.map((data, index) => (
        <input
          key={index}
          ref={el => { inputs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={String(data)}
          disabled={disabled}
          onChange={e => handleChange(e.target.value, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onFocus={e => e.target.select()}
          className={`w-9 h-12 xs:w-11 xs:h-14 sm:w-14 sm:h-18 bg-black/40 border-2 rounded-lg xs:rounded-xl text-center text-lg sm:text-xl font-black transition-all disabled:opacity-30 outline-none ${
            hasError ? 'border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-white/10 text-decensat focus:border-decensat'
          }`}
        />
      ))}
    </div>
  );
};

const ProtocolSyncOverlay = ({ message = "Synchronizing_Protocol..." }: { message?: string }) => (
  <div className="absolute inset-0 z-[6001] flex items-center justify-center bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300">
    <div className="flex flex-col items-center gap-6">
      <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border-4 border-decensat/10 border-t-decensat animate-spin" />
      <div className="text-[7px] sm:text-[10px] font-black text-decensat uppercase tracking-[0.4em] sm:tracking-[0.5em] animate-pulse font-mono text-center px-6">{String(message)}</div>
    </div>
  </div>
);

const ProjectAssessmentHub: React.FC<{ onLogin?: (email: string) => void }> = ({ onLogin }) => {
  const [currentStep, setCurrentStep] = useState<Step>('audit_protocol');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blockingReasons, setBlockingReasons] = useState<string[]>([]);
  const [ustTime, setUstTime] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{from: string, message: string, time: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  
  const [submission, setSubmission] = useState({
    // NEW FLOW FIELDS
    goals: '',
    videoLink: '',
    loomLink: '',
    uploadedFiles: [] as Array<{ name: string; size: number; type: string }>,
    email: '',
    walletAddress: '',
    linkedinUrl: '',
    phoneNumber: '',
    linkedinValidated: false,
    phoneValidated: false,
    accountActivated: false,
    meetingDate: '',
    meetingTime: '',
    meetingLink: '',
    emailConfirmationSent: false,
  });

  const activeStepIndex = STEPS.indexOf(currentStep);

  const earliestAllowedDate = useMemo(() => {
    const date = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const minutes = date.getMinutes();
    if (minutes > 0 && minutes <= 30) {
      date.setMinutes(30, 0, 0);
    } else if (minutes > 30) {
      date.setHours(date.getHours() + 1, 0, 0, 0);
    } else {
      date.setSeconds(0, 0);
    }
    return date.toISOString().slice(0, 16);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', { 
        timeZone: 'America/New_York',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setUstTime(String(time));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [resendTimer]);

  const handleNext = async () => {
    // Validation for each step
    if (currentStep === 'goals_and_video') {
      if (!submission.goals.trim()) {
        setErrors({ goals: 'Goals are required' });
        return;
      }
      if (!submission.videoLink.trim() && !submission.loomLink.trim()) {
        setErrors({ videoLink: 'Video link or Loom link is required' });
        return;
      }
    }

    if (currentStep === 'privy_auth') {
      if (!submission.email.trim() || !submission.email.includes('@')) {
        setErrors({ email: 'Valid email is required' });
        return;
      }
    }

    if (currentStep === 'linkedin_phone_validation') {
      if (!submission.linkedinUrl.trim()) {
        setErrors({ linkedinUrl: 'LinkedIn profile URL is required' });
        return;
      }
      if (!submission.phoneNumber.trim()) {
        setErrors({ phoneNumber: 'Phone number is required' });
        return;
      }
    }

    if (currentStep === 'google_meet_booking') {
      if (!submission.meetingDate || !submission.meetingTime) {
        setErrors({ meeting: 'Please select a date and time for the meeting' });
        return;
      }
    }

    setIsLoading(true);
    setErrors({});
    await new Promise(r => setTimeout(r, 800));

    // Navigate to next step
    if (activeStepIndex < STEPS.length - 1) {
      const nextStep = STEPS[activeStepIndex + 1];
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(nextStep);
      
      // Special actions for specific steps
      if (nextStep === 'privy_auth') {
        // Simulate Privy authentication
        setIsAuthenticated(true);
      }
      
      if (nextStep === 'account_activation') {
        // Simulate validation success
        setSubmission(prev => ({ ...prev, linkedinValidated: true, phoneValidated: true }));
      }

      if (nextStep === 'confirmation_email') {
        // Send confirmation email (simulated)
        setSubmission(prev => ({ ...prev, emailConfirmationSent: true }));
        // Auto-proceed to chat after confirmation
        setTimeout(async () => {
          setIsTransitioning(true);
          await new Promise(r => setTimeout(r, 600));
          setCurrentStep('chat_box');
          setIsTransitioning(false);
        }, 2000);
      }
      
      setIsTransitioning(false);
      setBlockingReasons([]);
    }

    setIsLoading(false);
  };

  const handleBack = async () => {
    if (activeStepIndex > 0) {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 400));
      setCurrentStep(STEPS[activeStepIndex - 1]);
      setErrors({});
      setBlockingReasons([]);
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setSubmission(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newFiles]
      }));
    }
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, {
        from: 'user',
        message: chatInput,
        time: new Date().toLocaleTimeString()
      }]);
      setChatInput('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          from: 'support',
          message: 'Thanks for your message! Our team will get back to you shortly.',
          time: new Date().toLocaleTimeString()
        }]);
      }, 1000);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'initiation':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="mb-6 sm:mb-12 border-l-[6px] sm:border-l-[10px] border-decensat pl-4 sm:pl-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shrink-0">
                   <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-decensat" />
                </div>
                <div>
                  <h3 className="text-xl xs:text-2xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-1.5 sm:mb-2 text-glow-lime">Audit <span className="text-decensat italic">Protocol</span></h3>
                  <p className="text-slate-500 font-bold uppercase text-[7px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em]">STATE: READY_FOR_INGESTION</p>
                </div>
              </div>
            </div>

            <p className="text-sm xs:text-base sm:text-2xl text-slate-400 font-bold uppercase tracking-tight max-w-3xl mb-10 xs:mb-14 border-l-4 border-white/10 pl-4 sm:pl-10 ml-1 sm:ml-2 italic leading-relaxed">
              Submit your project details so we prepare the right experts for your strategy call
            </p>
            <button 
              disabled={isLoading}
              onClick={handleNext} 
              className="w-full sm:w-fit px-8 xs:px-10 sm:px-16 py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-5 sm:gap-10 active:scale-95 ml-1 sm:ml-2 transform-gpu disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'INITIATE_HANDSHAKE'} 
              {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
            </button>
          </div>
        );

      case 'intent':
        return (
          <div className="space-y-8 sm:space-y-12 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="space-y-2">
              <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">Business <span className="text-decensat not-italic">Intent</span></h3>
              <p className="text-[10px] xs:text-xs sm:text-xl text-slate-500 font-bold uppercase tracking-tight">Systemic objectives and outcome specifications.</p>
            </div>
            <div className="relative">
               <textarea 
                disabled={isLoading}
                value={String(submission.intent)}
                onChange={(e) => { setSubmission({...submission, intent: e.target.value}); setErrors({}); }}
                placeholder="Briefly describe the business objective or system requirement..."
                className={`w-full min-h-[180px] xs:min-h-[220px] sm:min-h-[350px] bg-black/40 border-[2px] sm:border-[3px] rounded-[1.5rem] sm:rounded-[4rem] p-6 xs:p-8 sm:p-14 text-sm xs:text-base sm:text-3xl font-bold placeholder:text-slate-800 focus:outline-none transition-all uppercase tracking-tight leading-relaxed ${errors.intent ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5 focus:border-decensat/30'} disabled:opacity-50`}
              />
              {errors.intent && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase mt-4 ml-6 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.intent)}</p>}
            </div>
            <div className="flex gap-3 sm:gap-6">
              <button disabled={isLoading} onClick={handleBack} className="px-5 xs:px-6 sm:px-12 py-4 sm:py-8 text-[9px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'NEXT_PHASE'} 
                {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-8 xs:space-y-10 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-6xl py-6 sm:py-12 mx-auto">
             <div className="space-y-3">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Project <span className="text-decensat not-italic">Materials</span></h3>
                <div className="flex items-center gap-3 text-decensat font-mono text-[8px] sm:text-sm font-black uppercase tracking-[0.4em]">
                   <Activity size={16} className="animate-pulse" /> ARTIFACT_COLLECTION_v4.2
                </div>
             </div>

             <div className="grid lg:grid-cols-12 gap-6 xs:gap-8 lg:gap-12">
                <div className="lg:col-span-7 space-y-6">
                   <div className="p-6 xs:p-8 sm:p-14 bg-black/40 border-[2px] sm:border-[3px] border-white/5 rounded-[1.8rem] sm:rounded-[4rem] space-y-6 sm:space-y-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none"><Database size={180} /></div>
                      <div className="space-y-3 sm:space-y-4 relative z-10">
                         <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                           <Database size={16} className="text-decensat" /> Primary Visualization Link
                         </label>
                         <div className="relative">
                            <input 
                              disabled={isLoading}
                              type="url" 
                              value={String(submission.visualization?.value || '')}
                              onChange={(e) => { 
                                setSubmission({
                                  ...submission, 
                                  visualization: { 
                                    ...submission.visualization, 
                                    value: e.target.value 
                                  }
                                }); 
                                setErrors({}); 
                              }}
                              placeholder="https://loom.com/share/..."
                              className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-8 text-white font-mono text-[10px] xs:text-sm sm:text-xl focus:outline-none transition-all shadow-inner ${errors.visualization ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/10 focus:border-decensat/40'} disabled:opacity-50`}
                            />
                            {errors.visualization && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase mt-3 ml-2 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.visualization)}</p>}
                         </div>
                      </div>
                      
                      <div className="pt-4 xs:pt-6 border-t border-white/10 relative z-10">
                        <p className="text-slate-500 text-[8px] sm:text-sm font-bold leading-relaxed uppercase tracking-tight italic">
                          Providing a direct link to your architecture or explainer is <span className="text-decensat underline decoration-decensat/30 underline-offset-4">MANDATORY</span> for price quotation finality.
                        </p>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                   <div className="p-6 xs:p-8 sm:p-14 bg-white/5 border border-white/10 rounded-[1.8rem] sm:rounded-[2.2rem] lg:rounded-[3.5rem] space-y-6 sm:space-y-8 h-full shadow-xl">
                      <div className="flex items-center gap-3 text-slate-400 font-black text-[9px] sm:text-xs uppercase tracking-[0.4em] mb-2">
                        <Info size={16} className="text-blue-500" /> Ingestion_Logic
                      </div>
                      <p className="text-slate-400 text-[10px] xs:text-xs sm:text-lg font-bold uppercase tracking-tight italic leading-relaxed">
                        To generate institutional quotes, principals require verifiable context.
                      </p>
                      <div className="space-y-4 sm:space-y-6 pt-2 xs:pt-4">
                         <div className="flex items-start gap-4 sm:gap-5 group/item">
                            <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl bg-decensat/10 flex items-center justify-center text-decensat border border-decensat/20 group-hover/item:scale-110 transition-transform shrink-0">
                              <PlayCircle size={20} />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                               <div className="text-[9px] sm:text-xs font-black text-slate-200 uppercase tracking-widest leading-none">Video Explainer</div>
                               <div className="text-[7px] sm:text-[10px] font-bold text-slate-600 uppercase">Loom / Drive / YouTube</div>
                            </div>
                         </div>
                         <div className="flex items-start gap-4 sm:gap-5 group/item">
                            <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover/item:scale-110 transition-transform shrink-0">
                              <Presentation size={20} />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                               <div className="text-[9px] sm:text-xs font-black text-slate-200 uppercase tracking-widest leading-none">Architectural Spec</div>
                               <div className="text-[7px] sm:text-[10px] font-bold text-slate-600 uppercase">Slides / Miro / Figma</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 xs:py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'VALIDATE_ARTIFACTS'} 
                {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'identity':
        const phoneIsValid = isValidE164(submission.phone);
        return (
          <div className="space-y-8 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-2xl py-6 sm:py-12 mx-auto">
            <div className="space-y-3">
               <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Identity <span className="text-decensat not-italic">Uplink</span></h3>
               <p className="text-slate-400 text-xs sm:text-2xl font-bold leading-relaxed uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 sm:pl-8">
                 INITIALIZE ALIGNMENT. BUSINESS DOMAIN REQUIRED.
               </p>
            </div>
            <div className="space-y-5 sm:space-y-8">
              <div className="space-y-2">
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.linkedin ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5"><Linkedin size={18} className="sm:size-6" /></div>
                  <input 
                    disabled={isLoading}
                    type="url" value={String(submission.linkedin)} onChange={(e) => { setSubmission({...submission, linkedin: e.target.value}); setErrors({}); }}
                    placeholder="LINKEDIN_PROFILE_URL"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 uppercase font-mono tracking-tight"
                  />
                </div>
                {errors.linkedin && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.linkedin)}</p>}
              </div>

              <div className="space-y-2">
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.email ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5"><Mail size={18} className="sm:size-6" /></div>
                  <input 
                    disabled={isLoading}
                    type="email" value={String(submission.email)} onChange={(e) => { setSubmission({...submission, email: e.target.value}); setErrors({}); }}
                    placeholder="BUSINESS_EMAIL_ADDRESS"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 uppercase font-mono tracking-tight"
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.email)}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4 xs:px-6">
                  <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-widest">International_Contact_Signal</label>
                  <Info size={14} className="text-slate-600 cursor-help hover:text-white transition-colors" />
                </div>
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.phone ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl flex items-center justify-center shrink-0 shadow-xl transition-all border border-white/5 ${phoneIsValid ? 'bg-decensat/20 text-decensat' : 'bg-zinc-900 text-slate-500'}`}>
                    <Smartphone size={18} className="sm:size-6" />
                  </div>
                  <input
                    disabled={isLoading}
                    type="tel"
                    value={String(submission.phone)}
                    onChange={(e) => { setSubmission({...submission, phone: normalizePhone(e.target.value)}); setErrors({}); }}
                    placeholder="+14155552671"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 font-mono tracking-tight"
                  />
                </div>
                {errors.phone && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.phone)}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 xs:py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'ESTABLISH_UPLINK'} 
                {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-500 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12">
            <div className="space-y-6">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-32 sm:h-32 bg-decensat/10 rounded-[1.5rem] sm:rounded-[3rem] border-2 sm:border-4 border-decensat/20 flex items-center justify-center mx-auto text-decensat shadow-3xl">
                 <Lock size={32} className={isLoading ? 'animate-pulse sm:size-16' : 'sm:size-16'} />
              </div>
              <h3 className="text-2xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Handshake <span className="text-decensat">OTP</span></h3>
              <p className="text-slate-500 font-bold uppercase text-[8px] sm:text-lg tracking-[0.4em] max-w-md mx-auto leading-relaxed">Enter the signal code sent to <span className="text-white font-mono break-all underline decoration-decensat/30 underline-offset-4">{String(submission.phone || '')}</span>.</p>
            </div>
            
            <div className="space-y-8 w-full max-w-xl mx-auto">
              <OTPInput 
                disabled={isLoading}
                hasError={otpError}
                onComplete={handleVerifyCode} 
              />
              
              {otpError && (
                <div className="flex items-center justify-center gap-3 text-rose-500 animate-in slide-in-from-top-2">
                   <XCircle size={18} />
                   <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest font-mono">PROTOCOL_ERROR: SIGNAL_MISMATCH</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:gap-8">
              <div className="relative group">
                {resendTimer > 0 && (
                   <div className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center z-10 animate-in fade-in duration-300">
                      <div className="flex items-center gap-3 text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest">
                         <Lock size={14} className="text-rose-500" /> 0:{resendTimer < 10 ? '0' : ''}{resendTimer}
                      </div>
                   </div>
                )}
                <button 
                  disabled={isLoading || resendTimer > 0} 
                  onClick={handleResendOtp} 
                  className={`flex items-center justify-center gap-3 px-6 xs:px-8 py-3.5 xs:py-4 sm:py-5 rounded-full border-2 sm:border-[3px] transition-all ${resendTimer > 0 ? 'border-white/5 text-slate-700' : 'border-decensat/20 text-decensat hover:bg-decensat/10 text-[9px] sm:text-xs font-black uppercase tracking-[0.3em]'}`}
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  RESEND_SIGNAL
                </button>
              </div>
              <button disabled={isLoading} onClick={handleBack} className="text-[8px] sm:text-xs font-black text-slate-800 uppercase tracking-[0.4em] hover:text-white transition-all underline underline-offset-4 xs:underline-offset-8 disabled:opacity-30">Change Signal Uplink</button>
            </div>
          </div>
        );

      case 'privy_handshake':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-1000 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12 max-w-3xl mx-auto">
             <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-40 sm:h-40 bg-white rounded-[2rem] sm:rounded-[5rem] flex items-center justify-center text-black shadow-glow-md relative overflow-hidden group">
                <Fingerprint size={48} className={`sm:size-24 ${isLoading ? 'animate-pulse' : ''}`} />
                {isLoading && <div className="absolute inset-0 bg-decensat/10 animate-scan" />}
             </div>
             <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">Secure <span className="text-decensat not-italic">Identity_Sync</span></h3>
                <p className="text-xs xs:text-sm sm:text-2xl text-slate-400 font-bold uppercase leading-relaxed tracking-tight italic max-w-xl mx-auto">
                  Initializing Privy handshake for <span className="text-white underline decoration-decensat/30 underline-offset-4">{submission.email}</span>. JWT magic link incoming.
                </p>
             </div>

             <div className="p-6 xs:p-8 sm:p-14 bg-black/60 border-[2px] sm:border-[3px] border-white/10 rounded-[1.8rem] sm:rounded-[4rem] w-full shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4 text-decensat text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] mb-6 xs:mb-8 border-b border-white/5 pb-4 xs:pb-6">
                   <Shield size={20} /> PRIVY_STRICT_ENFORCEMENT_v1.4
                </div>
                <div className="flex flex-col gap-3 xs:gap-4 text-left">
                   <div className="flex justify-between items-center text-[8px] xs:text-[9px] sm:text-xs font-mono border-b border-white/5 pb-3 xs:pb-4">
                      <span className="text-slate-600 uppercase tracking-widest">CLIENT_NODE_ID:</span>
                      <span className="text-white font-black truncate max-w-[150px]">NODE_{submission.email.split('@')[0].toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[8px] xs:text-[9px] sm:text-xs font-mono">
                      <span className="text-slate-600 uppercase tracking-widest">HANDSHAKE_TYPE:</span>
                      <span className="text-decensat font-black">JWT_MAGIC_LINK_v2</span>
                   </div>
                </div>
             </div>

             <button 
               onClick={executePrivyHandshake}
               disabled={isLoading}
               className="w-full py-5 xs:py-6 sm:py-10 bg-decensat text-black font-black uppercase text-[11px] sm:text-lg tracking-[0.4em] rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-4 sm:gap-10 active:scale-95 transform-gpu disabled:opacity-50"
             >
                {isLoading ? <Loader2 className="animate-spin" size={28} /> : <Zap size={28} />}
                {isLoading ? 'EXECUTING_MESH_SYNC...' : 'EXECUTE_SECURE_HANDSHAKE'}
             </button>
          </div>
        );

      case 'scheduling':
        return (
          <div className="space-y-8 xs:space-y-10 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-5xl py-6 sm:py-12 mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Strategy <span className="text-decensat not-italic">Sync</span></h3>
                <div className="bg-black/80 border border-white/10 px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 xs:gap-3 sm:gap-4 shadow-3xl">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-decensat animate-pulse" />
                   <span className="text-[9px] xs:text-[10px] sm:text-sm font-mono font-black text-white uppercase tracking-widest">{String(ustTime || '')} UST</span>
                </div>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-2xl text-slate-500 font-bold uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 xs:pl-5 sm:pl-8">Select baseline signal for principal node alignment.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 xs:gap-8 lg:gap-16">
               <div className="lg:col-span-7 space-y-4 xs:space-y-6">
                  <div className={`p-6 xs:p-8 sm:p-14 bg-black/40 border-[2px] sm:border-[3px] rounded-[1.8rem] sm:rounded-[4rem] space-y-6 sm:space-y-8 transition-all ${errors.scheduling ? 'border-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                     <div className="space-y-3 sm:space-y-4">
                        <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] px-3 flex items-center justify-between">
                           <span className="flex items-center gap-2 xs:gap-3"><Clock size={16} className="text-decensat" /> Select Signal (UST)</span>
                        </label>
                        <div className="relative group">
                           <input 
                              disabled={isLoading}
                              type="datetime-local" 
                              min={String(earliestAllowedDate)}
                              step="1800"
                              className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-10 text-white font-mono text-[10px] xs:text-sm sm:text-xl outline-none transition-all appearance-none cursor-pointer hover:bg-white/5 ${errors.scheduling ? 'border-rose-500/40 text-rose-500 shadow-inner' : 'border-white/10 focus:border-decensat/40 shadow-inner'} disabled:opacity-50`}
                              onChange={(e) => {
                                 let date = new Date(e.target.value);
                                 const mins = date.getMinutes();
                                 if (mins !== 0 && mins !== 30) date.setMinutes(mins < 30 ? 0 : 30, 0, 0);
                                 const check = checkSchedulingWindow(date);
                                 if (!check.valid) {
                                   setErrors({ scheduling: `[!] ERROR: ${String(check.reason || '')}` });
                                   setSubmission({...submission, scheduledAt: ''});
                                 } else {
                                   setErrors({});
                                   setSubmission({...submission, scheduledAt: date.toISOString()});
                                 }
                              }}
                           />
                           <Calendar className="absolute right-6 xs:right-8 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none group-focus-within:text-decensat transition-colors sm:size-8" size={24} />
                        </div>
                        {errors.scheduling && (
                          <div className="p-4 xs:p-5 sm:p-8 bg-rose-500/5 border-2 border-rose-500/20 rounded-xl xs:rounded-2xl sm:rounded-3xl animate-in shake duration-500">
                             <p className="text-rose-500 text-[9px] xs:text-[10px] sm:text-sm font-black uppercase flex items-center gap-3 italic leading-tight">
                                <ShieldAlert size={18} className="shrink-0" /> {String(errors.scheduling)}
                             </p>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="p-5 xs:p-6 sm:p-10 bg-decensat/5 border-2 border-decensat/10 rounded-[1.5rem] sm:rounded-[3rem] space-y-2 xs:space-y-3 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Timer size={100} /></div>
                     <div className="flex items-center gap-2 xs:gap-3 text-decensat relative z-10 font-black">
                        <Timer size={18} className="animate-pulse" />
                        <span className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.4em]">Temporal Buffer (72h) Enforced</span>
                     </div>
                     <p className="text-[8px] xs:text-[9px] sm:text-sm text-slate-500 font-bold leading-relaxed uppercase tracking-tight italic relative z-10">Institutional scoping requires a mandatory 72-hour provisioning window.</p>
                  </div>
               </div>

               <div className="lg:col-span-5 space-y-4 xs:space-y-6">
                  <div className="bg-black/60 border border-white/10 rounded-[1.8rem] sm:rounded-[4rem] p-6 xs:p-8 sm:p-14 h-full shadow-3xl">
                     <h5 className="text-[8px] xs:text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 xs:mb-8 border-b border-white/5 pb-4 xs:pb-6 flex items-center gap-2 xs:gap-3">
                        <Clock size={16} className="text-blue-500" /> Operational_Windows (UST)
                     </h5>
                     <ul className="space-y-3 sm:space-y-6 relative z-10">
                        {[
                           { label: 'M — F', time: '9:00 AM – 6:00 PM', status: 'Core' },
                           { label: 'SAT', time: '12:00 PM – 5:00 PM', status: 'Venture' },
                           { label: 'SUN', time: 'OFFLINE_MAINTENANCE', status: 'Rest' }
                        ].map((item, i) => (
                           <li key={i} className="flex flex-col gap-0.5 sm:gap-2 pb-3 xs:pb-4 sm:pb-6 border-b border-white/5 last:border-0 group/row">
                              <div className="flex justify-between items-center">
                                 <span className="text-[9px] xs:text-[10px] sm:text-xs font-black text-white uppercase group-hover/row:text-decensat transition-colors">{String(item.label)}</span>
                                 <span className={`text-[6px] xs:text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded border transition-colors ${item.status === 'Rest' ? 'border-rose-500/30 text-rose-500' : 'border-decensat/30 text-decensat'}`}>{String(item.status)}</span>
                              </div>
                              <span className="text-[10px] xs:text-[11px] sm:text-lg font-mono text-slate-500 group-hover/row:text-slate-300 transition-colors">{String(item.time)}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading || isFinalizing} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button 
                 onClick={handleNext} 
                 disabled={!submission.scheduledAt || isLoading || isFinalizing} 
                 className={`flex-1 py-4 xs:py-5 sm:py-8 rounded-[1.2rem] sm:rounded-[2.5rem] font-black text-[10px] sm:text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-glow-md transform-gpu ${(!submission.scheduledAt || isLoading) ? 'bg-zinc-900 text-slate-700 cursor-not-allowed grayscale border border-white/5' : 'bg-decensat text-black hover:bg-white'}`}
              >
                 {(isFinalizing || isLoading) ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} strokeWidth={3} />}
                 {isLoading ? 'SYNCING...' : 'VALIDATE_SIGNAL'}
              </button>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-1000 h-full flex flex-col justify-center py-10 px-4 sm:px-10 max-w-7xl mx-auto w-full">
            <div className="mb-10 sm:mb-20 text-center space-y-6 px-6">
               <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] shadow-glow-sm">
                  <Sparkles size={16} className="animate-pulse" /> UPLINK_ESTABLISHED_v4.5
               </div>
               <h3 className="text-3xl xs:text-4xl sm:text-[8rem] font-black text-white uppercase tracking-tighter italic leading-none">Mission <br/><span className="text-decensat not-italic underline decoration-white/10 underline-offset-[16px] sm:underline-offset-[32px]">Control.</span></h3>
            </div>

            <div className="bg-zinc-950 border-[2px] sm:border-[6px] border-white/5 rounded-[2rem] sm:rounded-[6rem] overflow-hidden shadow-3xl flex flex-col min-h-[500px] sm:min-h-[800px] relative">
               <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
               
               <div className="flex border-b border-white/10 bg-black/40 backdrop-blur-md relative z-10 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'telemetry', label: 'Platform_Sync', icon: Activity },
                    { id: 'advisory', label: 'Human_Advisory', icon: Headphones },
                    { id: 'vault', label: 'Signal_Vault', icon: Lock }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSummaryTab(tab.id as any)}
                      className={`flex-1 min-w-[140px] xs:min-w-[160px] flex flex-col items-center py-6 xs:py-8 sm:py-14 border-b-[4px] xs:border-b-[6px] transition-all group ${summaryTab === tab.id ? 'bg-white/5 border-decensat' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                       <tab.icon size={20} className={`sm:size-8 ${summaryTab === tab.id ? 'text-decensat' : 'text-slate-500'}`} />
                       <span className={`text-[8px] xs:text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mt-3 xs:mt-5 whitespace-nowrap ${summaryTab === tab.id ? 'text-white' : 'text-slate-600'}`}>{tab.label}</span>
                    </button>
                  ))}
               </div>

               <div className="flex-1 p-6 xs:p-8 sm:p-20 relative z-10 overflow-y-auto custom-scrollbar">
                  {summaryTab === 'telemetry' && (
                    <div className="space-y-6 sm:space-y-10 animate-in slide-in-from-right-6 duration-500 h-full flex flex-col">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-16">
                          <div className="p-6 xs:p-8 sm:p-14 bg-black/60 border-[2px] sm:border-[3px] border-white/5 rounded-[2rem] xs:rounded-[3rem] sm:rounded-[4.5rem] space-y-4 sm:space-y-10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 transition-transform"><Cpu size={180} /></div>
                             <div className="flex items-center gap-2 xs:gap-4 text-decensat font-black text-[9px] sm:text-sm uppercase tracking-[0.4em]">
                                <Timer size={20} className="animate-pulse" /> Provisioning_Buffer
                             </div>
                             <div className="text-3xl xs:text-4xl sm:text-8xl font-black font-mono text-white tracking-tighter">72:00:00</div>
                             <p className="text-[9px] sm:text-lg text-slate-500 font-bold leading-relaxed uppercase tracking-tight italic">72-hour institutional provisioning window active for principal node allocation.</p>
                          </div>
                          <div className="p-6 xs:p-8 sm:p-14 bg-black/60 border-[2px] sm:border-[3px] border-white/5 rounded-[2rem] xs:rounded-[3rem] sm:rounded-[4.5rem] space-y-4 sm:space-y-10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 transition-transform"><Globe size={180} /></div>
                             <div className="flex items-center gap-2 xs:gap-4 text-blue-500 font-black text-[9px] sm:text-sm uppercase tracking-[0.4em]">
                                <Target size={20} className="animate-pulse" /> System_Alignment
                             </div>
                             <div className="text-3xl xs:text-4xl sm:text-8xl font-black font-mono text-white tracking-tighter">100% PARITY</div>
                             <div className="hidden xs:block p-3 xs:p-4 sm:p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl xs:rounded-2xl w-fit">
                                <span className="text-[8px] sm:text-xs font-black text-blue-400 uppercase tracking-widest">UCP_A2A_SYNC_LOCKED</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-auto pt-6 xs:pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 xs:gap-10">
                          <div className="flex items-center gap-4 sm:gap-6">
                             <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-decensat animate-ping" />
                             <span className="text-[8px] sm:text-sm font-mono text-slate-600 uppercase tracking-[0.5em] font-black">Nominal_Operation: STABLE</span>
                          </div>
                          <button 
                            onClick={() => { if (onLogin) onLogin(String(submission.email || 'anon@node.io')); }}
                            className="w-full sm:w-auto px-10 xs:px-16 py-5 xs:py-7 sm:py-9 bg-white text-black rounded-2xl xs:rounded-3xl font-black text-[10px] xs:text-xs sm:text-base uppercase tracking-[0.4em] hover:bg-decensat transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-glow-md active:scale-95 transform-gpu"
                          >
                             OPEN_FULL_CONSOLE <ArrowRight size={24} strokeWidth={4} />
                          </button>
                       </div>
                    </div>
                  )}

                  {summaryTab === 'advisory' && (
                    <div className="space-y-8 xs:space-y-10 animate-in slide-in-from-right-6 duration-500 h-full flex flex-col">
                       <div className="space-y-6 xs:space-y-8">
                          <div className="text-[9px] sm:text-sm font-black text-slate-600 uppercase tracking-[0.5em] mb-4 border-l-4 border-decensat pl-4 xs:pl-6 flex items-center gap-3 xs:gap-4">
                             <User size={20} className="text-decensat" /> Active_Personnel_Cluster
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 sm:gap-10">
                             <div className="p-6 xs:p-8 sm:p-12 bg-zinc-900/50 border-2 border-white/5 rounded-[2rem] xs:rounded-[3rem] flex items-center gap-4 xs:gap-8 group hover:border-decensat/30 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform"><MessageSquare size={120} /></div>
                                <div className="w-12 h-12 xs:size-16 sm:w-24 sm:h-24 rounded-xl xs:rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 shrink-0 border-2 border-white/10 group-hover:text-decensat group-hover:border-decensat/30 transition-all duration-700">
                                   <MessageSquare size={28} className="sm:size-12" />
                                </div>
                                <div className="min-w-0 flex-1 relative z-10">
                                   <div className="text-[7px] xs:text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.3em] font-mono mb-1">BDR_SPECIALIST</div>
                                   <div className="text-base xs:text-xl sm:text-3xl font-black text-white uppercase tracking-tighter truncate leading-none">WhatsApp_Support</div>
                                   <div className="flex items-center gap-2 mt-2 xs:mt-3 sm:mt-4">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <span className="text-[7px] xs:text-[9px] sm:text-xs font-black text-emerald-500 uppercase tracking-widest">Uplink_Live</span>
                                   </div>
                                </div>
                             </div>
                             <div className="p-6 xs:p-8 sm:p-12 bg-zinc-900/50 border-2 border-white/5 rounded-[2rem] xs:rounded-[3rem] flex items-center gap-4 xs:gap-8 group hover:border-blue-500/30 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform"><Binary size={120} /></div>
                                <div className="w-12 h-12 xs:size-16 sm:w-24 sm:h-24 rounded-xl xs:rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 shrink-0 border-2 border-white/10 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all duration-700">
                                   <Binary size={28} className="sm:size-12" />
                                </div>
                                <div className="min-w-0 flex-1 relative z-10">
                                   <div className="text-[7px] xs:text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.3em] font-mono mb-1">PRINCIPAL_DEV</div>
                                   <div className="text-base xs:text-xl sm:text-3xl font-black text-white uppercase tracking-tighter truncate leading-none">Codebase_Sync</div>
                                   <div className="flex items-center gap-2 mt-2 xs:mt-3 sm:mt-4">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                      <span className="text-[7px] xs:text-[9px] sm:text-xs font-black text-slate-600 uppercase tracking-widest">Wait_Buffer</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                       <button className="w-full mt-auto py-5 xs:py-7 sm:py-10 bg-decensat/5 border-2 border-decensat/20 text-decensat rounded-2xl xs:rounded-3xl sm:rounded-[3rem] font-black text-[10px] xs:text-xs sm:text-xl uppercase tracking-[0.4em] hover:bg-decensat hover:text-black transition-all shadow-glow-sm">
                          REQUEST_URGENT_HANDSHAKE
                       </button>
                    </div>
                  )}

                  {summaryTab === 'vault' && (
                    <div className="space-y-6 xs:space-y-10 animate-in slide-in-from-right-6 duration-500 h-full flex flex-col">
                       <div className="space-y-6 sm:space-y-8">
                          <div className="text-[9px] sm:text-sm font-black text-slate-600 uppercase tracking-[0.5em] mb-4 border-l-4 border-decensat pl-4 xs:pl-6 flex items-center gap-3 xs:gap-4">
                             <FileText size={20} className="text-decensat" /> Audited_Signal_Logs
                          </div>
                          <div className="grid gap-3 xs:gap-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar pr-2 xs:pr-4">
                             {[
                               { id: 'LOG_882', action: 'Institutional_Intent', val: 'PASS', color: 'text-decensat' },
                               { id: 'LOG_883', action: 'Identity_Verified', val: 'PASS', color: 'text-decensat' },
                               { id: 'LOG_884', action: 'Temporal_Sync', val: 'PASS', color: 'text-decensat' },
                               { id: 'LOG_885', action: 'Artifact_Parity', val: 'PASS', color: 'text-decensat' }
                             ].map((log, i) => (
                               <div key={i} className="flex items-center justify-between p-4 xs:p-6 sm:p-10 bg-black/40 border-2 border-white/5 rounded-2xl xs:rounded-3xl font-mono group hover:border-white/20 transition-all">
                                  <div className="flex items-center gap-4 xs:gap-8">
                                     <div className="text-[8px] xs:text-[10px] sm:text-sm text-slate-700 font-black tracking-widest">{log.id}</div>
                                     <div className="text-[9px] xs:text-xs sm:text-xl text-slate-300 font-black uppercase truncate group-hover:text-white transition-colors">{log.action}</div>
                                  </div>
                                  <div className={`text-[9px] xs:text-xs sm:text-xl font-black ${log.color} tracking-widest px-3 xs:px-4 py-1.5 rounded-lg xs:rounded-xl bg-white/5 border border-white/10 shadow-inner`}>{log.val}</div>
                               </div>
                             ))}
                          </div>
                       </div>
                       <button className="w-full mt-auto py-5 xs:py-6 bg-white/5 border-2 border-white/10 rounded-2xl xs:rounded-3xl flex items-center justify-center gap-4 xs:gap-6 text-slate-500 hover:text-white transition-all shadow-xl group">
                          <Share2 size={20} className="sm:size-6" /> <span className="text-[9px] xs:text-xs sm:text-lg font-black uppercase tracking-[0.4em]">EXPORT_IMMUTABLE_MANIFEST</span>
                       </button>
                    </div>
                  )}
               </div>

               <div className="px-6 xs:px-8 sm:px-20 py-4 xs:py-6 sm:py-10 border-t border-white/10 bg-black/40 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 xs:gap-4 sm:gap-6 text-[7px] xs:text-[8px] sm:text-xs font-mono font-black text-slate-700 uppercase tracking-[0.4em] xs:tracking-[0.6em]">
                     <Terminal size={14} className="sm:size-6" /> SYS_NODE: #DC3_SYNC_SUCCESS
                  </div>
                  <div className="flex items-center gap-2 xs:gap-3">
                     <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-decensat animate-pulse" />
                     <span className="text-[7px] xs:text-[8px] sm:text-xs font-mono font-black text-decensat uppercase tracking-[0.4em]">Sync Active</span>
                  </div>
               </div>
            </div>

            <div className="mt-8 xs:mt-12 flex justify-center">
               <button 
                onClick={() => { setCurrentStep('initiation'); setSummaryTab('telemetry'); }}
                className="text-[8px] xs:text-[9px] sm:text-sm font-black text-slate-800 uppercase tracking-[0.4em] xs:tracking-[0.5em] hover:text-white transition-all underline underline-offset-8 decoration-slate-800 hover:decoration-decensat duration-500"
               >
                RE_INITIALIZE_HANDSHAKE
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="project-assessment" className="min-h-0 bg-[#020617] flex flex-col relative overflow-hidden py-10 xs:py-16 sm:py-24 px-4 sm:px-12 max-w-[1920px] mx-auto w-full">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => !isLoading && setShowConfirmModal(false)} />
           <div className="bg-zinc-950 border-[2px] sm:border-[6px] border-white/5 rounded-[2rem] xs:rounded-[2.5rem] sm:rounded-[4.5rem] w-full max-xl relative z-10 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              <div className="p-6 xs:p-8 sm:p-14 border-b border-white/5 bg-black flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4 xs:gap-5 sm:gap-8">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-xl xs:rounded-2xl bg-decensat/10 flex items-center justify-center text-decensat border border-decensat/20 shadow-2xl">
                       <ShieldAlert size={24} className="sm:size-10" />
                    </div>
                    <div>
                       <h4 className="text-white font-black text-xs xs:text-sm sm:text-3xl uppercase tracking-tighter leading-none mb-1 sm:mb-2">Handshake_Review</h4>
                       <p className="text-[7px] xs:text-[8px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] font-black leading-none">v4.5 Protocol Active</p>
                    </div>
                 </div>
                 <button disabled={isLoading} onClick={() => setShowConfirmModal(false)} className="p-2 xs:p-3 sm:p-5 text-slate-500 hover:text-white transition-all bg-white/5 rounded-xl xs:rounded-2xl border border-white/10 disabled:opacity-30 active:scale-90">
                    <X size={20} className="sm:size-8" />
                 </button>
              </div>

              <div className="p-6 xs:p-8 sm:p-14 space-y-6 xs:space-y-8 sm:space-y-14 overflow-y-auto custom-scrollbar flex-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                 <div className="space-y-4 xs:space-y-6 sm:space-y-10">
                    <div className="text-[8px] xs:text-[9px] sm:text-xs font-black text-slate-600 uppercase tracking-[0.5em] border-l-4 border-decensat pl-4 xs:pl-5 sm:pl-8">Summary_Manifest</div>
                    <div className="grid gap-3 sm:gap-8">
                       <div className="bg-black/60 p-5 xs:p-6 sm:p-10 rounded-2xl xs:rounded-3xl sm:rounded-[3rem] border border-white/5 space-y-2 xs:space-y-3 sm:space-y-4 shadow-inner">
                          <div className="text-[7px] xs:text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono">Intent_Signal</div>
                          <p className="text-xs xs:text-sm sm:text-3xl text-slate-300 font-bold uppercase line-clamp-2 xs:line-clamp-3 italic leading-relaxed">"{String(submission.intent || '')}"</p>
                       </div>
                       <div className="grid grid-cols-1 gap-3 sm:gap-8">
                          <div className="bg-black/60 p-5 xs:p-6 sm:p-10 rounded-2xl xs:rounded-3xl sm:rounded-[3rem] border border-white/5 space-y-2 xs:space-y-3 sm:space-y-4 shadow-inner">
                             <div className="text-[7px] xs:text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono">Temporal_Sync</div>
                             <p className="text-xs xs:text-base sm:text-4xl text-white font-black uppercase tracking-tighter tabular-nums truncate">{submission.scheduledAt ? new Date(submission.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Pending'}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <label className="flex items-start gap-4 xs:gap-6 sm:gap-8 cursor-pointer group bg-decensat/5 p-6 xs:p-8 sm:p-14 rounded-[1.8rem] sm:rounded-[4rem] border-2 border-decensat/20 hover:border-decensat/50 transition-all shadow-3xl">
                    <div className="relative flex items-center h-6 xs:h-8 sm:h-12 mt-1 shrink-0">
                       <input 
                          disabled={isLoading}
                          type="checkbox" 
                          checked={hasAgreedToTerms}
                          onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                          className="w-6 h-6 xs:w-8 xs:h-8 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl sm:rounded-3xl border-2 xs:border-4 border-white/10 bg-black text-decensat focus:ring-decensat cursor-pointer appearance-none checked:bg-decensat transition-all relative after:content-[''] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white checked:after:content-['✓'] after:font-black after:text-sm xs:after:text-lg sm:after:text-4xl disabled:opacity-50"
                       />
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] xs:text-xs sm:text-3xl text-slate-300 font-bold uppercase leading-tight italic group-hover:text-white transition-colors tracking-tight">
                          I authorize this audit and commit to the scheduled sync.
                       </p>
                    </div>
                 </label>
              </div>

              <div className="p-6 xs:p-8 sm:p-14 border-t border-white/5 bg-black flex flex-col gap-3 xs:gap-4 sm:gap-6 shrink-0">
                 <button 
                    onClick={handleFinalizeBooking}
                    disabled={!hasAgreedToTerms || isFinalizing || isLoading}
                    className={`w-full py-4 xs:py-6 sm:py-12 rounded-xl xs:rounded-3xl sm:rounded-[3rem] font-black text-[10px] xs:text-xs sm:text-2xl uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all flex items-center justify-center gap-4 sm:gap-6 active:scale-95 transform-gpu ${(hasAgreedToTerms && !isLoading) ? 'bg-decensat text-black hover:bg-white shadow-glow-md' : 'bg-zinc-900 text-slate-700 cursor-not-allowed border border-white/5'}`}
                 >
                    {(isFinalizing || isLoading) ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} strokeWidth={4} className="sm:size-10" />}
                    {isLoading ? 'SYNCING...' : 'FINALIZE_ALIGNMENT'}
                 </button>
                 <button disabled={isLoading} onClick={() => setShowConfirmModal(false)} className="text-[8px] xs:text-[9px] sm:text-sm font-black text-slate-600 uppercase tracking-[0.4em] hover:text-white transition-colors disabled:opacity-30 text-center py-2 xs:py-4">Abort_Sequence</button>
              </div>
           </div>
        </div>
      )}

      {currentStep !== 'summary' && (
        <div className="flex gap-1 sm:gap-5 w-full mb-8 xs:mb-16 max-w-7xl mx-auto px-1 sm:px-0">
          {STEPS.map((s, i) => (
            <div key={String(s)} className="flex-1 group flex flex-col gap-2 sm:gap-3">
              <div className="h-1 sm:h-1.5 rounded-full relative overflow-hidden bg-white/5 border border-white/5 shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ease-expo ${i <= activeStepIndex ? 'bg-decensat shadow-glow-sm' : 'bg-transparent'}`} 
                  style={{ width: i <= activeStepIndex ? '100%' : '0%' }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 relative max-w-7xl mx-auto w-full">
        <div className={`h-full transition-all duration-700 ease-expo transform-gpu ${isTransitioning || isLoading ? 'opacity-0 translate-y-6 blur-md' : 'opacity-100 translate-y-0 blur-0'}`}>{renderStepContent()}</div>
        {(isTransitioning || isFinalizing || isLoading) && (
          <ProtocolSyncOverlay 
            message={isFinalizing ? "Recording_Handshake..." : isLoading ? "Processing_Signal..." : "Synchronizing..."} 
          />
        )}
      </div>
    </div>
  );
};

export default ProjectAssessmentHub;