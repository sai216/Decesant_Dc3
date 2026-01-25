
import React, { useState, useMemo } from 'react';
import { Bundle } from '../types';
import { 
  Check, Activity, Loader2, Rocket, Network, Cpu, Coins, Zap, 
  Target, ShieldCheck, ListChecks, ArrowUpRight, ChevronRight, 
  BarChart3, Sparkles, User, Bot, Shield, Globe
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface BundleCardProps {
  bundle: Bundle;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onAddToCart?: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, isSelected, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'nodes' | 'rails' | 'telemetry'>('manifest');
  const [isSyncing, setIsSyncing] = useState(false);

  const sparklineData = useMemo(() => [
    { value: 40 + Math.random() * 10 }, 
    { value: 55 + Math.random() * 15 }, 
    { value: 48 + Math.random() * 20 }, 
    { value: 75 + Math.random() * 10 }, 
    { value: 68 + Math.random() * 15 }, 
    { value: 92 + Math.random() * 5 }
  ], []);

  const handleInitialize = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (onAddToCart) onAddToCart();
    setIsSyncing(false);
  };

  const activePrice = bundle.prices[0];

  return (
    <div className={`bg-[#020617] border-2 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden transition-all duration-700 ease-expo group flex flex-col h-full relative transform-gpu ${isSelected ? 'border-decensat shadow-glow-lime' : 'border-white/5 hover:border-decensat/30'}`}>
      
      {/* Header Artifact */}
      <div className="relative h-64 sm:h-80 overflow-hidden border-b-[6px] border-white/5 shrink-0 bg-black animate-scanning-line">
        <img 
          src={bundle.heroImage} 
          alt={bundle.name} 
          className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-grid-f4a opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        
        <div className="absolute top-6 right-6">
           <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] text-decensat flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-decensat animate-pulse" />
              NODE_CLASS::{bundle.tier.toUpperCase().replace(/ /g, '_')}
           </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
           <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-decensat text-black text-[8px] font-black uppercase tracking-[0.3em] mb-3 shadow-glow-sm">
             <Zap size={10} className="animate-pulse" /> SYSTEM_ORCHESTRATION_v4.5
           </div>
           <h3 className="text-3xl sm:text-4xl text-white font-black leading-none tracking-tighter mb-2 uppercase italic">
             {bundle.name}
           </h3>
           <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
             <span>REF: {bundle.id.toUpperCase()}</span>
             <span className="w-1 h-1 rounded-full bg-slate-800" />
             <span className="text-decensat">{bundle.category}</span>
           </div>
        </div>
      </div>

      {/* Pricing & Telemetry */}
      <div className="p-8 sm:p-10 bg-zinc-950/50 border-b border-white/5 flex items-center justify-between gap-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-f4a opacity-10 pointer-events-none" />
         <div>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
              <Coins size={12} className="text-decensat" /> VALUATION_SIGNAL
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-xs font-black text-decensat/50 font-mono">USDC</span>
               <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-mono">${activePrice.amount.toLocaleString()}</span>
            </div>
         </div>
         <div className="w-32 h-16 relative group/chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area type="monotone" dataKey="value" stroke="#a3e635" fill="#a3e635" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/chart:opacity-100 transition-opacity bg-black/80 rounded-lg backdrop-blur-sm">
               <span className="text-[8px] font-black text-decensat uppercase tracking-widest">Performance_Index</span>
            </div>
         </div>
      </div>

      {/* Navigation Matrix */}
      <div className="px-8 sm:px-10 pt-8 flex-grow flex flex-col">
        <div className="flex gap-6 border-b-2 border-white/5 mb-8 text-[9px] font-black uppercase tracking-[0.3em] overflow-x-auto no-scrollbar pb-1">
           {[
             { id: 'manifest', label: 'Artifacts', icon: ListChecks },
             { id: 'nodes', label: 'Allocation', icon: Network },
             { id: 'rails', label: 'Rails', icon: Cpu },
             { id: 'telemetry', label: 'Velocity', icon: BarChart3 }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`pb-3 transition-all border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-decensat border-decensat' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
             >
               <tab.icon size={12} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Dynamic Display Layer */}
        <div className="min-h-[240px]">
           {activeTab === 'manifest' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">
                <p className="text-[11px] sm:text-[13px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic border-l-2 border-decensat/30 pl-6">
                  {bundle.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {bundle.deliverables.map((d, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black border border-white/5 hover:border-decensat/20 transition-all group/item">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-decensat transition-all duration-500 shrink-0">
                           <Check size={12} className="text-decensat group-hover/item:text-black" strokeWidth={4} />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{d}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'nodes' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-2 duration-500">
                {bundle.team.map((node, i) => (
                   <div key={i} className="p-5 bg-black border border-white/10 rounded-2xl flex flex-col gap-3 hover:border-decensat/30 transition-all relative overflow-hidden">
                      <div className="flex items-center justify-between">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-decensat"><User size={14} /></div>
                         <div className="text-[7px] font-mono text-slate-600 font-black">SRT_SYNC</div>
                      </div>
                      <div>
                         <div className="text-xs font-black text-white uppercase tracking-tight leading-none mb-1">{node.role}</div>
                         <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-decensat uppercase">{node.seniority}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <span className="text-[8px] font-black text-slate-600 uppercase">{node.location}</span>
                         </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                         <span className="text-[8px] font-black text-slate-700 uppercase">Weight</span>
                         <span className="text-[10px] font-mono font-black text-white">x{node.count} Nodes</span>
                      </div>
                   </div>
                ))}
             </div>
           )}

           {activeTab === 'rails' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-500">
                <div className="p-5 bg-black border border-white/5 rounded-2xl space-y-3">
                   <div className="flex items-center gap-2 text-blue-500 text-[9px] font-black uppercase tracking-widest">
                      <Bot size={12} /> Agentic Rail
                   </div>
                   <div className="text-xl font-black text-white font-mono uppercase tracking-tighter">COINBASE_A2A</div>
                   <p className="text-[8px] text-slate-600 font-bold uppercase italic leading-tight">Secure autonomous handshake for inter-agent capital flow.</p>
                </div>
                <div className="p-5 bg-black border border-white/5 rounded-2xl space-y-3">
                   <div className="flex items-center gap-2 text-decensat text-[9px] font-black uppercase tracking-widest">
                      <Sparkles size={12} /> Settlement
                   </div>
                   <div className="text-xl font-black text-white font-mono uppercase tracking-tighter">GOOGLE_UCP</div>
                   <p className="text-[8px] text-slate-600 font-bold uppercase italic leading-tight">Unified commerce layer enabling frictionless global USDC draws.</p>
                </div>
             </div>
           )}

           {activeTab === 'telemetry' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-right-2 duration-500">
                 <div className="p-6 bg-black border border-white/5 rounded-2xl flex flex-col items-center gap-2 text-center">
                    <Activity size={18} className="text-decensat opacity-40" />
                    <span className="text-[8px] font-black text-slate-600 uppercase">Efficiency</span>
                    <span className="text-2xl font-black font-mono text-white">9.8</span>
                 </div>
                 <div className="p-6 bg-black border border-white/5 rounded-2xl flex flex-col items-center gap-2 text-center">
                    <Zap size={18} className="text-amber-500 opacity-40" />
                    <span className="text-[8px] font-black text-slate-600 uppercase">Velocity</span>
                    <span className="text-2xl font-black font-mono text-white">1.2x</span>
                 </div>
                 <div className="p-6 bg-decensat rounded-2xl flex flex-col items-center gap-2 text-center">
                    <Target size={18} className="text-black opacity-60" />
                    <span className="text-[8px] font-black text-black/60 uppercase">Reliability</span>
                    <span className="text-2xl font-black font-mono text-black">99%</span>
                 </div>
              </div>
           )}
        </div>

        {/* Terminal Action Area */}
        <div className="mt-auto py-10 border-t border-white/5 flex flex-col sm:flex-row gap-4">
           <button 
             onClick={handleInitialize}
             disabled={isSyncing}
             className={`flex-1 h-[72px] rounded-[1.5rem] sm:rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 group/btn active:scale-95 shadow-glow-md relative overflow-hidden ${
               isSyncing ? 'bg-zinc-900 text-decensat cursor-wait grayscale' : 'bg-decensat text-black hover:bg-white'
             }`}
           >
              {isSyncing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  SYNCING_PROTOCOL...
                </>
              ) : (
                <>
                  <Rocket size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  INITIALIZE_A2A_UPLINK
                  <ArrowUpRight size={16} className="opacity-30" />
                </>
              )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;
