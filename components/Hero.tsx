import React from 'react';
import { Activity } from 'lucide-react';
import { MARKETING_CONFIG } from '../core/marketing.config';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[75vh] sm:min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-7rem)] flex flex-col justify-center bg-black py-16 sm:py-20 lg:py-24 transition-colors duration-500">
      {/* Visual Artifacts */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-f4a opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1]" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-decensat/[0.03] to-transparent" />
        
        {/* Glowing Data Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] lg:w-[1200px] h-[300px] sm:h-[800px] lg:h-[1200px] bg-decensat/5 rounded-full blur-[100px] sm:blur-[200px] lg:blur-[250px] animate-pulse" />
      </div>

      <div className="mx-auto max-w-[1920px] px-4 xs:px-6 sm:px-12 lg:px-24 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 sm:gap-4 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-black/60 border border-white/10 backdrop-blur-3xl mb-8 sm:mb-12 lg:mb-20 shadow-2xl animate-in fade-in duration-1000 group hover:border-decensat/30 transition-all cursor-default">
            <div className="relative">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-decensat animate-ping absolute inset-0" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-decensat relative shadow-glow-sm" />
            </div>
            <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.6em] font-mono">System_Protocol::Sync_Nominal</span>
          </div>
          
          {/* Main Hero Content */}
          <div className="max-w-7xl mb-8 sm:mb-16 lg:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-[2.2rem] xs:text-[3rem] sm:text-6xl lg:text-8xl xl:text-[10rem] font-black tracking-tighter text-white leading-[0.9] sm:leading-[0.85] lg:leading-[0.8] uppercase px-2 sm:px-4">
              {MARKETING_CONFIG.HERO.TITLE_MVP} <br className="hidden xs:block" />
              <span className="text-decensat relative inline-block group italic">
                {MARKETING_CONFIG.HERO.TITLE_SCALE}
                <span className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 left-0 w-full h-1 sm:h-1.5 lg:h-2 bg-decensat scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-expo shadow-glow-lime" />
              </span>
            </h1>
            
            {/* Subheadline */}
            <div className="mt-6 sm:mt-10 lg:mt-16 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">
              <p className="text-xs xs:text-sm sm:text-xl lg:text-3xl xl:text-5xl leading-tight text-slate-300 font-bold tracking-tighter max-w-5xl uppercase px-4 sm:px-6 italic opacity-90">
                {MARKETING_CONFIG.HERO.SUBHEADLINE}
              </p>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="h-[1.5px] sm:h-[2px] w-10 sm:w-20 lg:w-32 bg-gradient-to-r from-transparent to-white/20" />
                <Activity size={20} className="sm:size-6 text-decensat animate-pulse" />
                <div className="h-[1.5px] sm:h-[2px] w-10 sm:w-20 lg:w-32 bg-gradient-to-l from-transparent to-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Overlay - f4a signature */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 hidden xl:flex flex-col gap-3 lg:gap-4 animate-in fade-in slide-in-from-left duration-1000">
         <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Execution Index</span>
            <span className="text-xl lg:text-2xl font-mono font-black text-white">0.994_SRA</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Latency Target</span>
            <span className="text-xl lg:text-2xl font-mono font-black text-decensat">42ms_SYNC</span>
         </div>
      </div>
    </div>
  );
};

export default Hero;