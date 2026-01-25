import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ShieldAlert, Check, Calendar, Clock, ArrowRight, ShieldCheck, 
  Loader2, Video, AlertCircle, RefreshCw, Lock, Terminal, Activity, 
  Sparkles, Coins, Landmark, Globe, Database, Bot, Wallet, CreditCard, 
  Smartphone as ApplePayIcon, Zap, Fingerprint, Package, Link as LinkIcon,
  ChevronRight, ArrowUpRight, Shield, Key, ExternalLink, Smartphone, UserCheck,
  CreditCard as CardIcon, Apple as AppleIcon, Smartphone as GoogleIcon
} from 'lucide-react';
import { normalizePhone, isValidE164 } from '../core/validation';

/**
 * STRIPE_API_DEVELOPER_IMPLEMENTATION_NOTE:
 * The 'INSTITUTIONAL CARD' and 'MOBILE WALLETS' tabs are wired to support 
 * Stripe Elements (v4.5). To finalize, developers should:
 * 1. Generate a PaymentIntent on the backend.
 * 2. Pass the clientSecret to the handleExecuteCheckout logic below.
 * 3. Use confirmPayment() from @stripe/react-stripe-js.
 */

type BookingStep = 'confirmation' | 'privy_auth' | 'phone_ident' | 'otp_verify' | 'checkout' | 'scheduling' | 'success';

interface ServiceBookingModalProps {
  item: { id: string, name: string, title?: string, price?: number, isByo?: boolean };
  onClose: () => void;
  initialStep?: BookingStep;
}

const STRIPE_FEE_MULTIPLIER = 1.03333; // 3.333% Institutional Surcharge

const WALLET_PROVIDERS = [
  { id: 'phantom', name: 'Phantom', icon: '👻', color: 'text-purple-400' },
  { id: 'coinbase', name: 'Coinbase', icon: '🔵', color: 'text-blue-500' },
  { id: 'metamask', name: 'MetaMask', icon: '🦊', color: 'text-orange-500' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', color: 'text-indigo-400' },
  { id: 'trust', name: 'Trust', icon: '🛡️', color: 'text-blue-400' },
  { id: 'uniswap', name: 'Uniswap', icon: '🦄', color: 'text-pink-500' }
];

const UCP_RAILS = [
  { 
    id: 'privy', 
    label: 'USDC DeFi Mesh', 
    sub: 'Full DeFi Handshake', 
    icon: Fingerprint, 
    color: 'text-decensat',
    protocol: 'PRIVY_STABLE_SYNC_V1.4',
    fee: '0%',
  },
  { 
    id: 'mobile', 
    label: 'Mobile Wallets', 
    sub: 'Apple Pay & Google Pay', 
    icon: ApplePayIcon, 
    color: 'text-blue-400',
    protocol: 'STRIPE_EXPRESS_RAIL',
    fee: '3.333%'
  },
  { 
    id: 'card', 
    label: 'Institutional Card', 
    sub: 'Stripe Settlement API', 
    icon: CreditCard, 
    color: 'text-slate-400',
    protocol: 'STRIPE_LEGACY_RAIL',
    fee: '3.333%'
  }
];

const ReownIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22.9515 0.584343L23.1643 0.79155C23.1764 0.803387 23.1873 0.81643 23.1969 0.830607C23.2065 0.844783 23.2146 0.859813 23.2211 0.875618C23.2276 0.891424 23.2323 0.907694 23.2351 0.924296C23.2378 0.940899 23.2386 0.957707 23.2373 0.974465V0.974465C23.2361 1.01188 23.2435 1.04897 23.259 1.0829C23.2745 1.11684 23.2976 1.14674 23.3267 1.17036L30.9388 7.37567C31.2721 7.64741 31.464 8.04653 31.464 8.4673C31.464 8.88806 31.2721 9.28718 30.9388 9.55892L23.3267 15.7642C23.2976 15.7879 23.2745 15.8178 23.259 15.8517C23.2435 15.8856 23.2361 15.9227 23.2373 15.9601V15.9601C23.2386 15.9769 23.2378 15.9937 23.2351 16.0103C23.2323 16.0269 23.2276 16.0432 23.2211 16.059C23.2146 16.0748 23.2065 16.0898 23.1969 16.104C23.1873 16.1182 23.1764 16.1312 23.1643 16.143L22.9515 16.3503C22.6582 16.6358 22.259 16.7938 21.8441 16.7885C21.4293 16.7831 21.0336 16.6149 20.7461 16.3218L16.2941 11.7854C16.2152 11.7049 16.107 11.6596 15.9939 11.6596C15.8808 11.6596 15.7725 11.7049 15.6937 11.7854L11.2417 16.3218C10.9542 16.6149 10.5585 16.7831 10.1436 16.7885C9.72877 16.7938 9.32958 16.6358 9.03624 16.3503L8.82343 16.143C8.81134 16.1312 8.80037 16.1182 8.79079 16.104C8.78121 16.0898 8.7732 16.0748 8.76675 16.059C8.7603 16.0432 8.75554 16.0269 8.75259 16.0103C8.74965 15.9937 8.74857 15.9769 8.74939 15.9601V15.9601C8.7506 15.9227 8.74317 15.8856 8.72772 15.8517C8.71228 15.8178 8.68918 15.7879 8.66012 15.7642L1.04799 9.55892C0.714732 9.28718 0.522858 8.88806 0.522858 8.4673C0.522858 8.04653 0.714732 7.64741 1.04799 7.37567L8.66012 1.17036C8.68918 1.14674 8.71228 1.11684 8.72772 1.0829C8.74317 1.04897 8.7506 1.01188 8.74939 0.974465V0.974465C8.74857 0.957707 8.74965 0.940899 8.75259 0.924296C8.75554 0.907694 8.7603 0.891424 8.76675 0.875618C8.7732 0.859813 8.78121 0.844783 8.79079 0.830607C8.80037 0.81643 8.81134 0.803387 8.82343 0.79155L9.03624 0.584343C9.32958 0.298818 9.72877 0.140815 10.1436 0.146143C10.5585 0.15147 10.9542 0.319717 11.2417 0.612847L15.6937 5.14922C15.7725 5.22971 15.8808 5.27503 15.9939 5.27503C16.107 5.27503 16.2152 5.22971 16.2941 5.14922L20.7461 0.612847C21.0336 0.319717 21.4293 0.15147 21.8441 0.146143C22.259 0.140815 22.6582 0.298818 22.9515 0.584343Z" />
  </svg>
);

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ item, onClose, initialStep = 'confirmation' }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);
  const [isSyncing, setIsSyncing] = useState(false);
  const [handshakeConfirmed, setHandshakeConfirmed] = useState(false);
  const [selectedUcpRail, setSelectedUcpRail] = useState<string>('privy');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Stripe-specific logic states for developers
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

  const itemName = item.title || item.name;
  const basePrice = item.price || 0;
  const isByo = !!item.isByo;
  const isStripeRail = selectedUcpRail === 'card' || selectedUcpRail === 'mobile';
  const feeAmount = isStripeRail ? basePrice * (STRIPE_FEE_MULTIPLIER - 1) : 0;
  const finalPrice = basePrice + feeAmount;

  const handlePrivyConnect = async (walletId: string) => {
    setIsSyncing(true);
    // Simulation of Privy.io SDK handshake
    await new Promise(r => setTimeout(r, 2000));
    setWalletAddress(`0x${Math.random().toString(16).slice(2, 10)}...${walletId.slice(0, 4)}`);
    setIsSyncing(false);
    setCurrentStep('checkout');
  };

  const handlePhoneSubmit = async () => {
    if (!isValidE164(phone)) {
      setErrors({ phone: 'UPLINK_ERROR: Invalid E.164 sequence detected.' });
      return;
    }
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSyncing(false);
    setCurrentStep('otp_verify');
  };

  const handleOtpInput = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpVerify = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
    setCurrentStep('scheduling');
  };

  const handleExecuteCheckout = async () => {
    setIsSyncing(true);
    /**
     * DEVELOPER_STRIPE_ORCHESTRATION_LOGIC:
     * if (isStripeRail) {
     *   const stripe = await loadStripe(PUBLISHABLE_KEY);
     *   const { error } = await stripe.confirmPayment({ elements, clientSecret, ... });
     *   if (error) { ... handle ... }
     * }
     */
    await new Promise(r => setTimeout(r, 2500));
    setIsSyncing(false);
    setCurrentStep('scheduling');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0, len = val.length; i < len; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardData({ ...cardData, number: parts.join(' ').substring(0, 19) });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/gi, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + ' / ' + val.substring(2, 4);
    }
    setCardData({ ...cardData, expiry: val.substring(0, 7) });
  };

  const handleNext = () => {
    if (currentStep === 'confirmation') {
      if (!handshakeConfirmed) return;
      if (isByo) {
        setCurrentStep('phone_ident');
      } else {
        setCurrentStep('privy_auth');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="bg-[#020617] border-[2px] sm:border-[4px] border-white/10 rounded-t-[2rem] sm:rounded-[3rem] w-full max-w-6xl relative z-10 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 flex flex-col h-full sm:h-auto max-h-[100dvh] sm:max-h-[88vh]">
        
        {/* Institutional Header */}
        <div className="p-4 sm:p-6 border-b border-white/5 bg-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-decensat/10 flex items-center justify-center text-decensat border border-decensat/20">
              <Globe size={16} className={isSyncing ? 'animate-spin-slow' : ''} />
            </div>
            <div>
              <h4 className="text-white font-black text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mb-1">
                UNIVERSAL COMMERCE PROTOCOL
              </h4>
              <p className="text-[6px] sm:text-[7px] text-slate-500 font-mono uppercase font-black">
                STITCH_NODE: {item.id.toUpperCase()} // v1.4
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all bg-white/5 rounded-lg border border-white/10">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative">
          
          {currentStep === 'confirmation' && (
            <div className="min-h-full flex flex-col justify-center items-center py-10 px-6 sm:px-10 animate-in fade-in zoom-in-95 duration-1000 max-w-4xl mx-auto">
               <div className="space-y-8 sm:space-y-12 text-center w-full">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] shadow-[0_0_30px_rgba(163,230,53,0.15)] mx-auto">
                     <Lock size={12} className="animate-pulse" /> PROTOCOL_INIT
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-3xl xs:text-4xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
                      INITIATE <span className="text-decensat not-italic underline decoration-white/10 underline-offset-8 sm:underline-offset-12">SETTLEMENT</span>
                    </h3>
                    <p className="text-slate-400 text-xs xs:text-sm sm:text-2xl font-bold leading-relaxed uppercase tracking-tight italic max-w-2xl mx-auto text-center border-l-2 xs:border-l-0 border-decensat/30 pl-4 xs:pl-0">
                      ACKNOWLEDGE THE CAPITAL ALLOCATION PROTOCOL FOR {itemName.toUpperCase()}. FINALITY IS DETERMINISTIC VIA USDC DRAW.
                    </p>
                  </div>

                  <label className="flex items-start gap-4 sm:gap-6 cursor-pointer group bg-white/5 p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[3rem] border border-white/10 hover:border-decensat/40 transition-all max-w-xl mx-auto shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-decensat/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                     <input 
                         type="checkbox" 
                         checked={handshakeConfirmed}
                         onChange={(e) => setHandshakeConfirmed(e.target.checked)}
                         className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 sm:border-4 border-white/10 bg-black text-decensat focus:ring-decensat cursor-pointer appearance-none checked:bg-decensat transition-all relative after:content-[''] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white checked:after:content-['✓'] after:font-black after:text-lg sm:text-2xl shrink-0 z-10"
                     />
                     <div className="flex-1 text-left relative z-10">
                       <p className="text-[10px] sm:text-sm text-slate-300 font-bold uppercase leading-relaxed tracking-tight group-hover:text-white transition-colors italic">
                           I acknowledge the {isByo ? 'strategy triage' : 'settlement'} protocol and commit to the digital {isByo ? 'identity' : 'currency'} handshake.
                       </p>
                     </div>
                  </label>

                  <button 
                    onClick={handleNext} 
                    disabled={!handshakeConfirmed}
                    className={`w-full max-w-xl mx-auto py-6 sm:py-10 rounded-[1.5rem] sm:rounded-[3rem] font-black text-[10px] sm:text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 sm:gap-8 active:scale-95 shadow-glow-md ${
                      handshakeConfirmed ? 'bg-decensat text-black hover:bg-white' : 'bg-zinc-800 text-slate-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {isByo ? 'VERIFY_IDENTITY' : 'CONNECT_WALLETS'} <ArrowRight size={20} strokeWidth={4} />
                  </button>
               </div>
            </div>
          )}

          {currentStep === 'privy_auth' && (
            <div className="min-h-full flex flex-col justify-center py-10 px-6 sm:px-10 animate-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
              <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-[2.5rem] mx-auto flex items-center justify-center text-black shadow-glow-md relative overflow-hidden group">
                  <Fingerprint size={40} className={`text-decensat ${isSyncing ? 'animate-pulse' : ''}`} />
                  {isSyncing && <div className="absolute inset-0 bg-decensat/10 animate-scan" />}
                </div>
                <h3 className="text-2xl sm:text-5xl font-black text-white uppercase tracking-tighter italic">Privy <span className="text-decensat">Mesh_Sync</span></h3>
                <p className="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">SELECT_DEFI_UPLINK_NODE</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {WALLET_PROVIDERS.map(wallet => (
                  <button
                    key={wallet.id}
                    onClick={() => handlePrivyConnect(wallet.id)}
                    disabled={isSyncing}
                    className="p-4 sm:p-6 bg-black border-2 border-white/5 rounded-xl sm:rounded-[2rem] border-white/10 flex flex-col items-center gap-3 sm:gap-4 hover:border-decensat/40 hover:bg-decensat/5 transition-all group active:scale-95 disabled:opacity-50"
                  >
                    <div className={`text-3xl sm:text-4xl group-hover:scale-110 transition-transform ${isSyncing && 'animate-bounce'}`}>
                      {wallet.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">{wallet.name}</div>
                      <div className={`text-[6px] sm:text-[7px] font-mono font-black mt-1 uppercase ${wallet.color}`}>Protocol_Sync</div>
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentStep('checkout')}
                className="w-full py-4 border-t border-white/5 text-[9px] sm:text-[10px] font-black text-white uppercase tracking-[0.4em] hover:text-decensat transition-all flex items-center justify-center gap-2 group"
              >
                SKIP_TO_INSTITUTIONAL_SETTLEMENT <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {currentStep === 'phone_ident' && (
            <div className="min-h-full flex flex-col justify-center py-10 px-6 sm:px-10 animate-in slide-in-from-right-4 duration-500 max-w-md mx-auto text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-decensat/10 rounded-2xl sm:rounded-[2.5rem] border-2 border-decensat/30 flex items-center justify-center mx-auto text-decensat mb-8 sm:mb-12">
                <Smartphone size={28} />
              </div>
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter italic">Phone <span className="text-decensat">Uplink</span></h3>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                  Institutional 443 protocol requires a verified mobile signal for advisory allocation.
                </p>
              </div>
              <div className="relative mb-8 sm:mb-10">
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(normalizePhone(e.target.value))}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full bg-black border-2 rounded-xl px-5 py-4 text-base sm:text-lg text-white font-mono focus:border-decensat/50 outline-none transition-all ${errors.phone ? 'border-rose-500/50' : 'border-white/10'}`}
                />
                {errors.phone && <p className="text-rose-500 text-[8px] sm:text-[9px] font-black uppercase mt-3">{errors.phone}</p>}
              </div>
              <button 
                onClick={handlePhoneSubmit}
                disabled={isSyncing}
                className="w-full py-5 sm:py-6 bg-decensat text-black rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.4em] shadow-glow-md hover:bg-white active:scale-95 transition-all"
              >
                {isSyncing ? <Loader2 className="animate-spin mx-auto" /> : 'TRANSMIT_OTP_SIGNAL'}
              </button>
            </div>
          )}

          {currentStep === 'otp_verify' && (
            <div className="min-h-full flex flex-col justify-center py-10 px-6 sm:px-10 animate-in slide-in-from-right-4 duration-500 max-w-md mx-auto text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-2xl sm:rounded-[2.5rem] border-2 border-blue-500/30 flex items-center justify-center mx-auto text-blue-500 mb-8 sm:mb-12">
                <Key size={28} />
              </div>
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter italic">Verify <span className="text-blue-500">Signal</span></h3>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                  Enter the 6-digit cryptographic key transmitted to your device.
                </p>
              </div>
              <div className="flex gap-1.5 sm:gap-2 justify-center mb-8 sm:mb-10">
                {otp.map((digit, i) => (
                  <input 
                    key={i} id={`otp-${i}`}
                    type="text" maxLength={1} value={digit}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    className="w-10 h-14 sm:w-12 sm:h-16 bg-black border-2 border-white/10 rounded-lg sm:rounded-xl text-center text-lg sm:text-xl font-black text-decensat focus:border-decensat outline-none"
                  />
                ))}
              </div>
              <button 
                onClick={handleOtpVerify}
                disabled={isSyncing || otp.some(d => !d)}
                className="w-full py-5 sm:py-6 bg-decensat text-black rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.4em] shadow-glow-md hover:bg-white active:scale-95 transition-all"
              >
                {isSyncing ? <Loader2 className="animate-spin mx-auto" /> : 'VALIDATE_HANDSHAKE'}
              </button>
            </div>
          )}

          {currentStep === 'checkout' && (
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 animate-in slide-in-from-right-8 duration-700 p-4 xs:p-6 sm:p-10 min-h-full items-start">
               {/* Left: Settlement Configuration */}
               <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-1 mb-6">
                    <div className="text-[8px] sm:text-[9px] font-black text-decensat uppercase tracking-[0.4em] flex items-center gap-2">
                       <Zap size={12} className="animate-pulse" /> UCP_SETTLEMENT_CONFIG
                    </div>
                    <h3 className="text-xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Universal <span className="text-decensat italic">Checkout</span></h3>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Select Settlement Rail</label>
                    {UCP_RAILS.map((rail) => (
                       <button 
                         key={rail.id}
                         onClick={() => setSelectedUcpRail(rail.id)}
                         className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all text-left flex items-center gap-4 sm:gap-5 group relative transform-gpu active:scale-95 ${selectedUcpRail === rail.id ? 'bg-zinc-950 border-white shadow-xl' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
                       >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border-2 shrink-0 ${selectedUcpRail === rail.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-white/5'}`}>
                             <rail.icon size={20} className="sm:size-[24px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className={`text-sm sm:text-lg font-black uppercase tracking-tight leading-none mb-1 truncate ${selectedUcpRail === rail.id ? 'text-white' : 'text-slate-500'}`}>{rail.label}</div>
                             <div className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60 italic truncate">{rail.sub}</div>
                          </div>
                          <div className="text-right shrink-0">
                             <div className={`text-[6px] sm:text-[8px] font-black px-2 py-0.5 rounded border ${rail.fee === '0%' ? 'bg-decensat/10 text-decensat border-decensat/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`}>
                               FEE: {rail.fee}
                             </div>
                          </div>
                       </button>
                    ))}
                  </div>

                  {/* SECURE STRIPE API NODE */}
                  {isStripeRail && (
                    <div className="p-6 sm:p-8 bg-zinc-900/50 border border-white/10 rounded-[1.8rem] sm:rounded-[2.5rem] space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-500">
                       <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                             <ShieldCheck className="text-decensat" size={16} />
                             <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">SECURE STRIPE NODE</span>
                          </div>
                          <div className="hidden xs:flex items-center gap-2 text-slate-500">
                             <AppleIcon size={12} />
                             <GoogleIcon size={12} />
                             <CardIcon size={12} />
                          </div>
                       </div>
                       
                       <div className="space-y-3 sm:space-y-4">
                          <div className="space-y-1">
                             <label className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                             <div className="relative group">
                                <CardIcon className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={16} />
                                <input 
                                   type="text"
                                   placeholder="XXXX XXXX XXXX XXXX"
                                   value={cardData.number}
                                   onChange={handleCardNumberChange}
                                   className="w-full bg-black border-2 border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 text-xs sm:text-sm text-white font-mono focus:border-decensat/50 outline-none transition-all"
                                />
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                             <div className="space-y-1">
                                <label className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry</label>
                                <input 
                                   type="text"
                                   placeholder="MM / YY"
                                   value={cardData.expiry}
                                   onChange={handleExpiryChange}
                                   className="w-full bg-black border-2 border-white/10 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white font-mono focus:border-decensat/50 outline-none transition-all"
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">CVC</label>
                                <input 
                                   type="text"
                                   maxLength={4}
                                   placeholder="CVC"
                                   value={cardData.cvc}
                                   onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/[^0-9]/gi, '') })}
                                   className="w-full bg-black border-2 border-white/10 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white font-mono focus:border-decensat/50 outline-none transition-all"
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 bg-decensat/5 border border-decensat/10 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4">
                     <Bot size={16} className="text-decensat shrink-0" />
                     <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase leading-relaxed tracking-tight italic">
                        Handshake: {walletAddress ? 'CONNECTED' : 'PENDING'}. {isStripeRail ? 'Surcharge applied for legacy bridging.' : 'USDC mesh active - 0% fees enforced.'}
                     </p>
                  </div>
               </div>

               {/* Right: Transaction Manifest (Order Summary) */}
               <div className="lg:col-span-5 flex flex-col min-h-full">
                  <div className="bg-black border-2 border-white/10 rounded-[1.8rem] sm:rounded-[2.5rem] p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-3xl relative overflow-hidden flex-1">
                     <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-[0.02] pointer-events-none"><Coins size={80} className="sm:size-[120px]" /></div>
                     
                     <div className="flex items-center gap-3 sm:gap-4 text-decensat font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] border-b border-white/5 pb-3 sm:pb-4">
                        <Terminal size={14} className="sm:size-[16px]" /> Transaction_Manifest
                     </div>

                     <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center py-0.5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Package size={10} className="sm:size-[12px]" />
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Base Node Valuation</span>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-mono font-black text-white uppercase">${basePrice.toLocaleString()} USDC</span>
                        </div>
                        {isStripeRail && (
                          <div className="flex justify-between items-center py-0.5">
                            <div className="flex items-center gap-2 text-rose-400">
                              <ShieldAlert size={10} className="sm:size-[12px]" />
                              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Inst. Surcharge</span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-mono font-black text-rose-500 uppercase">+${feeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC</span>
                          </div>
                        )}
                        {[
                          { label: "Protocol Mesh", val: "Google UCP", icon: Globe },
                          { label: "Auth Rail", val: walletAddress ? "Privy_Active" : (isStripeRail ? "Stripe_API" : "UCP_Legacy"), icon: Fingerprint }
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center py-0.5">
                            <div className="flex items-center gap-2 text-slate-600">
                              <row.icon size={10} className="sm:size-[12px]" />
                              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{row.label}</span>
                            </div>
                            <span className="text-[8px] sm:text-[9px] font-mono font-black text-white uppercase truncate max-w-[100px]">{row.val}</span>
                          </div>
                        ))}
                     </div>

                     <div className="pt-4 sm:pt-6 border-t border-white/5 space-y-4 sm:space-y-6">
                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-end gap-4 sm:gap-6">
                           <div className="flex flex-col w-full xs:w-auto">
                              <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Settlement</span>
                              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tighter">${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              <p className="text-[6px] sm:text-[7px] text-slate-600 font-bold uppercase tracking-tight mt-1.5 max-w-[180px] leading-tight italic">
                                 * USDC PEGGED 1:1 TO USD. OPTIMIZED VIA UCP_MESH.
                              </p>
                           </div>
                           
                           <button 
                            onClick={handleExecuteCheckout}
                            disabled={isSyncing}
                            className={`w-full xs:w-auto px-5 py-4 bg-decensat text-black rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 shadow-glow-sm hover:bg-white active:scale-95 disabled:opacity-50 group shrink-0`}
                          >
                             {isSyncing ? <Loader2 size={14} className="animate-spin sm:size-[16px]" /> : <Lock size={12} className="sm:size-[14px] group-hover:animate-pulse" />}
                             {isSyncing ? 'SIGNING...' : 'EXECUTE_UCP'}
                          </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {currentStep === 'scheduling' && (
            <div className="min-h-full flex flex-col justify-center py-10 px-6 sm:px-10 animate-in slide-in-from-right-8 duration-700 max-w-3xl mx-auto">
              <div className="space-y-3 sm:space-y-4 text-center mb-8 sm:mb-12">
                <h3 className="text-2xl sm:text-5xl font-black text-white uppercase tracking-tighter italic">Strategy <span className="text-decensat">Sync</span></h3>
                <p className="text-slate-400 text-xs sm:text-lg font-bold leading-relaxed uppercase tracking-tight italic">
                  {isByo ? 'IDENTITY VERIFIED. SELECT STRATEGY WINDOW.' : 'SETTLEMENT AUTHORIZED. SELECT SCOPING WINDOW.'}
                </p>
              </div>
              
              <div className="relative group mb-8 sm:mb-10">
                <input 
                  type="datetime-local" 
                  className={`w-full bg-black border-2 border-white/10 rounded-xl sm:rounded-[2rem] p-5 sm:p-6 text-white font-mono text-[10px] sm:text-sm outline-none transition-all cursor-pointer hover:bg-white/5 focus:border-decensat/40`}
                  onChange={(e) => setErrors({})}
                />
                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none group-focus-within:text-decensat transition-colors" size={20} />
              </div>

              <button 
                onClick={() => setCurrentStep('success')}
                className="w-full py-5 sm:py-8 bg-decensat text-black rounded-xl sm:rounded-[2rem] font-black uppercase text-[10px] sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-glow-md hover:bg-white"
              >
                COMMIT_UPLINK_SYNC <Check size={18} strokeWidth={3} className="sm:size-[20px]" />
              </button>
            </div>
          )}

          {currentStep === 'success' && (
             <div className="min-h-full flex flex-col justify-center py-12 px-6 sm:px-10 text-center space-y-10 sm:space-y-12 animate-in zoom-in-95 duration-700 max-w-2xl mx-auto">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-decensat rounded-2xl sm:rounded-[3rem] flex items-center justify-center text-black mx-auto shadow-glow-md relative animate-success-ring">
                  <Check size={48} strokeWidth={4} className="animate-checkmark-success sm:size-[64px]" />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-tight italic">
                    Node alignment <br/><span className="text-decensat not-italic">Established.</span>
                  </h3>
                  <p className="text-sm sm:text-lg text-slate-500 font-bold uppercase tracking-tight max-w-sm sm:max-w-md mx-auto italic">
                    {isByo ? 'Your strategy triage request is logged.' : 'Institutional settlement verified.'} Your advisory sync is confirmed on the UCP ledger.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-full py-5 sm:py-6 bg-white text-black font-black uppercase text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] rounded-xl sm:rounded-[2rem] hover:bg-decensat transition-all shadow-xl"
                >
                  ENTER_CONTROL_MESH
                </button>
             </div>
          )}
        </div>
        
        {/* Institutional Footer Bar */}
        <div className="p-4 sm:p-8 border-t border-white/5 bg-black flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-10 w-full sm:w-auto">
             <div className="flex items-center gap-2.5">
               <ShieldCheck size={16} className="text-decensat sm:size-[20px]" />
               <div className="flex flex-col">
                  <span className="text-[7px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] font-black leading-none">IDENTITY_GATED</span>
                  <span className="text-[5px] sm:text-[7px] font-mono text-slate-700 uppercase font-black">UCP_AUDIT_HANDSHAKE_READY</span>
               </div>
             </div>
          </div>
          
          <div className="flex flex-col xs:flex-row items-center sm:items-end gap-4 sm:gap-10 w-full sm:w-auto">
             <div className="flex flex-col items-center sm:items-end text-center sm:text-right hidden xs:flex">
                <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1.5">GOOGLE UNIVERSAL COMMERCE PROTOCOL</span>
                <span className="text-[6px] sm:text-[8px] font-mono text-slate-500 uppercase font-bold tracking-widest">STITCH_NODE: {item.id.toUpperCase()} // v1.4</span>
             </div>

             <div className="flex items-center gap-3 sm:gap-4 w-full xs:w-auto justify-between xs:justify-start">
                <div className="flex flex-col items-start xs:items-end text-left xs:text-right min-w-[120px] sm:min-w-[140px]">
                   <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">PRIVY MESH_SYNC</span>
                   <span className="text-[6px] sm:text-[7px] font-mono font-black text-slate-500 uppercase tracking-tighter">SELECT_DEFI_UPLINK</span>
                </div>
                
                <button 
                  onClick={() => setCurrentStep('privy_auth')}
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl border-2 transition-all flex items-center justify-center relative group/reown shadow-xl active:scale-95 ${
                    walletAddress ? 'bg-decensat border-decensat text-black' : 'bg-[#3396FF] border-[#3396FF]/50 text-white hover:bg-white hover:text-[#3396FF] hover:border-white shadow-[0_0_20px_rgba(51,150,255,0.3)]'
                  }`}
                >
                   {walletAddress ? <ShieldCheck size={18} strokeWidth={3} className="sm:size-[24px]" /> : <ReownIcon className="w-5 h-5 sm:w-8 sm:h-8 group-hover/reown:animate-pulse" />}
                   {walletAddress && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-decensat animate-ping" />}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingModal;