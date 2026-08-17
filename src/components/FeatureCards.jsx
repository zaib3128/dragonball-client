import React from 'react';

const FeatureCards = () => {
  return (
    <section className="py-16 px-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Card: The Journey Map (Light Card with Dot Pattern) */}
        <div className="relative bg-[#F4F1EA] border-[3px] border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Dot Pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
              backgroundSize: '12px 12px'
            }}
          />

          <div className="relative z-10">
            <span className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase block mb-3">
              INTERACTIVE
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-black uppercase mb-6">
              THE JOURNEY MAP
            </h3>
            <p className="text-gray-800 text-base md:text-lg font-medium leading-relaxed mb-8">
              Ten stops from a mountain house to a god's pillared world, plotted on an inked chart with an animated route line.
            </p>
          </div>

          <a 
            href="/journey" 
            className="relative z-10 self-start font-bold text-sm text-black hover:text-[#D32F2F] uppercase tracking-widest underline decoration-2 underline-offset-4"
          >
            OPEN THE MAP →
          </a>
        </div>

        {/* Right Card: Series Order (Dark/Black Card) */}
        <div className="bg-black text-white border-[3px] border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <span className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase block mb-3">
              WHERE TO WATCH
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-6 text-white">
              SERIES ORDER
            </h3>
            <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed mb-8">
              Every series in viewing order, with episode counts and links to the official licensed streaming platforms.
            </p>
          </div>

          <a 
            href="/watch" 
            className="self-start font-bold text-sm text-white hover:text-[#D32F2F] uppercase tracking-widest underline decoration-2 underline-offset-4"
          >
            OPEN THE GUIDE →
          </a>
        </div>

      </div>
    </section>
  );
};

export default FeatureCards;