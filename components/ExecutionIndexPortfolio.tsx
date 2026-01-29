import React, { useState, useRef, memo, useCallback } from 'react';
import type { StaticImageData } from 'next/image';
import { 
  Database, ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck, FileText
} from 'lucide-react';

// Import local images
import alcoholic from '../assets/images/alcoholic.png';
import alcoholic1 from '../assets/images/alcoholic1.png';
import cafe from '../assets/images/cafe.png';
import cafe1 from '../assets/images/cafe1.png';
import entertainment from '../assets/images/entertainment.png';
import entertainment1 from '../assets/images/entertainment1.png';
import estate from '../assets/images/estate.png';
import estate1 from '../assets/images/estate1.png';
import financial from '../assets/images/financial.png';
import financial1 from '../assets/images/financial1.png';
import fintech from '../assets/images/fintech.png';
import fintech1 from '../assets/images/fintech1.png';
import hr from '../assets/images/hr.png';
import hr1 from '../assets/images/hr2.png'; // Using hr2.png as hover
import interior from '../assets/images/interior.png';
import interior1 from '../assets/images/interior1.png';
import media from '../assets/images/media.png';
import media1 from '../assets/images/media1.png';

interface ProjectNode {
  id: string;
  name: string;
  systemType: string;
  year: string;
  month: string;
  clientPartner: string;
  longDescription: string;
  image: string | StaticImageData;
  hoverImage: string | StaticImageData;
  caseStudyUrl?: string;
  techStack: string[];
}

const toImageSrc = (val: string | StaticImageData) =>
  typeof val === 'string' ? val : val.src;

const PORTFOLIO_DATA: ProjectNode[] = [
  {
    id: 'dc-03',
    name: 'ENTERTAINMENT',
    systemType: 'Media Broadcasting',
    year: '2025',
    month: 'NOVEMBER',
    clientPartner: 'StreamOne',
    longDescription: 'DIGITAL CONTENT DELIVERY NETWORK AND INTERACTIVE STREAMING INFRASTRUCTURE.',
    image: entertainment,
    hoverImage: entertainment1,
    caseStudyUrl: '#',
    techStack: ['Streaming', 'CDN', 'Media']
  },
  {
    id: 'dc-06',
    name: 'FINTECH',
    systemType: 'Digital Assets',
    year: '2025',
    month: 'MAY',
    clientPartner: 'NeoFinance',
    longDescription: 'NEXT-GENERATION FINTECH SOLUTIONS INTEGRATING BLOCKCHAIN AND TRADITIONAL FINANCE.',
    image: fintech,
    hoverImage: fintech1,
    caseStudyUrl: '#',
    techStack: ['Blockchain', 'DeFi', 'Integration']
  },
  {
    id: 'dc-04',
    name: 'REAL ESTATE',
    systemType: 'Property Management',
    year: '2025',
    month: 'JANUARY',
    clientPartner: 'Estate Corp',
    longDescription: 'VIRTUAL PROPERTY SHOWCASE AND ASSET MANAGEMENT DASHBOARD FOR HIGH-VALUE REAL ESTATE.',
    image: estate,
    hoverImage: estate1,
    caseStudyUrl: '#',
    techStack: ['Virtual Tour', 'Asset Mgmt', 'PropTech']
  },
  {
    id: 'dc-05',
    name: 'FINANCIAL',
    systemType: 'Banking Operations',
    year: '2025',
    month: 'APRIL',
    clientPartner: 'Bank Unified',
    longDescription: 'SECURE FINANCIAL TRANSACTION PROCESSING AND BANKING OPERATIONS MANAGEMENT SYSTEM.',
    image: financial,
    hoverImage: financial1,
    caseStudyUrl: '#',
    techStack: ['Security', 'Banking', 'FinOps']
  },
  {
    id: 'dc-09',
    name: 'MEDIA',
    systemType: 'Content Hub',
    year: '2025',
    month: 'JULY',
    clientPartner: 'News Network',
    longDescription: 'CENTRALIZED MEDIA AGGREGATION AND PUBLISHING WORKFLOW AUTOMATION SYSTEM.',
    image: media,
    hoverImage: media1,
    caseStudyUrl: '#',
    techStack: ['Publishing', 'CMS', 'Workflow']
  },
  {
    id: 'dc-07',
    name: 'HR SYSTEMS',
    systemType: 'Talent Management',
    year: '2025',
    month: 'DECEMBER',
    clientPartner: 'StaffDiff',
    longDescription: 'COMPREHENSIVE HUMAN RESOURCES INFORMATION SYSTEM WITH AI-DRIVEN TALENT ANALYTICS.',
    image: hr,
    hoverImage: hr1,
    caseStudyUrl: '#',
    techStack: ['HRIS', 'Analytics', 'AI']
  },
  {
    id: 'dc-02',
    name: 'CAFE',
    systemType: 'Hospitality Management',
    year: '2025',
    month: 'FEBRUARY',
    clientPartner: 'Coffee Chain X',
    longDescription: 'INTEGRATED POINT OF SALE AND CUSTOMER EXPERIENCE PLATFORM FOR MODERN RETAIL COFFEE OUTLETS.',
    image: cafe,
    hoverImage: cafe1,
    caseStudyUrl: '#',
    techStack: ['POS', 'CX', 'Retail']
  },
  {
    id: 'dc-08',
    name: 'INTERIOR',
    systemType: 'Design Studio',
    year: '2025',
    month: 'JUNE',
    clientPartner: 'Design Haus',
    longDescription: 'IMMERSIVE INTERIOR DESIGN VISUALIZATION AND PROJECT MANAGEMENT FOR STUDIOS.',
    image: interior,
    hoverImage: interior1,
    caseStudyUrl: '#',
    techStack: ['3D Viz', 'Design', 'Project Mgmt']
  },
  {
    id: 'dc-01',
    name: 'ALCOHOLIC',
    systemType: 'Supply Chain & Logistics',
    year: '2025',
    month: 'MARCH',
    clientPartner: 'Global Spirits',
    longDescription: 'ADVANCED INVENTORY TRACKING AND DISTRIBUTION NETWORK FOR REGULATED BEVERAGE INDUSTRIES.',
    image: alcoholic,
    hoverImage: alcoholic1,
    caseStudyUrl: '#',
    techStack: ['Supply Chain', 'Tracking', 'Logistics']
  }
];

const ProjectCard = memo(({ node }: { node: ProjectNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);

  return (
    <div className="flex-shrink-0 w-full snap-center group bg-[#020617] border border-white/5 rounded-[3rem] p-8 lg:p-12 flex flex-col transition-all duration-700 ease-expo relative overflow-hidden transform-gpu hover:border-decensat/40 hover:shadow-2xl h-[680px]">
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out pointer-events-none" style={{ transform: `scale(1.1) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}>
        <img src={toImageSrc(node.image)} alt={node.name} className="mt-7 absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0" />
        <img src={toImageSrc(node.hoverImage)} alt={`${node.name} Hover`} className="mt-7 absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent opacity-90" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4 relative group/desc">
           <p className="text-slate-400 font-bold text-sm lg:text-base uppercase tracking-tight leading-relaxed italic border-l-2 border-decensat/40 pl-6 pr-28 transition-all duration-500">
             {node.longDescription}
           </p>
           {node.caseStudyUrl && node.caseStudyUrl !== '#' && (
             <a 
                href={node.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 right-0 flex items-center gap-2 px-3 py-1.5 bg-decensat/10 border border-decensat/20 rounded-lg text-[9px] font-black text-decensat uppercase tracking-widest hover:bg-decensat hover:text-black transition-all shadow-glow-sm"
              >
                <FileText size={12} />
                CASE_STUDY
              </a>
           )}
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between group-hover:text-decensat transition-colors relative z-10">
        <span className="text-[9px] font-mono font-black text-slate-800 uppercase tracking-widest flex items-center gap-3"><ShieldCheck size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" /> {node.month} {node.year} CREDENTIALED</span>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:border-decensat/30">
          <ArrowUpRight size={22} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const ExecutionIndexPortfolio: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-l-[12px] border-decensat pl-12 animate-in slide-in-from-left duration-1000">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-8 shadow-2xl w-fit">
            <Database size={16} className="text-decensat animate-pulse" />
            <span>EXECUTION_INDEX_v4.5.2_PRODUCTION</span>
          </div>
          <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-4 italic">
            Execution <span className="text-decensat not-italic">Index</span>
          </h2>
          <p className="text-xl lg:text-3xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl">
            Deterministic build history and protocol-verified proof of delivery.
          </p>
        </div>

        {/* Scroll Arrow Buttons */}
        <div className="hidden md:flex gap-4 shrink-0">
          <button 
            onClick={() => scroll('left')} 
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
          >
            <ChevronLeft size={32} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
          >
            <ChevronRight size={32} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
      >
        {PORTFOLIO_DATA.map(node => (
          <div key={node.id} className="min-w-[380px] md:min-w-[420px] lg:min-w-[480px]">
            <ProjectCard node={node} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionIndexPortfolio;
