import React from 'react';
import { ArrowRight, Zap, Layers, Sprout, Globe, TreePine, CloudRain, Sun, Waves, Database, ShieldCheck } from 'lucide-react';

const TalentBadge = ({ title, subtitle, icon: Icon, isDark = false, locations, bgColor }: { title: string, subtitle?: string, icon: any, isDark?: boolean, locations?: string[], bgColor?: string }) => (
  <div className="flex flex-col items-center w-full max-w-[280px] xs:max-w-[310px] mx-auto sm:mx-0">
    <div className="w-px h-6 sm:h-10 bg-slate-800" />
    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-[3px] border-slate-700 bg-black -mt-0.5 z-10" />
    
    <div className={`w-full rounded-[2rem] sm:rounded-[3rem] border-2 sm:border-4 flex flex-col items-start p-6 sm:p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_64px_128px_-32px_rgba(163,230,53,0.8)] relative overflow-hidden mt-3 group ${
      isDark 
        ? 'bg-black border-white/10 shadow-2xl' 
        : 'bg-zinc-950 border-white/5 shadow-xl'
    }`}>
      <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-[0.02] group-hover:scale-125 transition-transform duration-[1500ms] pointer-events-none transform-gpu">
        <Icon className="w-24 h-24 sm:w-32 sm:h-32" />
      </div>

      <div className="flex justify-between w-full items-start mb-4 sm:mb-6 relative z-10">
        <div className={`p-3 sm:p-4 bg-black rounded-xl sm:rounded-2xl border-2 border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl`}>
          <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${bgColor || 'text-decensat'} transition-all`} strokeWidth={2.5} />
        </div>
      </div>
      
      <h3 className="text-base sm:text-lg lg:text-xl font-black text-white mb-1.5 sm:mb-2 tracking-tighter leading-none uppercase group-hover:text-decensat transition-colors relative z-10">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[7px] sm:text-[9px] font-bold text-slate-600 leading-relaxed mb-3 sm:mb-4 uppercase tracking-[0.2em] relative z-10">{subtitle}</p>
      )}

      {locations && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 relative z-10">
          {locations.map(loc => (
            <span key={loc} className="text-[7px] sm:text-[8px] font-black bg-white/5 border border-white/10 text-slate-500 px-2.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-widest hover:border-decensat transition-colors">{loc}</span>
          ))}
        </div>
      )}
      
      <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5 w-full flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <p className="text-[7px] sm:text-[9px] font-black text-decensat uppercase tracking-[0.4em] sm:tracking-[0.4em] flex items-center gap-1.5 sm:gap-2">
            <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5 animate-pulse" /> DEPLOY_ASSET
          </p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 group-hover:text-decensat group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </div>
);

const SuccessList: React.FC = () => {
  return (
    <section id="node-infrastructure" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#020617] border-y-8 border-white/5 overflow-hidden transition-colors duration-500">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Header synchronized with ExecutionIndexPortfolio */}
        <div className="mb-8 sm:mb-12 flex flex-col gap-4 sm:gap-6 border-l-[6px] sm:border-l-[8px] border-decensat pl-4 sm:pl-8 animate-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-3 sm:gap-4 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[7px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] shadow-[0_0_30px_rgba(163,230,53,0.15)] w-fit">
            <Sprout strokeWidth={3} className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
            <span>ARCHITECTURE_PROTOCOL_LOCKED</span>
          </div>
          <div className="max-w-4xl">
            <h2 className="text-2xl xs:text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-2 sm:mb-4">
              Bundle <span className="text-decensat italic">Architecture</span>
            </h2>
            <p className="text-xs xs:text-sm lg:text-2xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl opacity-80">
              Principle-led global expertise, shaped into clearly defined bundles, configurable engagement models, or traditional development advisory.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 sm:gap-20 xl:gap-32 items-start mt-8 sm:mt-16">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-12">
            <div className="p-8 sm:p-14 bg-zinc-950/50 border-2 border-white/5 rounded-[2.5rem] sm:rounded-[4rem] shadow-3xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                <Globe size={180} />
              </div>
              <h4 className="text-decensat font-black text-[10px] sm:text-sm uppercase tracking-[0.5em] mb-10 sm:mb-14 flex items-center gap-4 opacity-70 relative z-10 font-mono">
                <Globe size={18} className="animate-spin-slow" /> Network_Trunk_Live
              </h4>
              <ul className="space-y-8 sm:space-y-12 relative z-10">
                {[
                  { icon: Sun, label: 'Strategy Principal', sub: 'Brand Node', color: 'text-orange-400' },
                  { icon: Layers, label: 'Engineering Principal', sub: 'Ops Node', color: 'text-pink-400' },
                  { icon: TreePine, label: 'Performance Principal', sub: 'Native Node', color: 'text-decensat' },
                  { icon: CloudRain, label: 'Automation Principal', sub: 'Agent Node', color: 'text-purple-400' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 sm:gap-8 group/item cursor-default items-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl bg-white/5 flex items-center justify-center ${item.color} shrink-0 border-2 border-white/5 group-hover/item:scale-110 group-hover/item:bg-white/10 transition-all duration-500 shadow-2xl`}>
                      <item.icon strokeWidth={2.5} className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-white font-black text-base sm:text-xl block uppercase tracking-tight truncate">{item.label}</span>
                      <span className="text-slate-600 text-[9px] sm:text-xs font-black uppercase tracking-[0.3em] mt-1.5 block font-mono">Node_Class::{item.sub.toUpperCase()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-8 sm:p-10 bg-decensat/5 border border-decensat/20 rounded-[2.5rem] flex items-center gap-6">
              <ShieldCheck className="text-decensat shrink-0" size={32} />
              <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase leading-relaxed italic tracking-tight">
                Top-tier reliability. Instant responsiveness. Double-verified security.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-16 items-start justify-center lg:justify-start transform-gpu overflow-hidden px-2">
              <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                <div className="text-[9px] sm:text-xs font-black text-slate-700 uppercase tracking-[0.6em] mb-2 text-center w-full font-mono border-b border-white/5 pb-4">INFRA_PROTOCOL</div>
                <TalentBadge 
                  title="Web3 Fintech"
                  subtitle="Settlement Rails"
                  locations={['USA', 'UAE']}
                  icon={Waves}
                  bgColor="text-decensat"
                />
                <TalentBadge 
                  title="Full Stack Ops"
                  subtitle="Platform Hub"
                  icon={Layers}
                  bgColor="text-pink-500"
                />
                <TalentBadge 
                  title="Mobile Native"
                  subtitle="High Performance"
                  icon={TreePine}
                  isDark
                  bgColor="text-decensat"
                />
              </div>

              <div className="flex flex-col items-center gap-4 sm:pt-32 lg:pt-48 w-full sm:w-auto">
                <div className="text-[9px] sm:text-xs font-black text-slate-700 uppercase tracking-[0.6em] mb-2 text-center w-full font-mono border-b border-white/5 pb-4">BRAND_PROTOCOL</div>
                <TalentBadge 
                  title="Creative Hub" 
                  subtitle="Identity Nodes"
                  icon={Sun}
                  bgColor="text-orange-500"
                />
                <TalentBadge 
                  isDark
                  title="AI Workflows" 
                  subtitle="Agentic Systems"
                  icon={CloudRain}
                  bgColor="text-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessList;