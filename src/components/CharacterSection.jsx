import React from 'react';

const CharacterSection = ({ characters }) => {
  return (
    <section className="py-20 px-6 max-w-[1400px] mx-auto">
      
      {/* Section Title Header */}
      <div className="mb-12 border-b-[3px] border-black pb-4">
        <h3 className="text-[#D32F2F] font-bold tracking-[0.2em] text-sm mb-1 uppercase">
          The Core Cast
        </h3>
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
          Fighters & Fixers
        </h2>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {characters.map((char) => (
          <div 
            key={char.id} 
            className="bg-white border-[3px] border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header: Name + Kanji */}
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-5xl font-black tracking-tighter">{char.name}</h3>
                <span className="text-2xl text-gray-400 font-serif">{char.kanji}</span>
              </div>

              {/* Subtitle */}
              <p className="text-[#D32F2F] font-bold text-xs tracking-widest mb-4 uppercase">
                {char.subtitle}
              </p>

              {/* Character Image Area */}
              <div className="flex items-center justify-center border-y-[3px] border-black border-dashed py-6 my-4 bg-[#F4F1EA] h-64">
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="h-full object-contain filter drop-shadow-md" 
                />
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {char.description}
              </p>
            </div>

            {/* Read Arc Link */}
            <a 
              href={`/characters/${char.id}`} 
              className="font-bold text-sm text-black hover:text-[#D32F2F] transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              Read the Arc →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CharacterSection;