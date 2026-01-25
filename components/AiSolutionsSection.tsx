import React, { useState, useRef, useEffect } from 'react';
import { AI_OPTIMIZATION_NODES } from '../constants';
import { AiSolution } from '../types';
import { 
  MessageSquare, Zap, Globe, ArrowRight, Brain, Phone, 
  Cpu, Calendar, Settings, Search, Hammer, Rocket, 
  ChevronUp, ChevronDown, ShieldCheck, CheckCircle2,
  Activity, Terminal, Package, Info, X, ShieldAlert, Clock, Coins, Check, AlertCircle, Sparkles, Lock, Bot, Smartphone
} from 'lucide-react';
import { checkSchedulingWindow } from '../core/validation';
import ServiceBookingModal from './ServiceBookingModal';
import { MARKETING_CONFIG } from '../core/marketing.config';

const IconMap = {
  MessageSquare,
  Zap,
  Globe,
  Brain,
  Phone,
};

const AiNodeCard: React.FC<{ item: AiSolution; onBook: (item: AiSolution, mode: 'book' | 'checkout') => void }> = ({ item, onBook }) => {
  const Icon = IconMap[item.iconName as keyof typeof IconMap] || Zap;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };
  
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full bg-zinc-950 border-2 sm:border-[3px] border-white/5 rounded-[2rem] sm:rounded-[3.5rem] p-5 xs:p-6 sm:p-10 flex flex-col transition-all duration-700 sm:hover:border-decensat/40 sm:hover:shadow-[0_40px_80px_-20px_rgba(163,230,53,0.15)] group min-h-fit sm:min-h-[600px] lg:min-h-[740px] transform-gpu relative overflow-hidden h-full"
    >
      <div 
        className="absolute top-0 right-0 p-8 sm:p-12 transition-all duration-1000 ease-out pointer-events-none transform-gpu opacity-[0.03] sm:group-hover:opacity-10 sm:group-hover:text-decensat"
        style={{
          transform: `translate(${mousePos.x * -120}px, ${mousePos.y * -120}px) scale(1.2) rotate(${mousePos.x * 15}deg)`,
        }}
      >
        <Icon size={240} strokeWidth={1} className="hidden sm:block" />
      </div>

      <div className="flex justify-between items-start mb-6 sm:mb-10 relative z-10 gap-2">
        <div className="bg-decensat/10 border border-decensat/20 text-decensat px-2.5 py-1.5 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl text-center font-black text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] w-fit shrink-0 sm:group-hover:bg-decensat sm:group-hover:text-black transition-all duration-500">
          {item.headline}
        </div>
        <div className="flex flex-col items-end">
           <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-[8px] sm:text-sm font-black text-decensat opacity-50 font-mono tracking-widest uppercase">USDC</span>
              <div className="text-lg xs:text-xl sm:text-3xl font-black text-white font-mono tracking-tighter">
                {item.price === 0 ? 'Variable' : `$${item.price.toLocaleString()}`}
              </div>
           </div>
           <div className="text-[6px] sm:text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5 font-mono italic text-right max-w-[100px] xs:max-w-[120px] sm:max-w-[180px] leading-tight ml-auto">
              <Sparkles size={8} className="text-decensat/60 shrink-0" />
              {item.price === 0 ? '443 Smart Protocol' : 'UCP + A2A Verified'}
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6 mb-5 sm:mb-8 relative z-10">
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/5 rounded-xl sm:rounded-[1.8rem] flex items-center justify-center text-decensat border border-white/10 sm:group-hover:scale-110 sm:group-hover:rotate-6 transition-all duration-500 shadow-xl shrink-0">
          <Icon strokeWidth={2.5} className="w-[18px] h-[18px] sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-lg xs:text-xl sm:text-3xl font-black text-white tracking-tighter leading-none sm:group-hover:text-decensat transition-colors uppercase italic sm:not-italic truncate">
          {item.title}
        </h3>
      </div>

      <p className="text-slate-400 text-xs xs:text-sm sm:text-lg font-bold leading-relaxed mb-6 sm:mb-10 min-h-fit sm:min-h-[80px] relative z-10 line-clamp-3 uppercase tracking-tight italic">
        {item.subHeadline}
      </p>

      <div className="flex-grow space-y-6 mb-8 relative z-10">
        <div className="space-y-3">
           <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-decensat" />
              <span className="text-[7px] xs:text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Institutional_Bundle</span>
           </div>
           <div className="grid gap-1.5 sm:gap-2">
              {item.services?.slice(0, 4).map((service, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 sm:p-4 rounded-xl bg-white/5 border border-white/5 sm:hover:border-decensat/20 transition-all group/svc">
                   <div className="w-1 h-1 rounded-full bg-decensat/40 sm:group-hover/svc:bg-decensat transition-colors shrink-0" />
                   <span className="text-[7px] xs:text-[9px] sm:text-[11px] font-black text-slate-300 uppercase tracking-widest leading-tight">{service}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="pt-6 sm:pt-8 border-t border-white/5 mt-auto relative z-10">
        {item.price > 0 ? (
          <button 
            onClick={() => onBook(item, 'checkout')}
            className="w-full py-4 sm:py-5 px-4 sm:px-8 bg-decensat text-black rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] leading-tight hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 sm:gap-4 shadow-xl active:scale-95 text-center group/ucp"
          >
            <div className="flex gap-2 items-center shrink-0">
              <Lock size={14} className="text-black/60" />
              <Globe size={14} className="text-blue-600 animate-spin-slow" />
            </div>
            <span className="flex-1 truncate">UCP Settlement</span>
            <ArrowRight strokeWidth={3} className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/ucp:translate-x-1 transition-transform shrink-0" />
          </button>
        ) : (
          <button 
            onClick={() => onBook(item, 'book')}
            className="w-full py-4 sm:py-5 px-4 sm:px-8 bg-decensat text-black rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] leading-tight hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 sm:gap-4 shadow-xl active:scale-95 text-center group/byo"
          >
            <Smartphone size={20} className="shrink-0" />
            <span className="flex-1 truncate">Book Strategy Call</span>
            <ArrowRight strokeWidth={3} className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/byo:translate-x-1 transition-transform shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
};

const AiSolutionsSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AiSolution | null>(null);
  const [selectedMode, setSelectedMode] = useState<'book' | 'checkout'>('book');
  const scrollRef = useRef<HTMLDivElement>(null);
  const showArrows = AI_OPTIMIZATION_NODES.length > 3;

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const { scrollTop, clientHeight } = scrollRef.current;
      const scrollAmount = clientHeight * 0.7;
      scrollRef.current.scrollTo({
        top: direction === 'up' ? scrollTop - scrollAmount : scrollTop + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAction = (item: AiSolution, mode: 'book' | 'checkout') => {
    setSelectedItem(item);
    setSelectedMode(mode);
  };

  return (
    <section id="ai-optimization" className="py-2 sm:py-4 px-4 sm:px-6 lg:px-12 bg-[#020617] relative z-20 overflow-hidden">
      {selectedItem && (
        <ServiceBookingModal 
          item={{ ...selectedItem, name: selectedItem.title, isByo: selectedItem.price === 0 }} 
          onClose={() => setSelectedItem(null)} 
          initialStep="confirmation"
        />
      )}
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="mb-6 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-l-[6px] sm:border-l-[8px] border-decensat pl-4 sm:pl-8 animate-in slide-in-from-left duration-1000">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 sm:gap-4 px-3 py-1.5 sm:px-6 sm:py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[7px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] shadow-[0_0_30px_rgba(163,230,53,0.15)] w-fit mb-3 sm:mb-4">
              <Brain strokeWidth={3} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 animate-pulse" />
              <span>CLUSTER_SYNC_ACTIVE // UCP_A2A_NATIVE</span>
            </div>
            <h2 className="text-2xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-1 sm:mb-2">
              AI Automation <span className="text-decensat italic">Bundles</span>
            </h2>
            <p className="text-xs xs:text-base lg:text-xl text-slate-400 font-bold uppercase tracking-tight leading-tight sm:leading-relaxed max-w-2xl italic">
              Modular AI solutions designed to automate, assist, and amplify.
            </p>
          </div>
          
          {showArrows && (
            <div className="hidden md:flex gap-4 shrink-0 pb-2">
               <button 
                  onClick={() => scroll('up')} 
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-xl"
               >
                  <ChevronUp strokeWidth={3} className="w-6 h-6 sm:w-7 sm:h-7" />
               </button>
               <button 
                  onClick={() => scroll('down')} 
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-xl"
               >
                  <ChevronDown strokeWidth={3} className="w-6 h-6 sm:w-7 sm:h-7" />
               </button>
            </div>
          )}
        </div>

        <div 
          ref={scrollRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-12 transition-all duration-500 ${showArrows ? 'lg:max-h-[1400px] overflow-y-auto no-scrollbar scroll-smooth' : ''}`}
        >
          {AI_OPTIMIZATION_NODES.map((item) => (
            <div key={item.id} className="h-full">
              <AiNodeCard item={item} onBook={handleAction} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiSolutionsSection;