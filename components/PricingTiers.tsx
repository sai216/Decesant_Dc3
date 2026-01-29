
import React, { useState, useRef } from 'react';
import { ChevronUp, ChevronDown, Zap, ShieldCheck, Activity, Target } from 'lucide-react';
import BundleCard from './BundleCard';
import ServiceBookingModal from './ServiceBookingModal';
// Added comment: Missing import for UI_TEXTURES from the image registry
import { UI_TEXTURES } from '../assets/images/registry';

interface PricingTiersProps {
  title: string;
  subtitle: string;
  data: any[];
  icon: React.ReactNode;
  color: string;
  accentBorder: string;
}

const PricingTiers: React.FC<PricingTiersProps> = ({ title, subtitle, data = [], icon, color, accentBorder }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const showArrows = data.length > 3;

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#020617] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      {selectedItem && (
        <ServiceBookingModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          initialStep="confirmation"
        />
      )}

      <div className="max-w-[1920px] mx-auto w-full relative">
        {/* Header Block */}
        <div className={`mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 border-l-[10px] ${accentBorder} pl-8 animate-in slide-in-from-left duration-1000`}>
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl shrink-0 group">
               <div className="sm:group-hover:scale-110 sm:group-hover:rotate-12 transition-transform duration-700 text-decensat">{icon}</div>
            </div>
            <div className="max-w-4xl">
              <h3 className="text-3xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-3 italic">{title}</h3>
              <p className="text-slate-500 font-bold uppercase text-[10px] sm:text-lg lg:text-2xl tracking-[0.2em] italic">{subtitle}</p>
            </div>
          </div>
          
          {showArrows && (
            <div className="hidden md:flex gap-4 shrink-0 pb-2">
              <button 
                onClick={() => scroll('up')} 
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
              >
                <ChevronUp size={32} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={() => scroll('down')} 
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
              >
                <ChevronDown size={32} strokeWidth={3} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Bundle Grid */}
        <div 
          ref={scrollRef} 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 transition-all duration-500 ${showArrows ? 'lg:h-[1600px] overflow-y-auto scroll-smooth' : ''}`}
        >
          {data.map((item, idx) => {
            // Mapping incoming data to Bundle format for the BundleCard
            const bundleFormat = {
                id: item.id,
                slug: item.id,
                name: item.name,
                shortSummary: item.summary,
                description: item.summary,
                category: title,
                tags: item.features || [],
                heroImage: UI_TEXTURES.ABSTRACT_NODES,
                deliverables: item.features || [],
                timeline: 'T+SLA_WINDOW',
                jobDuration: 'Project Based',
                sla: '99.9%',
                team: [
                    { role: 'Principal Architect', count: 1, seniority: 'Lead', location: 'Onshore' },
                    { role: 'Node Developer', count: 2, seniority: 'Senior', location: 'Distributed' }
                ],
                licensing: 'IP Ownership',
                paymentTerms: 'UCP Settlement',
                usageRights: 'Unlimited',
                renewalPolicy: 'N/A',
                stack: item.features || [],
                prerequisites: [],
                prices: [{ id: 'p1', currency: 'USDC', amount: item.price, billingType: 'one-time', formatted: `$${item.price.toLocaleString()}` }],
                priceHistory: [],
                tier: item.tier,
                rating: 5,
                reviewCount: 10
            };

            return (
                <div key={idx} className="h-full">
                <BundleCard 
                    bundle={bundleFormat as any} 
                    onAddToCart={() => setSelectedItem(item)}
                />
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
