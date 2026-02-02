import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Zap, ArrowRight, Loader2, ShieldCheck, Network, Mail, Fingerprint, Activity, X, ShieldAlert, Check, MessageSquare, Calendar, Video, Cpu, FileText, Database, Target, Linkedin, Smartphone, Info, Clock, AlertCircle, FileCode, PlayCircle, Presentation, Lock, Terminal, Sparkles, Timer, RefreshCw, XCircle, AlertTriangle, User, Globe, Share2, Headphones, Layers, Binary, Bot, CheckCircle2, Shield,
  ArrowUpRight, Upload, CheckCircle, Send, BookOpen, Phone, Eye, UserCheck, Link2
} from 'lucide-react';

// NEW FLOW - All steps in the new flow
type Step = 'audit_protocol' | 'goals_and_video' | 'privy_auth' | 'linkedin_phone_validation' | 'account_activation' | 'google_meet_booking' | 'confirmation_email' | 'chat_box';
const STEPS: Step[] = ['audit_protocol', 'goals_and_video', 'privy_auth', 'linkedin_phone_validation', 'account_activation', 'google_meet_booking', 'confirmation_email', 'chat_box'];

/* OLD FLOW - COMMENTED OUT - NO LONGER IN USE
type Step = 'initiation' | 'intent' | 'materials' | 'identity' | 'verification' | 'privy_handshake' | 'scheduling' | 'summary';
const STEPS: Step[] = ['initiation', 'intent', 'materials', 'identity', 'verification', 'privy_handshake', 'scheduling', 'summary'];
*/

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ustTime, setUstTime] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{from: string, message: string, time: string}>>([
    {from: 'support', message: 'Welcome! How can we help you today?', time: new Date().toLocaleTimeString()}
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [submission, setSubmission] = useState({
    // NEW FLOW FIELDS
    goals: '',
    videoLink: '',
    loomLink: '',
    uploadedFiles: [] as Array<{ name: string; size: number; type: string }>,
    email: '',
    linkedinUrl: '',
    phoneNumber: '',
    linkedinValidated: false,
    phoneValidated: false,
    accountActivated: false,
    meetingDate: '',
    meetingTime: '',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    emailConfirmationSent: false,
  });

  const activeStepIndex = STEPS.indexOf(currentStep);

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

  const handleNext = async () => {
    // Validation for each step
    if (currentStep === 'goals_and_video') {
      if (!submission.goals.trim()) {
        setErrors({ goals: '[!] ERROR: Goals description is required' });
        return;
      }
      if (!submission.videoLink.trim() && !submission.loomLink.trim()) {
        setErrors({ videoLink: '[!] ERROR: Video link or Loom link is required' });
        return;
      }
    }

    if (currentStep === 'privy_auth') {
      if (!submission.email.trim() || !submission.email.includes('@')) {
        setErrors({ email: '[!] ERROR: Valid email is required for authentication' });
        return;
      }
    }

    if (currentStep === 'linkedin_phone_validation') {
      if (!submission.linkedinUrl.trim() || !submission.linkedinUrl.includes('linkedin.com')) {
        setErrors({ linkedinUrl: '[!] ERROR: Valid LinkedIn profile URL is required' });
        return;
      }
      if (!submission.phoneNumber.trim() || submission.phoneNumber.length < 10) {
        setErrors({ phoneNumber: '[!] ERROR: Valid phone number is required' });
        return;
      }
    }

    if (currentStep === 'google_meet_booking') {
      if (!submission.meetingDate || !submission.meetingTime) {
        setErrors({ meeting: '[!] ERROR: Please select both date and time for the meeting' });
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
        // Simulate Privy authentication delay
        await new Promise(r => setTimeout(r, 1500));
        setIsAuthenticated(true);
      }
      
      if (nextStep === 'account_activation') {
        // Simulate validation success
        await new Promise(r => setTimeout(r, 1000));
        setSubmission(prev => ({ ...prev, linkedinValidated: true, phoneValidated: true, accountActivated: true }));
      }

      if (nextStep === 'confirmation_email') {
        // Send confirmation email (simulated)
        setSubmission(prev => ({ ...prev, emailConfirmationSent: true }));
        // Auto-proceed to chat after confirmation
        setTimeout(async () => {
          setIsTransitioning(true);
          await new Promise(r => setTimeout(r, 800));
          setCurrentStep('chat_box');
          setIsTransitioning(false);
        }, 3000);
      }
      
      setIsTransitioning(false);
    }

    setIsLoading(false);
  };

  const handleBack = async () => {
    if (activeStepIndex > 0) {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 400));
      setCurrentStep(STEPS[activeStepIndex - 1]);
      setErrors({});
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
          message: 'Thanks for your message! Our team will review your inquiry and get back to you shortly. Your meeting is confirmed for ' + (submission.meetingDate ? new Date(submission.meetingDate + ' ' + submission.meetingTime).toLocaleString() : 'the scheduled time') + '.',
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
              Welcome to our comprehensive audit process. We'll guide you through each step to understand your project goals and schedule a strategy session.
            </p>
            
            <button 
              disabled={isLoading}
              onClick={handleNext} 
              className="w-full sm:w-fit px-8 xs:px-10 sm:px-16 py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-5 sm:gap-10 active:scale-95 ml-1 sm:ml-2 transform-gpu disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'BEGIN_ASSESSMENT'} 
              {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
            </button>
          </div>
        );

      case 'goals_and_video':
        return (
          <div className="space-y-8 sm:space-y-12 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="space-y-2">
              <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">What Are <span className="text-decensat not-italic">Your Goals?</span></h3>
              <p className="text-[10px] xs:text-xs sm:text-xl text-slate-500 font-bold uppercase tracking-tight">Tell us about your project and share video/documents.</p>
            </div>

            <div className="relative">
               <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3 block">Project Goals & Objectives</label>
               <textarea 
                disabled={isLoading}
                value={String(submission.goals)}
                onChange={(e) => { setSubmission({...submission, goals: e.target.value}); setErrors({}); }}
                placeholder="Describe your project goals, objectives, and what you hope to achieve..."
                className={`w-full min-h-[180px] xs:min-h-[220px] sm:min-h-[300px] bg-black/40 border-[2px] sm:border-[3px] rounded-[1.5rem] sm:rounded-[3rem] p-6 xs:p-8 sm:p-12 text-sm xs:text-base sm:text-2xl font-bold placeholder:text-slate-800 focus:outline-none transition-all tracking-tight leading-relaxed ${errors.goals ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5 focus:border-decensat/30'} disabled:opacity-50`}
              />
              {errors.goals && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase mt-4 ml-6 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.goals)}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Video size={16} className="text-decensat" /> Loom/Video Link
                </label>
                <input 
                  disabled={isLoading}
                  type="url" 
                  value={String(submission.loomLink)}
                  onChange={(e) => { setSubmission({...submission, loomLink: e.target.value}); setErrors({}); }}
                  placeholder="https://loom.com/share/..."
                  className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white font-mono text-[10px] xs:text-sm sm:text-lg focus:outline-none transition-all ${errors.videoLink ? 'border-rose-500/40' : 'border-white/10 focus:border-decensat/40'} disabled:opacity-50`}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Link2 size={16} className="text-blue-500" /> Alternative Video Link
                </label>
                <input 
                  disabled={isLoading}
                  type="url" 
                  value={String(submission.videoLink)}
                  onChange={(e) => { setSubmission({...submission, videoLink: e.target.value}); setErrors({}); }}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-black border-2 border-white/10 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white font-mono text-[10px] xs:text-sm sm:text-lg focus:outline-none focus:border-decensat/40 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {errors.videoLink && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase ml-6 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.videoLink)}</p>}

            <div className="space-y-3">
              <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <Upload size={16} className="text-emerald-500" /> File Uploads (Optional)
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                  disabled={isLoading}
                />
                <label 
                  htmlFor="fileUpload"
                  className="w-full bg-black/40 border-2 border-dashed border-white/10 rounded-xl xs:rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-decensat/40 transition-all"
                >
                  <Upload size={32} className="text-slate-600" />
                  <span className="text-slate-500 text-xs sm:text-base font-bold uppercase">Click to upload documents</span>
                </label>
              </div>
              {submission.uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {submission.uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-3">
                      <FileText size={16} className="text-decensat" />
                      <span className="text-xs text-slate-300 font-mono flex-1 truncate">{file.name}</span>
                      <span className="text-[9px] text-slate-600 font-mono">{(file.size / 1024).toFixed(1)}KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 xs:py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
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
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">Privy <span className="text-decensat not-italic">Authentication</span></h3>
                <p className="text-xs xs:text-sm sm:text-2xl text-slate-400 font-bold uppercase leading-relaxed tracking-tight italic max-w-xl mx-auto">
                  Authenticate with your email or Gmail to proceed
                </p>
             </div>

             <div className="w-full space-y-4">
                <div className="space-y-2">
                  <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.email ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                    <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5"><Mail size={18} className="sm:size-6" /></div>
                    <input 
                      disabled={isLoading}
                      type="email" 
                      value={String(submission.email)} 
                      onChange={(e) => { setSubmission({...submission, email: e.target.value}); setErrors({}); }}
                      placeholder="YOUR_EMAIL@EXAMPLE.COM"
                      className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 uppercase font-mono tracking-tight"
                    />
                  </div>
                  {errors.email && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.email)}</p>}
                </div>

                {isAuthenticated && (
                  <div className="flex items-center justify-center gap-3 text-decensat animate-in slide-in-from-top-2 bg-decensat/10 border border-decensat/30 rounded-xl p-4">
                     <CheckCircle size={20} />
                     <span className="text-sm font-black uppercase tracking-wider">Authenticated Successfully</span>
                  </div>
                )}
             </div>

             <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-6 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button 
                onClick={handleNext}
                disabled={isLoading || !submission.email}
                className="flex-1 py-4 xs:py-6 sm:py-10 bg-decensat text-black font-black uppercase text-[11px] sm:text-lg tracking-[0.4em] rounded-[1.5rem] sm:rounded-[3rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-4 sm:gap-10 active:scale-95 transform-gpu disabled:opacity-50 disabled:bg-zinc-900 disabled:text-slate-700"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={28} /> : <Zap size={28} />}
                 {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
              </button>
             </div>
          </div>
        );

      case 'linkedin_phone_validation':
        return (
          <div className="space-y-8 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-2xl py-6 sm:py-12 mx-auto">
            <div className="space-y-3">
               <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Validate <span className="text-decensat not-italic">Identity</span></h3>
               <p className="text-slate-400 text-xs sm:text-2xl font-bold leading-relaxed uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 sm:pl-8">
                 LinkedIn & Phone Verification Required
               </p>
            </div>
            
            <div className="space-y-5 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-500" /> LinkedIn Profile URL
                </label>
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.linkedinUrl ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5"><Linkedin size={18} className="sm:size-6" /></div>
                  <input 
                    disabled={isLoading}
                    type="url" 
                    value={String(submission.linkedinUrl)} 
                    onChange={(e) => { setSubmission({...submission, linkedinUrl: e.target.value}); setErrors({}); }}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 font-mono tracking-tight"
                  />
                </div>
                {errors.linkedinUrl && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.linkedinUrl)}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Phone size={16} className="text-emerald-500" /> Phone Number
                </label>
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.phoneNumber ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5">
                    <Smartphone size={18} className="sm:size-6" />
                  </div>
                  <input
                    disabled={isLoading}
                    type="tel"
                    value={String(submission.phoneNumber)}
                    onChange={(e) => { setSubmission({...submission, phoneNumber: e.target.value}); setErrors({}); }}
                    placeholder="+1 (555) 000-0000"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 font-mono tracking-tight"
                  />
                </div>
                {errors.phoneNumber && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.phoneNumber)}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="flex-1 py-4 xs:py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-3 sm:gap-4 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'VALIDATE'} 
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
                 {submission.accountActivated ? (
                   <CheckCircle2 size={32} className="sm:size-16 animate-in zoom-in-50" />
                 ) : (
                   <UserCheck size={32} className={isLoading ? 'animate-pulse sm:size-16' : 'sm:size-16'} />
                 )}
              </div>
              <h3 className="text-2xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Account <span className="text-decensat">Activation</span></h3>
              <p className="text-slate-500 font-bold uppercase text-[8px] sm:text-lg tracking-[0.4em] max-w-md mx-auto leading-relaxed">
                {submission.accountActivated 
                  ? 'Your account has been successfully activated!' 
                  : 'Validating your credentials and activating your account...'}
              </p>
            </div>
            
            {submission.linkedinValidated && submission.phoneValidated && (
              <div className="space-y-4 w-full max-w-lg">
                <div className="flex items-center gap-4 p-4 bg-decensat/10 border border-decensat/30 rounded-xl">
                  <CheckCircle size={20} className="text-decensat shrink-0" />
                  <span className="text-sm font-bold text-slate-300">LinkedIn profile validated</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-decensat/10 border border-decensat/30 rounded-xl">
                  <CheckCircle size={20} className="text-decensat shrink-0" />
                  <span className="text-sm font-bold text-slate-300">Phone number validated</span>
                </div>
                {submission.accountActivated && (
                  <div className="flex items-center gap-4 p-4 bg-decensat border border-decensat rounded-xl animate-in zoom-in-95">
                    <CheckCircle2 size={20} className="text-black shrink-0" />
                    <span className="text-sm font-black text-black uppercase tracking-wider">Account Activated</span>
                  </div>
                )}
              </div>
            )}

            <button 
              disabled={isLoading || !submission.accountActivated} 
              onClick={handleNext} 
              className="w-full max-w-lg py-5 xs:py-7 sm:py-9 bg-decensat text-black rounded-2xl xs:rounded-3xl font-black text-[10px] xs:text-xs sm:text-base uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-glow-md active:scale-95 transform-gpu disabled:opacity-50 disabled:bg-zinc-900 disabled:text-slate-700"
            >
               {isLoading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} strokeWidth={4} />}
               {isLoading ? 'ACTIVATING...' : 'CONTINUE_TO_BOOKING'}
            </button>
          </div>
        );

      case 'google_meet_booking':
        return (
          <div className="space-y-8 xs:space-y-10 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-5xl py-6 sm:py-12 mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Book Your <span className="text-decensat not-italic">Meeting</span></h3>
                <div className="bg-black/80 border border-white/10 px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 xs:gap-3 sm:gap-4 shadow-3xl">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-decensat animate-pulse" />
                   <span className="text-[9px] xs:text-[10px] sm:text-sm font-mono font-black text-white uppercase tracking-widest">{String(ustTime || '')} UST</span>
                </div>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-2xl text-slate-500 font-bold uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 xs:pl-5 sm:pl-8">Schedule a Google Meet strategy session</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 xs:gap-8">
               <div className="space-y-4 xs:space-y-6">
                  <div className="space-y-3">
                     <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Calendar size={16} className="text-decensat" /> Select Date
                     </label>
                     <input 
                        disabled={isLoading}
                        type="date" 
                        min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                        value={submission.meetingDate}
                        onChange={(e) => { setSubmission({...submission, meetingDate: e.target.value}); setErrors({}); }}
                        className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl p-5 xs:p-6 text-white font-mono text-sm sm:text-lg outline-none transition-all ${errors.meeting ? 'border-rose-500/40' : 'border-white/10 focus:border-decensat/40'} disabled:opacity-50`}
                     />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" /> Select Time
                     </label>
                     <input 
                        disabled={isLoading}
                        type="time" 
                        value={submission.meetingTime}
                        onChange={(e) => { setSubmission({...submission, meetingTime: e.target.value}); setErrors({}); }}
                        className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl p-5 xs:p-6 text-white font-mono text-sm sm:text-lg outline-none transition-all ${errors.meeting ? 'border-rose-500/40' : 'border-white/10 focus:border-decensat/40'} disabled:opacity-50`}
                     />
                  </div>

                  {errors.meeting && (
                    <div className="p-4 xs:p-5 bg-rose-500/5 border-2 border-rose-500/20 rounded-xl animate-in shake duration-500">
                       <p className="text-rose-500 text-[9px] xs:text-[10px] sm:text-sm font-black uppercase flex items-center gap-3 italic leading-tight">
                          <ShieldAlert size={18} className="shrink-0" /> {String(errors.meeting)}
                       </p>
                    </div>
                  )}
               </div>

               <div className="bg-black/60 border border-white/10 rounded-[1.8rem] p-6 xs:p-8 sm:p-10 h-full shadow-3xl">
                  <h5 className="text-[8px] xs:text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                     <Video size={16} className="text-decensat" /> Meeting Details
                  </h5>
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-decensat shrink-0 mt-1" />
                        <div>
                           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Date</div>
                           <div className="text-sm text-white font-mono">{submission.meetingDate || 'Not selected'}</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <Clock size={18} className="text-blue-500 shrink-0 mt-1" />
                        <div>
                           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Time</div>
                           <div className="text-sm text-white font-mono">{submission.meetingTime || 'Not selected'}</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <Video size={18} className="text-emerald-500 shrink-0 mt-1" />
                        <div>
                           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Platform</div>
                           <div className="text-sm text-white font-bold">Google Meet</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6">
              <button disabled={isLoading} onClick={handleBack} className="px-6 xs:px-8 sm:px-14 py-4 xs:py-5 sm:py-8 text-[10px] sm:text-sm font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button 
                 onClick={handleNext} 
                 disabled={!submission.meetingDate || !submission.meetingTime || isLoading} 
                 className="flex-1 py-4 xs:py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-sm tracking-[0.4em] rounded-[1.2rem] sm:rounded-[2.5rem] shadow-glow-md flex items-center justify-center gap-4 sm:gap-6 active:scale-95 transition-all disabled:opacity-50 disabled:bg-zinc-900 disabled:text-slate-700"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} strokeWidth={3} />}
                 {isLoading ? 'BOOKING...' : 'CONFIRM_BOOKING'}
              </button>
            </div>
          </div>
        );

      case 'confirmation_email':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-500 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12">
            <div className="space-y-6">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-32 sm:h-32 bg-decensat rounded-[1.5rem] sm:rounded-[3rem] border-2 sm:border-4 border-black flex items-center justify-center mx-auto text-black shadow-glow-md animate-in zoom-in-50">
                 <Send size={32} className="sm:size-16" />
              </div>
              <h3 className="text-2xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Confirmation <span className="text-decensat">Sent!</span></h3>
              <p className="text-slate-500 font-bold uppercase text-[8px] sm:text-lg tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
                Meeting confirmation emails have been sent to both you and our team
              </p>
            </div>
            
            <div className="space-y-4 w-full max-w-2xl">
              <div className="p-6 xs:p-8 bg-black/60 border border-white/10 rounded-xl sm:rounded-2xl space-y-6">
                 <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                    <Mail size={24} className="text-decensat" />
                    <div className="text-left flex-1">
                       <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Sent To</div>
                       <div className="text-sm font-mono text-white break-all">{submission.email}</div>
                    </div>
                    <CheckCircle size={20} className="text-decensat shrink-0" />
                 </div>

                 <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                       <Calendar size={18} className="text-decensat shrink-0 mt-1" />
                       <div className="flex-1">
                          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Meeting Date</div>
                          <div className="text-sm text-white font-mono">{submission.meetingDate && new Date(submission.meetingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <Clock size={18} className="text-blue-500 shrink-0 mt-1" />
                       <div className="flex-1">
                          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Time</div>
                          <div className="text-sm text-white font-mono">{submission.meetingTime}</div>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <Video size={18} className="text-emerald-500 shrink-0 mt-1" />
                       <div className="flex-1">
                          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Google Meet Link</div>
                          <a href={submission.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-decensat font-mono hover:underline break-all">{submission.meetingLink}</a>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-decensat/10 border border-decensat/30 rounded-xl flex items-center gap-3">
                 <Info size={18} className="text-decensat shrink-0" />
                 <p className="text-xs text-slate-300 font-bold text-left">You will be redirected to our chat shortly to answer any questions...</p>
              </div>
            </div>

            <div className="text-[8px] sm:text-xs font-mono text-slate-600 uppercase tracking-wider animate-pulse">
              Redirecting to chat in 3 seconds...
            </div>
          </div>
        );

      case 'chat_box':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-1000 h-full flex flex-col justify-center py-6 sm:py-10 max-w-5xl mx-auto w-full">
            <div className="mb-6 sm:mb-10 text-center space-y-4">
               <h3 className="text-2xl xs:text-3xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Chat With <span className="text-decensat not-italic">Us</span></h3>
               <p className="text-[10px] sm:text-lg text-slate-500 font-bold uppercase tracking-tight">Ask any questions while you wait for your meeting</p>
            </div>

            <div className="bg-zinc-950 border-[2px] sm:border-[4px] border-white/5 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-3xl flex flex-col h-[500px] sm:h-[600px]">
               <div className="flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-decensat/10 flex items-center justify-center">
                        <MessageSquare size={20} className="text-decensat sm:size-6" />
                     </div>
                     <div>
                        <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight">Support Team</div>
                        <div className="flex items-center gap-2 mt-0.5">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[8px] sm:text-[10px] text-emerald-500 font-bold uppercase">Online</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-[9px] sm:text-xs font-mono text-slate-600 uppercase tracking-wider">{ustTime}</div>
               </div>

               <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                       <div className={`max-w-[75%] p-4 sm:p-6 rounded-2xl ${msg.from === 'user' ? 'bg-decensat text-black' : 'bg-white/5 text-white border border-white/10'}`}>
                          <div className="text-sm sm:text-base font-bold">{msg.message}</div>
                          <div className={`text-[8px] sm:text-[10px] font-mono mt-2 ${msg.from === 'user' ? 'text-black/60' : 'text-slate-600'}`}>{msg.time}</div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="border-t border-white/10 p-4 sm:p-6 bg-black/40">
                  <div className="flex gap-3">
                     <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/5 border-2 border-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:border-decensat/40 transition-all"
                     />
                     <button 
                        onClick={handleSendChatMessage}
                        className="px-6 sm:px-10 py-3 sm:py-4 bg-decensat text-black rounded-xl font-black uppercase text-xs sm:text-sm tracking-wider hover:bg-white transition-all active:scale-95 flex items-center gap-2"
                     >
                        <Send size={18} />
                        <span className="hidden sm:inline">Send</span>
                     </button>
                  </div>
               </div>
            </div>

            <div className="mt-6 sm:mt-10 flex justify-center">
               <button 
                onClick={() => { if (onLogin) onLogin(String(submission.email || 'user@example.com')); }}
                className="px-10 xs:px-16 py-5 xs:py-7 bg-white text-black rounded-2xl xs:rounded-3xl font-black text-[10px] xs:text-xs sm:text-base uppercase tracking-[0.4em] hover:bg-decensat transition-all flex items-center justify-center gap-4 shadow-glow-md active:scale-95 transform-gpu"
               >
                  OPEN_FULL_CONSOLE <ArrowRight size={24} strokeWidth={4} />
               </button>
            </div>
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
          {STEPS.filter(s => s !== 'confirmation_email' && s !== 'chat_box').map((s, i) => (
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
        <div className={`h-full transition-all duration-700 ease-expo transform-gpu ${isTransitioning || isLoading ? 'opacity-0 translate-y-6 blur-md' : 'opacity-100 translate-y-0 blur-0'}`}>
          {renderStepContent()}
        </div>
        {(isTransitioning || isLoading) && (
          <ProtocolSyncOverlay 
            message={isLoading ? "Processing..." : "Transitioning..."} 
          />
        )}
      </div>
    </div>
  );
};

export default ProjectAssessmentHub;
