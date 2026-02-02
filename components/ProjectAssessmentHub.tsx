import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Zap, ArrowRight, Loader2, ShieldCheck, Network, Mail, Fingerprint, Activity, X, ShieldAlert, Check, MessageSquare, Calendar, Video, Cpu, FileText, Database, Target, Linkedin, Smartphone, Info, Clock, AlertCircle, FileCode, PlayCircle, Presentation, Lock, Terminal, Sparkles, Timer, RefreshCw, XCircle, AlertTriangle, User, Globe, Share2, Headphones, Layers, Binary, Bot, CheckCircle2, Shield,
  ArrowUpRight, Upload, CheckCircle, Send, BookOpen, Phone, Eye
} from 'lucide-react';
import { validateStep, checkSchedulingWindow, normalizePhone, isValidE164 } from '../core/validation';
import { usePrivy } from '@privy-io/react-auth';
import SuraSidebarAgent from './SuraSidebarAgent';

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
  const { login, authenticated, user } = usePrivy();
  const [currentStep, setCurrentStep] = useState<Step>('audit_protocol');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blockingReasons, setBlockingReasons] = useState<string[]>([]);
  const [ustTime, setUstTime] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
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

  useEffect(() => {
    const handleStartAudit = () => {
      setCurrentStep('audit_protocol');
      setErrors({});
      setBlockingReasons([]);
      setIsLoading(false);
      setIsTransitioning(false);
      setIsFinalizing(false);
    };

    window.addEventListener('start-audit-protocol', handleStartAudit);
    return () => window.removeEventListener('start-audit-protocol', handleStartAudit);
  }, []);

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
      case 'audit_protocol':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="mb-6 sm:mb-12 border-l-[6px] sm:border-l-[10px] border-decensat pl-4 sm:pl-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shrink-0">
                   <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-decensat" />
                </div>
                <div>
                  <h3 className="text-xl xs:text-2xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-1.5 sm:mb-2 text-glow-lime">Audit <span className="text-decensat italic">Protocol</span></h3>
                  <p className="text-slate-500 font-bold uppercase text-[7px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em]">STATE: READY_FOR_ASSESSMENT</p>
                </div>
              </div>
            </div>

            <p className="text-sm xs:text-base sm:text-2xl text-slate-400 font-bold uppercase tracking-tight max-w-3xl mb-10 xs:mb-14 border-l-4 border-white/10 pl-4 sm:pl-10 ml-1 sm:ml-2 italic leading-relaxed">
              Let's start your assessment by understanding your goals
            </p>
            <button 
              disabled={isLoading}
              onClick={handleNext} 
              className="w-full sm:w-fit px-8 xs:px-10 sm:px-16 py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-5 sm:gap-10 active:scale-95 ml-1 sm:ml-2 transform-gpu disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'START_ASSESSMENT'} 
              {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
            </button>
          </div>
        );

      case 'goals_and_video':
        return (
          <div className="space-y-8 sm:space-y-12 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="space-y-2">
              <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">What are <span className="text-decensat not-italic">your goals?</span></h3>
              <p className="text-[10px] xs:text-xs sm:text-xl text-slate-500 font-bold uppercase tracking-tight">Tell us about your objectives and share a video</p>
            </div>
            <div className="relative">
               <textarea 
                disabled={isLoading}
                value={String(submission.goals)}
                onChange={(e) => { setSubmission({...submission, goals: e.target.value}); setErrors({}); }}
                placeholder="Describe your goals and what you want to achieve..."
                className={`w-full min-h-[180px] xs:min-h-[220px] sm:min-h-[350px] bg-black/40 border-[2px] sm:border-[3px] rounded-[1.5rem] sm:rounded-[4rem] p-6 xs:p-8 sm:p-14 text-sm xs:text-base sm:text-3xl font-bold placeholder:text-slate-800 focus:outline-none transition-all uppercase tracking-tight leading-relaxed ${errors.goals ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5 focus:border-decensat/30'} disabled:opacity-50`}
              />
              {errors.goals && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase mt-4 ml-6 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.goals)}</p>}
            </div>
            <div className="space-y-4">
              <input 
                disabled={isLoading}
                type="url" 
                value={String(submission.videoLink)}
                onChange={(e) => { setSubmission({...submission, videoLink: e.target.value}); setErrors({}); }}
                placeholder="Video Link (YouTube, Loom, etc.)"
                className={`w-full bg-black/40 border-[2px] sm:border-[3px] rounded-xl sm:rounded-2xl p-4 xs:p-6 sm:p-8 text-sm xs:text-base sm:text-xl font-mono placeholder:text-slate-800 focus:outline-none transition-all ${errors.videoLink ? 'border-rose-500/40' : 'border-white/5 focus:border-decensat/30'} disabled:opacity-50`}
              />
              {errors.videoLink && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase ml-6 flex items-center gap-2"><AlertCircle size={14}/> {String(errors.videoLink)}</p>}
            </div>
            <div className="space-y-4">
              <label className="block text-[9px] sm:text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                Upload files (optional)
              </label>
              <input
                disabled={isLoading}
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                  }));
                  setSubmission({ ...submission, uploadedFiles: files });
                }}
                className="w-full bg-black/40 border-[2px] sm:border-[3px] rounded-xl sm:rounded-2xl p-4 xs:p-6 sm:p-8 text-xs sm:text-sm font-mono text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-xs file:font-bold file:uppercase file:tracking-widest hover:file:bg-white/20 transition-all border-white/5 focus:border-decensat/30 disabled:opacity-50"
              />
              {submission.uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {submission.uploadedFiles.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] sm:text-xs text-slate-300">
                      <span className="truncate">{file.name}</span>
                      <span className="text-slate-500">{Math.ceil(file.size / 1024)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 sm:gap-6">
              <button disabled={isLoading} onClick={handleBack} className="px-5 xs:px-6 sm:px-12 py-4 sm:py-8 text-[9px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'CONTINUE'} 
                {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'privy_auth':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-1000 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12 max-w-3xl mx-auto">
             <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-40 sm:h-40 bg-white rounded-[2rem] sm:rounded-[5rem] flex items-center justify-center text-black shadow-glow-md relative overflow-hidden group">
                <Fingerprint size={48} className={`sm:size-24 ${isLoading ? 'animate-pulse' : ''}`} />
                {isLoading && <div className="absolute inset-0 bg-decensat/10 animate-scan" />}
             </div>
             <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">Secure <span className="text-decensat not-italic">Authentication</span></h3>
                <p className="text-xs xs:text-sm sm:text-2xl text-slate-400 font-bold uppercase leading-relaxed tracking-tight italic max-w-xl mx-auto">
                  Sign in with Email or Gmail to continue your assessment
                </p>
             </div>

             {!authenticated ? (
               <div className="space-y-6 w-full">
                 <button 
                   onClick={() => login()}
                   disabled={isLoading}
                   className="w-full py-5 xs:py-6 sm:py-10 bg-decensat text-black font-black uppercase text-[11px] sm:text-lg tracking-[0.4em] rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-4 sm:gap-10 active:scale-95 transform-gpu disabled:opacity-50"
                 >
                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : <Mail size={28} />}
                    {isLoading ? 'AUTHENTICATING...' : 'SIGN IN WITH PRIVY'}
                 </button>
                 <button disabled={isLoading} onClick={handleBack} className="text-[8px] sm:text-xs font-black text-slate-600 uppercase tracking-[0.4em] hover:text-white transition-colors disabled:opacity-30">Back</button>
               </div>
             ) : (
               <div className="space-y-6 w-full">
                 <div className="p-6 xs:p-8 sm:p-14 bg-black/60 border-[2px] sm:border-[3px] border-white/10 rounded-[1.8rem] sm:rounded-[4rem] w-full shadow-2xl">
                    <div className="flex items-center gap-3 sm:gap-4 text-decensat text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] mb-6 xs:mb-8 border-b border-white/5 pb-4 xs:pb-6">
                       <CheckCircle size={20} /> AUTHENTICATION_SUCCESS
                    </div>
                    <div className="flex flex-col gap-3 xs:gap-4 text-left">
                       <div className="flex justify-between items-center text-[8px] xs:text-[9px] sm:text-xs font-mono border-b border-white/5 pb-3 xs:pb-4">
                          <span className="text-slate-600 uppercase tracking-widest">EMAIL:</span>
                          <span className="text-white font-black truncate max-w-[200px]">{user?.email?.address || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between items-center text-[8px] xs:text-[9px] sm:text-xs font-mono">
                          <span className="text-slate-600 uppercase tracking-widest">STATUS:</span>
                          <span className="text-decensat font-black">VERIFIED</span>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     setSubmission(prev => ({ ...prev, email: user?.email?.address || '' }));
                     handleNext();
                   }}
                   disabled={isLoading}
                   className="w-full py-5 xs:py-6 sm:py-10 bg-decensat text-black font-black uppercase text-[11px] sm:text-lg tracking-[0.4em] rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-4 sm:gap-10 active:scale-95 transform-gpu disabled:opacity-50"
                 >
                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : 'CONTINUE'}
                    {!isLoading && <ArrowRight size={28} strokeWidth={4} />}
                 </button>
               </div>
             )}
          </div>
        );

      case 'linkedin_phone_validation':
        const phoneIsValid = isValidE164(submission.phoneNumber);
        return (
          <div className="space-y-8 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-2xl py-6 sm:py-12 mx-auto">
            <div className="space-y-3">
               <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Profile <span className="text-decensat not-italic">Verification</span></h3>
               <p className="text-slate-400 text-xs sm:text-2xl font-bold leading-relaxed uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 sm:pl-8">
                 LINKEDIN AND CONTACT INFORMATION REQUIRED
               </p>
            </div>
            <div className="space-y-5 sm:space-y-8">
              <div className="space-y-2">
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.linkedinUrl ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5"><Linkedin size={18} className="sm:size-6" /></div>
                  <input 
                    disabled={isLoading}
                    type="url" value={String(submission.linkedinUrl)} onChange={(e) => { setSubmission({...submission, linkedinUrl: e.target.value}); setErrors({}); }}
                    placeholder="LINKEDIN_PROFILE_URL"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 uppercase font-mono tracking-tight"
                  />
                </div>
                {errors.linkedinUrl && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.linkedinUrl)}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4 xs:px-6">
                  <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-600 uppercase tracking-widest">Phone_Number</label>
                  <Info size={14} className="text-slate-600 cursor-help hover:text-white transition-colors" />
                </div>
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.phoneNumber ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl flex items-center justify-center shrink-0 shadow-xl transition-all border border-white/5 ${phoneIsValid ? 'bg-decensat/20 text-decensat' : 'bg-zinc-900 text-slate-500'}`}>
                    <Smartphone size={18} className="sm:size-6" />
                  </div>
                  <input
                    disabled={isLoading}
                    type="tel"
                    value={String(submission.phoneNumber)}
                    onChange={(e) => { setSubmission({...submission, phoneNumber: normalizePhone(e.target.value)}); setErrors({}); }}
                    placeholder="+14155552671"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 font-mono tracking-tight"
                  />
                </div>
                {errors.phoneNumber && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.phoneNumber)}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 xs:py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'VALIDATE_PROFILE'} 
                {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'account_activation':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-500 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12">
            <div className="space-y-6">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-32 sm:h-32 bg-decensat/10 rounded-[1.5rem] sm:rounded-[3rem] border-2 sm:border-4 border-decensat/20 flex items-center justify-center mx-auto text-decensat shadow-3xl">
                 <CheckCircle2 size={32} className={isLoading ? 'animate-pulse sm:size-16' : 'sm:size-16'} />
              </div>
              <h3 className="text-2xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Account <span className="text-decensat">Activation</span></h3>
              <p className="text-slate-500 font-bold uppercase text-[8px] sm:text-lg tracking-[0.4em] max-w-md mx-auto leading-relaxed">Activating your profile with verified credentials</p>
            </div>
            
            <div className="space-y-8 w-full max-w-xl mx-auto">
              <div className="p-6 xs:p-8 sm:p-14 bg-black/60 border-[2px] sm:border-[3px] border-white/10 rounded-[1.8rem] sm:rounded-[4rem] shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] sm:text-sm font-mono text-slate-600 uppercase tracking-widest">LinkedIn</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-decensat" size={16} />
                      <span className="text-[10px] sm:text-sm font-black text-decensat uppercase">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] sm:text-sm font-mono text-slate-600 uppercase tracking-widest">Phone</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-decensat" size={16} />
                      <span className="text-[10px] sm:text-sm font-black text-decensat uppercase">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-sm font-mono text-slate-600 uppercase tracking-widest">Email</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-decensat" size={16} />
                      <span className="text-[10px] sm:text-sm font-black text-decensat uppercase">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              disabled={isLoading} 
              onClick={handleNext} 
              className="w-full max-w-xl py-5 xs:py-6 sm:py-10 bg-decensat text-black font-black uppercase text-[11px] sm:text-lg tracking-[0.4em] rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-4 sm:gap-10 active:scale-95 transform-gpu disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={28} /> : <ShieldCheck size={28} />}
              {isLoading ? 'ACTIVATING...' : 'ACTIVATE_ACCOUNT'}
            </button>
          </div>
        );

      case 'google_meet_booking':
        return (
          <div className="space-y-8 xs:space-y-10 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-5xl py-6 sm:py-12 mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Book <span className="text-decensat not-italic">Meeting</span></h3>
                <div className="bg-black/80 border border-white/10 px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 xs:gap-3 sm:gap-4 shadow-3xl">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-decensat animate-pulse" />
                   <span className="text-[9px] xs:text-[10px] sm:text-sm font-mono font-black text-white uppercase tracking-widest">{String(ustTime || '')} UST</span>
                </div>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-2xl text-slate-500 font-bold uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 xs:pl-5 sm:pl-8">Schedule your Google Meet consultation</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 xs:gap-8 lg:gap-16">
               <div className="lg:col-span-7 space-y-4 xs:space-y-6">
                  <div className={`p-6 xs:p-8 sm:p-14 bg-black/40 border-[2px] sm:border-[3px] rounded-[1.8rem] sm:rounded-[4rem] space-y-6 sm:space-y-8 transition-all ${errors.meeting ? 'border-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                     <div className="space-y-3 sm:space-y-4">
                        <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] px-3 flex items-center justify-between">
                           <span className="flex items-center gap-2 xs:gap-3"><Calendar size={16} className="text-decensat" /> Select Date & Time (UST)</span>
                        </label>
                        <div className="relative group">
                           <input 
                              disabled={isLoading}
                              type="datetime-local" 
                              min={String(earliestAllowedDate)}
                              step="1800"
                              value={submission.meetingDate ? `${submission.meetingDate}T${submission.meetingTime || ''}` : ''}
                              className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-10 text-white font-mono text-[10px] xs:text-sm sm:text-xl outline-none transition-all appearance-none cursor-pointer hover:bg-white/5 ${errors.meeting ? 'border-rose-500/40 text-rose-500 shadow-inner' : 'border-white/10 focus:border-decensat/40 shadow-inner'} disabled:opacity-50`}
                              onChange={(e) => {
                                 const dateTime = e.target.value;
                                 if (dateTime) {
                                   const [date, time] = dateTime.split('T');
                                   setSubmission({...submission, meetingDate: date, meetingTime: time});
                                   setErrors({});
                                 }
                              }}
                           />
                           <Calendar className="absolute right-6 xs:right-8 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none group-focus-within:text-decensat transition-colors sm:size-8" size={24} />
                        </div>
                        {errors.meeting && (
                          <div className="p-4 xs:p-5 sm:p-8 bg-rose-500/5 border-2 border-rose-500/20 rounded-xl xs:rounded-2xl sm:rounded-3xl animate-in shake duration-500">
                             <p className="text-rose-500 text-[9px] xs:text-[10px] sm:text-sm font-black uppercase flex items-center gap-3 italic leading-tight">
                                <AlertCircle size={18} className="shrink-0" /> {String(errors.meeting)}
                             </p>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="p-5 xs:p-6 sm:p-10 bg-decensat/5 border-2 border-decensat/10 rounded-[1.5rem] sm:rounded-[3rem] space-y-2 xs:space-y-3 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Video size={100} /></div>
                     <div className="flex items-center gap-2 xs:gap-3 text-decensat relative z-10 font-black">
                        <Video size={18} className="animate-pulse" />
                        <span className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.4em]">Google Meet Link Will Be Sent</span>
                     </div>
                     <p className="text-[8px] xs:text-[9px] sm:text-sm text-slate-500 font-bold leading-relaxed uppercase tracking-tight italic relative z-10">You'll receive a Google Meet invitation after booking confirmation.</p>
                  </div>
               </div>

               <div className="lg:col-span-5 space-y-4 xs:space-y-6">
                  <div className="bg-black/60 border border-white/10 rounded-[1.8rem] sm:rounded-[4rem] p-6 xs:p-8 sm:p-14 h-full shadow-3xl">
                     <h5 className="text-[8px] xs:text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 xs:mb-8 border-b border-white/5 pb-4 xs:pb-6 flex items-center gap-2 xs:gap-3">
                        <Clock size={16} className="text-blue-500" /> Available_Hours (UST)
                     </h5>
                     <ul className="space-y-3 sm:space-y-6 relative z-10">
                        {[
                           { label: 'M — F', time: '9:00 AM – 6:00 PM', status: 'Core' },
                           { label: 'SAT', time: '12:00 PM – 5:00 PM', status: 'Limited' },
                           { label: 'SUN', time: 'By Appointment', status: 'Special' }
                        ].map((item, i) => (
                           <li key={i} className="flex flex-col gap-0.5 sm:gap-2 pb-3 xs:pb-4 sm:pb-6 border-b border-white/5 last:border-0 group/row">
                              <div className="flex justify-between items-center">
                                 <span className="text-[9px] xs:text-[10px] sm:text-xs font-black text-white uppercase group-hover/row:text-decensat transition-colors">{String(item.label)}</span>
                                 <span className={`text-[6px] xs:text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded border transition-colors border-decensat/30 text-decensat`}>{String(item.status)}</span>
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
                 disabled={!submission.meetingDate || !submission.meetingTime || isLoading || isFinalizing} 
                 className={`flex-1 py-4 xs:py-5 sm:py-8 rounded-[1.2rem] sm:rounded-[2.5rem] font-black text-[10px] sm:text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-glow-md transform-gpu ${(!submission.meetingDate || !submission.meetingTime || isLoading) ? 'bg-zinc-900 text-slate-700 cursor-not-allowed grayscale border border-white/5' : 'bg-decensat text-black hover:bg-white'}`}
              >
                 {(isFinalizing || isLoading) ? <Loader2 className="animate-spin" size={24} /> : <Calendar size={24} strokeWidth={3} />}
                 {isLoading ? 'BOOKING...' : 'BOOK_MEETING'}
              </button>
            </div>
          </div>
        );

      case 'confirmation_email':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-1000 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12">
            <div className="space-y-6">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-32 sm:h-32 bg-decensat/10 rounded-[1.5rem] sm:rounded-[3rem] border-2 sm:border-4 border-decensat/20 flex items-center justify-center mx-auto text-decensat shadow-3xl animate-pulse">
                 <Send size={32} className="sm:size-16" />
              </div>
              <h3 className="text-2xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Email <span className="text-decensat">Confirmation</span></h3>
              <p className="text-slate-500 font-bold uppercase text-[8px] sm:text-lg tracking-[0.4em] max-w-md mx-auto leading-relaxed">Sending meeting confirmation to your email</p>
            </div>
            
            <div className="space-y-8 w-full max-w-2xl mx-auto">
              <div className="p-6 xs:p-8 sm:p-14 bg-black/60 border-[2px] sm:border-[3px] border-white/10 rounded-[1.8rem] sm:rounded-[4rem] shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 justify-center text-decensat">
                    <Mail size={24} />
                    <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest">Email Sent Successfully</span>
                  </div>
                  <div className="border-t border-white/5 pt-6 space-y-4 text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-sm font-mono">
                      <span className="text-slate-600 uppercase">To:</span>
                      <span className="text-white font-black">{submission.email}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-sm font-mono">
                      <span className="text-slate-600 uppercase">Meeting Date:</span>
                      <span className="text-white font-black">{submission.meetingDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] sm:text-sm font-mono">
                      <span className="text-slate-600 uppercase">Meeting Time:</span>
                      <span className="text-white font-black">{submission.meetingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-5 xs:p-6 sm:p-10 bg-blue-500/10 border-2 border-blue-500/20 rounded-[1.5rem] sm:rounded-[3rem]">
                <p className="text-[8px] xs:text-[9px] sm:text-sm text-blue-400 font-bold leading-relaxed uppercase tracking-tight italic">
                  Google Meet link has been sent to your email. Check your inbox!
                </p>
              </div>
            </div>

            <div className="text-[10px] sm:text-sm font-mono text-slate-600 uppercase tracking-widest animate-pulse">
              Redirecting to Sura Agent in 2 seconds...
            </div>
          </div>
        );

      case 'chat_box':
        return (
          <div className="h-full w-full max-w-7xl mx-auto">
            <SuraSidebarAgent />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="project-assessment" className="min-h-0 bg-[#020617] flex flex-col relative overflow-hidden py-10 xs:py-16 sm:py-24 px-4 sm:px-12 max-w-[1920px] mx-auto w-full">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />

      {currentStep !== 'chat_box' && currentStep !== 'confirmation_email' && (
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