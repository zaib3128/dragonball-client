import React from 'react';

const SagaTicker = () => {
  const sagas = ['PILAF', 'RED RIBBON', 'PICCOLO JR.', 'SAIYAN', 'NAMEK', 'ANDROID', 'CELL', 'MAJIN BUU'];

  return (
    /* Changed 'my-2' to 'mt-10 mb-4' for extra spacing above the section */
    <div className="w-full bg-[#F4F1EA] border-y-[4px] border-black py-3 overflow-hidden select-none mt-14 mb-4 relative flex items-center">
      
      {/* Top Hatch Border Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-[repeating-linear-gradient(45deg,#000,#000_5px,transparent_5px,transparent_10px)] z-10" />

      {/* Scrolling Ticker Container */}
      <div className="flex w-max animate-ticker">
        {[...Array(2)].map((_, blockIndex) => (
          <div 
            key={blockIndex} 
            className="flex whitespace-nowrap items-center gap-8 px-4 text-2xl md:text-3xl font-black tracking-widest text-black uppercase"
          >
            {sagas.map((saga, index) => (
              <React.Fragment key={index}>
                <span>{saga}</span>
                <span className="text-[#D32F2F] text-xl">●</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Hatch Border Line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[repeating-linear-gradient(45deg,#000,#000_5px,transparent_5px,transparent_10px)] z-10" />

    </div>
  );
};

export default SagaTicker;