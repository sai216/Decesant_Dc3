import React, { useState, useRef, useEffect } from 'react';
import { AI_OPTIMIZATION_NODES } from '../constants';
import { AiSolution } from '../types';
import { 
  MessageSquare, Zap, Globe, ArrowRight, Brain, Phone, 
  ChevronUp, ChevronDown, Package, Sparkles, Lock, Smartphone
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
  
  return (
    <div 
      className="w-full bg-zinc-950 border-2 border-white/5 rounded-[1.5rem] p-5 sm:p-6 flex flex-col transition-all duration-500 hover:border-decensat/40 group relative overflow-hidden h-full"
    >

      <div className="flex justify-between items-start mb-5 gap-3">
        <div className="bg-decensat/10 border border-decensat/20 text-decensat px-3 py-1.5 rounded-lg text-center font-black text-[8px] uppercase tracking-[0.2em] w-fit">
          {item.headline}
        </div>
        <div className="flex items-baseline gap-2">
           <span className="text-xs font-black text-decensat/50 font-mono">USDC</span>
           <div className="text-2xl sm:text-3xl font-black text-white font-mono">
             {item.price === 0 ? 'Variable' : `$${item.price.toLocaleString()}`}
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-decensat border border-white/10">
          <Icon strokeWidth={2.5} className="w-6 h-6" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase">
          {item.title}
        </h3>
      </div>

      <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6 line-clamp-2 uppercase italic">
        {item.subHeadline}
      </p>

      <div className="flex-grow mb-6">
        <div className="flex items-center gap-2 mb-3">
           <Package className="w-3 h-3 text-decensat" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Enterprise_Bundle</span>
        </div>
        <div className="grid gap-2">
           {item.services?.slice(0, 4).map((service, i) => (
             <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-decensat/20 transition-all">
                <div className="w-1 h-1 rounded-full bg-decensat/40" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide">{service}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="pt-5 border-t border-white/5 mt-auto">
        {item.price > 0 ? (
          <button 
            onClick={() => onBook(item, 'checkout')}
            className="w-full py-4 px-6 bg-decensat text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Lock size={14} />
            <span>UCP Settlement</span>
            <ArrowRight strokeWidth={3} className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={() => onBook(item, 'book')}
            className="w-full py-4 px-6 bg-decensat text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Smartphone size={16} />
            <span>Book Strategy Call</span>
            <ArrowRight strokeWidth={3} className="w-4 h-4" />
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
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-decensat pl-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[9px] font-black uppercase tracking-widest w-fit mb-3">
              <Brain strokeWidth={3} className="w-3 h-3" />
              <span>AI Automation Bundles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none mb-2">
              AI Automation <span className="text-decensat italic">Bundles</span>
            </h2>
            <p className="text-base text-slate-400 font-bold uppercase tracking-tight max-w-2xl italic">
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