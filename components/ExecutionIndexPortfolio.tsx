import React, { useState, useRef, memo, useCallback } from 'react';
import { 
  Database, RefreshCw, ChevronLeft, ChevronRight, 
  FileText, Activity, Target, Shield, Terminal, 
  AlertTriangle, ImageOff, CheckCircle2, Calendar, Info, ShieldAlert, Cpu
} from 'lucide-react';
import { MARKETING_CONFIG } from '../core/marketing.config';

interface ProjectNode {
  id: string;
  name: string;
  systemType: string;
  clientStage: string;
  year: string;
  month: string;
  clientPartner: string;
  longDescription: string;
  bgTexture: string;
  caseStudyUrl: string;
  techStack: string[];
}

interface ProjectCardProps {
  node: ProjectNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const MetadataLabel = ({ text, explanation, icon: Icon, label = "Metadata_Node", isCustomCard = false }: { text: string, explanation: string, icon: any, label?: string, isCustomCard?: boolean, key?: any }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="relative inline-block group/meta">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleInteraction}
        className={`text-[6px] xs:text-[7px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] flex items-center gap-1.5 sm:gap-2.5 cursor-help transition-all ${
          isCustomCard 
            ? 'text-decensat bg-[#0a1122]/95 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md border border-white/10 shadow-xl' 
            : 'text-slate-500 hover:text-decensat'
        }`}
      >
        {Icon && <Icon size={10} className={`${isCustomCard ? 'text-decensat' : 'text-decensat opacity-60 group-hover/meta:opacity-100'} transition-opacity shrink-0`} />}
        <span className="truncate drop-shadow-sm">{text}</span>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-4 w-48 sm:w-64 p-4 bg-black/95 border border-decensat/30 rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] z-[300] animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2.5 border-b border-white/10 pb-2">
            <Info size={10} className="text-decensat" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">{label}</span>
          </div>
          <p className="text-[9px] font-mono text-slate-400 uppercase leading-relaxed tracking-tight italic">
            {explanation}
          </p>
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-black border-r border-b border-decensat/30 rotate-45" />
        </div>
      )}
    </div>
  );
};

const ProjectCard = memo(({ node, isSelected, onSelect }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [refetchSuccess, setRefetchSuccess] = useState(false);
  const [refetchError, setRefetchError] = useState<string | null>(null);
  
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const isCustomCard = node.id === 'dc-01' || node.id === 'dc-02';

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);

  const handleRetryImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgError(false);
    setIsImgLoading(true);
    setRetryKey(prev => prev + 1);
  };

  const handleRefetch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefetching) return;
    
    setIsRefetching(true);
    setRefetchError(null);
    setRefetchSuccess(false);
    
    try {
      await new Promise((resolve, reject) => {
        const shouldFail = Math.random() < 0.05;
        setTimeout(shouldFail ? reject : resolve, 2000);
      });
      setRefetchSuccess(true);
      setTimeout(() => setRefetchSuccess(false), 2000);
    } catch (err) {
      setRefetchError("SIGNAL_INTERFERENCE: HANDSHAKE_FAILED");
    } finally {
      setIsRefetching(false);
    }
  };

  return (
    <div 
      ref={cardRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(node.id)}
      className={`flex-shrink-0 w-[calc(100vw-3.5rem)] xs:w-[280px] sm:w-[500px] lg:w-[580px] snap-center group bg-black border-2 rounded-[2.2rem] sm:rounded-[4rem] p-5 xs:p-6 sm:p-12 flex flex-col transition-all duration-700 ease-expo relative transform-gpu h-[400px] xs:h-[500px] sm:h-[760px] cursor-pointer ${
        isSelected 
          ? 'border-decensat shadow-[0_0_80px_rgba(163,230,53,0.3)] ring-4 ring-decensat/10 scale-[1.01]' 
          : 'border-white/5 sm:hover:border-decensat/40 sm:hover:shadow-2xl'
      } ${isRefetching ? 'pointer-events-none' : ''}`}
    >
      {(isRefetching || refetchError || refetchSuccess) && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300 rounded-[inherit] overflow-hidden">
           {isRefetching ? (
             <div className="relative flex flex-col items-center gap-10 w-full px-12">
                <div className="absolute inset-0 bg-grid-f4a opacity-10" />
                <div className="absolute inset-x-0 h-1 bg-decensat/20 top-0 animate-scanning-line blur-[2px] z-0" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-decensat/20 animate-ping duration-[3s]" />
                    <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-decensat/40 animate-pulse" />
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-decensat/5 border-t-decensat animate-spin shadow-[0_0_30px_rgba(163,230,53,0.2)]" />
                    <div className="absolute flex items-center justify-center">
                       <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-decensat animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-8 text-center space-y-3">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] sm:text-[12px] font-black text-white uppercase tracking-[0.6em] animate-pulse">Synchronizing_Node</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Activity size={10} className="text-decensat animate-ping" />
                        <span className="text-[7px] sm:text-[8px] font-mono text-slate-500 uppercase tracking-widest">Handshake_v4.5_Active</span>
                      </div>
                    </div>
                    <div className="w-32 sm:w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 bg-decensat w-full animate-shimmer -translate-x-full" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[7px] sm:text-[8px] font-mono text-slate-400 uppercase tracking-widest opacity-60">Uplink: SSL_TERMINATED</p>
                      <p className="text-[7px] sm:text-[8px] font-mono text-decensat uppercase tracking-widest font-black flicker-slow">Target: {node.id}</p>
                    </div>
                  </div>
                </div>
             </div>
           ) : refetchSuccess ? (
             <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-decensat/20 border-2 border-decensat/40 flex items-center justify-center text-decensat shadow-glow-sm">
                   <CheckCircle2 size={32} className="animate-in fade-in slide-in-from-bottom-2" />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-decensat uppercase tracking-[0.4em]">Signal_Parity_Established</span>
                  <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">Protocol Sync Complete</p>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center gap-8 p-8 text-center max-w-sm relative z-10">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border-2 border-rose-500/20">
                  <AlertTriangle size={32} className="text-rose-500 animate-pulse" />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono">{refetchError}</span>
                  <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed px-4">
                    Handshake failed. Protocol requires manual signal refresh.
                  </p>
                </div>
                <button 
                  onClick={handleRefetch}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.3em] hover:bg-decensat hover:text-black transition-all shadow-glow-sm flex items-center gap-3"
                >
                  <RefreshCw size={14} /> RE_INITIALIZE
                </button>
             </div>
           )}
        </div>
      )}

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[inherit]">
        <div className={`w-full h-full transition-transform duration-700 ease-out opacity-100 grayscale-0`}
          style={{ transform: `scale(1.1) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}>
          
          {isImgLoading && !imgError && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}

          {!imgError ? (
            <img 
              key={retryKey}
              src={node.bgTexture} 
              alt="" 
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isImgLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsImgLoading(false)}
              onError={() => { setImgError(true); setIsImgLoading(false); }}
            />
          ) : (
            <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-8 border-2 border-white/5 relative">
               <div className="absolute inset-0 bg-grid-f4a opacity-10" />
               <div className="relative z-10 flex flex-col items-center text-center space-y-6 pointer-events-auto">
                  <div className="relative">
                    <ImageOff size={48} className="text-slate-800" />
                    <ShieldAlert size={16} className="absolute -bottom-1 -right-1 text-rose-500/60" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Texture_Fetch_Failure</p>
                     <button 
                      onClick={handleRetryImage}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[7px] font-black text-slate-500 uppercase tracking-widest hover:text-decensat hover:border-decensat/30 transition-all"
                     >
                       RETRY_SIGNAL_FETCH
                     </button>
                  </div>
               </div>
            </div>
          )}
          <div className="absolute inset-0 opacity-0 bg-transparent" />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 sm:mb-8 gap-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {isCustomCard ? (
              node.systemType.split(' • ').map((tag, i) => (
                <MetadataLabel 
                  key={i}
                  text={tag} 
                  explanation="Protocol-verified technical classification."
                  icon={null}
                  isCustomCard={true}
                />
              ))
            ) : (
              <div className="px-2 sm:px-4 py-1 border border-white/30 bg-black/80 backdrop-blur-md rounded-lg text-[6px] xs:text-[7px] sm:text-[8px] font-mono text-white uppercase tracking-widest sm:group-hover:text-decensat sm:group-hover:border-decensat/50 transition-all shrink-0 shadow-lg">
                REC_{node.id.split('-')[1].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 shrink-0">
            <button 
              onClick={handleRefetch}
              className="p-1 sm:p-2 rounded-lg bg-black/80 backdrop-blur-md border border-white/30 text-white sm:hover:text-decensat transition-all active:scale-90 shadow-lg group/sync"
              title="Sync Project Data"
            >
              <RefreshCw className={`w-2 h-2 sm:w-3.5 sm:h-3.5 transition-transform duration-500 group-hover/sync:rotate-180 ${isRefetching ? 'animate-spin text-decensat' : ''}`} />
            </button>
            <MetadataLabel 
              text={node.year} 
              icon={Calendar} 
              label="Timeline_Node"
              explanation="Chronological timestamp of production deployment."
            />
          </div>
        </div>

        <div className="mb-3 sm:mb-8">
          <h4 className={`text-lg xs:text-2xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-1.5 sm:mb-6 transition-colors leading-[0.85] italic drop-shadow-[0_8px_16px_rgba(0,0,0,1)] ${
            isCustomCard ? 'text-decensat' : 'text-white'
          }`}>
            {node.name}
          </h4>
          {!isCustomCard && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <MetadataLabel 
                text={node.systemType} 
                icon={Activity}
                label="Architecture_Class"
                explanation="Technical classification of the architectural delivery."
              />
              <MetadataLabel 
                text={node.clientStage} 
                icon={Target}
                label="Lifecycle_Phase"
                explanation="Organizational phase determining execution velocity."
              />
            </div>
          )}
        </div>

        <div className="mb-3 sm:mb-6 flex flex-wrap gap-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
              className="flex items-center gap-1.5 text-[6px] xs:text-[7px] sm:text-[10px] font-black text-decensat uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:text-white transition-all group/btn outline-none bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-decensat/30 w-fit shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
              {isExpanded ? '[TERMINATE]' : '[EXPAND]'} {isExpanded ? <ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-90" /> : <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-90" />}
            </button>
            <button 
              onClick={handleRefetch}
              className="flex items-center gap-1.5 text-[6px] xs:text-[7px] sm:text-[10px] font-black text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:text-decensat transition-all outline-none bg-black/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 w-fit shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
              <RefreshCw className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${isRefetching ? 'animate-spin' : ''}`} /> [SYNC]
            </button>
        </div>

        <div className={`transition-all duration-700 ease-expo overflow-hidden ${isExpanded ? 'max-h-[140px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
             <div className="grid grid-cols-1 gap-2 p-3 sm:p-6 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none"><Terminal size={20} /></div>
                <div>
                   <div className="text-[6px] xs:text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Partner Entity</div>
                   <div className="text-[8px] xs:text-[9px] sm:text-sm font-black text-white uppercase tracking-tighter italic truncate">{node.clientPartner}</div>
                </div>
                <div>
                   <div className="text-[6px] xs:text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Audit Status</div>
                   <div className="text-[7px] xs:text-[8px] sm:text-[9px] font-mono text-decensat uppercase tracking-widest flex items-center gap-2">
                     <Shield size={10} /> INSTITUTIONAL_PASS
                   </div>
                </div>
             </div>
        </div>

        <div className="mt-auto pt-3 sm:pt-10 border-t border-white/10 flex flex-col gap-3 sm:gap-8 relative group/desc bg-transparent -mx-4 -mb-4 sm:-mx-10 sm:-mb-10 p-3 sm:p-8 rounded-b-[inherit]">
           <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex-1">
                 <div className="w-fit px-2 py-0.5 sm:px-4 sm:py-2 bg-[#0a1122] border border-white/10 rounded-lg mb-2 sm:mb-4 shadow-2xl">
                    <span className="text-white font-black text-[9px] xs:text-xs sm:text-xl tracking-tighter italic">{node.clientPartner}</span>
                 </div>
                 <p className={`font-black text-[8px] xs:text-[11px] sm:text-lg uppercase tracking-tight leading-relaxed italic border-l-2 border-decensat pl-2 xs:pl-4 sm:pl-6 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] text-white/95 line-clamp-2 sm:line-clamp-none`}>
                   {node.longDescription}
                 </p>
              </div>
              
              {node.caseStudyUrl && node.caseStudyUrl !== '#' && (
                <a 
                   href={node.caseStudyUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={(e) => e.stopPropagation()}
                   className="flex items-center gap-2 px-3 sm:px-8 py-2 sm:py-5 bg-decensat/10 hover:bg-decensat border border-decensat/30 text-decensat hover:text-black backdrop-blur-xl rounded-xl sm:rounded-2xl text-[8px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-glow-sm shrink-0 h-fit text-center"
                 >
                   <FileText className="w-3 h-3 sm:w-[14px] sm:h-[14px]" strokeWidth={3} />
                   VISIT_SITE
                 </a>
              )}
           </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const ExecutionIndexPortfolio: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleSelect = (id: string) => {
    setSelectedNodeId(id === selectedNodeId ? null : id);
  };

  return (
    <div className="space-y-6 sm:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-l-[6px] sm:border-l-[8px] border-decensat pl-4 sm:pl-8 animate-in slide-in-from-left duration-1000">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2.5 sm:gap-4 px-3 py-1 sm:px-6 sm:py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[7px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] shadow-[0_0_30px_rgba(163,230,53,0.15)] w-fit mb-3 sm:mb-8">
            <Database strokeWidth={3} className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
            <span>EXECUTION_INDEX_V4_PROD</span>
          </div>
          <h2 className="text-2xl xs:text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-2 sm:mb-4">
            Execution <span className="text-decensat italic">Index</span>
          </h2>
          <p className="text-xs xs:text-sm lg:text-2xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl opacity-80">
            Deterministic build history and protocol-verified proof of delivery.
          </p>
        </div>
        
        <div className="flex gap-2 sm:gap-4 shrink-0 pb-2">
           <button 
              onClick={() => scroll('left')} 
              className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-600 hover:text-decensat transition-all active:scale-90"
              aria-label="Scroll Left"
           >
              <ChevronLeft strokeWidth={3} className="w-5 h-5 sm:w-8 sm:h-8" />
           </button>
           <button 
              onClick={() => scroll('right')} 
              className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-600 hover:text-decensat transition-all active:scale-90"
              aria-label="Scroll Right"
           >
              <ChevronRight strokeWidth={3} className="w-5 h-5 sm:w-8 sm:h-8" />
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 xs:gap-8 sm:gap-10 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 sm:pb-20 custom-scrollbar-h px-1 sm:px-0"
      >
        {MARKETING_CONFIG.PORTFOLIO.map(node => (
          <ProjectCard 
            key={node.id} 
            node={node as any} 
            isSelected={selectedNodeId === node.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ExecutionIndexPortfolio;
