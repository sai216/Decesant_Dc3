import React, { useState, useRef, useEffect, memo } from 'react';
import { Database, Zap, ArrowUpRight, Cpu, Layers, CheckCircle2, FileText, ChevronDown, Activity, ShieldCheck, Globe, Cpu as CpuIcon, BarChart3, TrendingUp, Network, ExternalLink, Target, Sparkles, Fingerprint, Lock, ArrowRight, Radio, ShieldAlert, RefreshCw, Loader2 } from 'lucide-react';
import { PORTFOLIO_IMAGES } from '../assets/images/registry';

interface PortfolioItem {
  id: string;
  name: string;
  systemType: string;
  executionScope: string;
  clientStage: 'MVP' | 'Growth' | 'Enterprise' | 'Internal';
  signals: string[];
  year: string;
  demoUrl: string;
  caseStudyUrl: string;
  longDescription: string;
  bgImage: string;
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'dc-01', name: 'QUANTUM LEDGER', systemType: 'Financial Settlement Rails', executionScope: 'Infrastructure Engineering', clientStage: 'Enterprise', signals: ['High-Throughput', 'L2_Optimized', 'Audit_Locked'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://fundio.vc',
    longDescription: 'HARDENED, HIGH-THROUGHPUT SETTLEMENT PROTOCOL FOR INSTITUTIONAL TREASURY OPERATIONS. BUILT ON MODULAR ARCHITECTURE WITH ZERO-LATENCY GOALS.',
    bgImage: PORTFOLIO_IMAGES.QUANTUM_LEDGER
  },
  {
    id: 'dc-02', name: 'VOX ORCHESTRATOR', systemType: 'Agentic Workflow Engine', executionScope: 'Design + Core Dev', clientStage: 'Growth', signals: ['LLM_Native', 'Real-time_Sync', 'BDR_Enabled'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/vox',
    longDescription: 'AUTONOMOUS COGNITIVE ORCHESTRATION LAYER FOR SUPPLY CHAIN OPTIMIZATION. SYNCHRONIZES LLM-DRIVEN AGENTS WITH LEGACY ERP SYSTEMS TO AUTOMATE COMPLEX DECISION-MAKING LOOPS.',
    bgImage: PORTFOLIO_IMAGES.VOX_ORCHESTRATOR
  },
  {
    id: 'dc-03', name: 'BOTANICAL CMS', systemType: 'Asset Management', executionScope: 'Full System Re-architect', clientStage: 'Internal', signals: ['Sovereign_Control', 'Static_Edge', 'SRT_Integrated'], year: '2023', demoUrl: '#', caseStudyUrl: 'https://decensat.com/botanical',
    longDescription: 'INTERNAL CULTURE-FIRST ASSET MANAGEMENT SYSTEM. UTILIZING LOCALIZED EDGE NODES AND SOVEREIGN IDENTITY-LINKED ACCESS CONTROL FOR PRINCIPAL-LEVEL NODES.',
    bgImage: PORTFOLIO_IMAGES.BOTANICAL_CMS
  },
  {
    id: 'dc-04', name: 'NEXUS RESERVE', systemType: 'Liquidity Aggregator', executionScope: 'Protocol Engineering', clientStage: 'Enterprise', signals: ['Yield_Managed', 'L1/L2_Rails', 'Risk_Verified'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/nexus',
    longDescription: 'INSTITUTIONAL LIQUIDITY LAYER FOR DECENTRALIZED TREASURY MANAGEMENT. FEATURES AUTOMATED YIELD REBALANCING AND RISK MITIGATION PROTOCOLS.',
    bgImage: PORTFOLIO_IMAGES.NEXUS_RESERVE
  },
  {
    id: 'dc-05', name: 'HYPER VAULT', systemType: 'Secure Custody Protocol', executionScope: 'Security Architecture', clientStage: 'Enterprise', signals: ['Biometric', 'ZK-Proof', 'Cold_Storage'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/hyper-vault',
    longDescription: 'ADVANCED ASSET ISOLATION PROTOCOL PROVIDING BIOMETRIC-LINKED HARDWARE SECURITY FOR HIGH-VALUE VENTURE ASSETS.',
    bgImage: PORTFOLIO_IMAGES.HYPER_VAULT
  },
  {
    id: 'dc-06', name: 'NEURAL BRIDGE', systemType: 'AI Data Interop', executionScope: 'Technical Implementation', clientStage: 'Growth', signals: ['Native_Interop', 'Sub-Sec_Latency', 'Distributed'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/neural-bridge',
    longDescription: 'DATA BRIDGING BETWEEN LEGACY SYSTEMS AND AGENTIC LLM NODES. ENSURES HIGH-FIDELITY SIGNAL PARITY ACROSS DISPARATE DATABASES.',
    bgImage: PORTFOLIO_IMAGES.NEURAL_BRIDGE
  },
  {
    id: 'dc-07', name: 'AETHER DEX', systemType: 'Decentralized Exchange', executionScope: 'Full Stack Build', clientStage: 'MVP', signals: ['Deep_Liquidity', 'Gas_Optimized', 'Hyper_Scale'], year: '2023', demoUrl: '#', caseStudyUrl: 'https://decensat.com/aether',
    longDescription: 'LIQUIDITY OPTIMIZED DEX WITH LOW-SLIPPAGE ROUTING AND INSTITUTIONAL ORDER MATCHING FOR INSTITUTIONAL-SCALE TRADES.',
    bgImage: PORTFOLIO_IMAGES.AETHER_DEX
  },
  {
    id: 'dc-08', name: 'TITAN MESH', systemType: 'Global Node Infra', executionScope: 'Network Strategy', clientStage: 'Enterprise', signals: ['Infinite_Uptime', 'Global_Distro', 'Resilient'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/titan',
    longDescription: 'GEOGRAPHICALLY DISTRIBUTED SERVER CLUSTERS FOR RESILIENT DAPP HOSTING AND DECENTRALIZED CLOUD COMPUTE ORCHESTRATION.',
    bgImage: PORTFOLIO_IMAGES.TITAN_MESH
  },
  {
    id: 'dc-09', name: 'SOLARIS ERP', systemType: 'Venture Ops System', executionScope: 'Managed Services', clientStage: 'Internal', signals: ['Strict_Logic', 'Unified_Ops', 'Settled_Draw'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/solaris',
    longDescription: 'UNIFIED EXECUTION SYSTEM FOR VENTURE MANAGEMENT AND RESOURCE ALLOCATION. OPTIMIZED FOR MULTI-TENANT WORKFLOW TRACKING.',
    bgImage: PORTFOLIO_IMAGES.SOLARIS_ERP
  },
  {
    id: 'dc-10', name: 'ORACLE NODE', systemType: 'Data Feed', executionScope: 'Technical Implementation', clientStage: 'Growth', signals: ['Signed_Data', 'High_Signal', 'Verified_Auth'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/oracle',
    longDescription: 'INSTITUTIONAL DATA INGESTION LAYER FOR REAL-TIME MARKET SIGNALS. VERIFIED PROOF OF DELIVERY FOR EXTERNAL DATA CONSUMPTION.',
    bgImage: PORTFOLIO_IMAGES.ORACLE_NODE
  }
];

const ProjectCard = memo(({ item, isSelected, onSelect }: { item: PortfolioItem, isSelected: boolean, onSelect: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleAction = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRefetch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefetching) return;
    setIsRefetching(true);
    // Simulate technical latency for institutional data sync
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefetching(false);
  };

  return (
    <div 
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(item.id); }}
      className={`group bg-zinc-950 border-2 rounded-[3.5rem] p-8 lg:p-12 flex flex-col transition-all duration-700 ease-expo relative overflow-hidden transform-gpu outline-none min-h-[620px] h-auto ${
        isSelected 
          ? 'border-decensat shadow-[0_0_100px_rgba(163,230,53,0.3)] ring-4 ring-decensat/10 ring-offset-4 ring-offset-zinc-950 scale-[1.01]' 
          : 'border-white/5 hover:border-decensat/40 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] focus-visible:ring-4 focus-visible:ring-decensat focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950'
      } ${isRefetching ? 'pointer-events-none' : ''}`}
      style={{
        transform: `perspective(2000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg)`
      }}
    >
      {/* Refetching Overlay */}
      {isRefetching && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="relative mb-6">
              <div className="w-