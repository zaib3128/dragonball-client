import React, { useState } from 'react';

const CharacterSlider = ({ characters }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === characters.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? characters.length - 1 : prevIndex - 1
    );
  };

  // The currently displayed character
  const char = characters[currentIndex];

  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      
      {/* Section Title Header */}
      <div className="mb-12 border-b-[3px] border-black pb-4">
        <h3 className="text-[#D32F2F] font-bold tracking-[0.2em] text-sm mb-1 uppercase">
          The Core Cast
        </h3>
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
          Fighters & Fixers
        </h2>
      </div>

      {/* Main Slider Container */}
      <div className="bg-white border-[3px] border-black p-6 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-10 relative">
        
        {/* Left Side: Character Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center border-[3px] border-black border-dashed bg-[#F4F1EA] p-8 h-[400px] md:h-[500px]">
          <img 
            key={char.id} // Forces re-render on slide change for a snappy transition
            src={char.image} 
            alt={char.name} 
            className="w-full h-full object-contain filter drop-shadow-xl animate-fade-in" 
          />
        </div>

        {/* Right Side: Text & Buttons */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-6xl md:text-7xl font-black tracking-tighter uppercase">{char.name}</h3>
            <span className="text-4xl text-gray-300 font-serif">{char.kanji}</span>
          </div>
          
          <p className="text-[#D32F2F] font-bold text-sm tracking-widest mb-6 uppercase">
            {char.subtitle}
          </p>
          
          <p className="text-gray-800 text-lg md:text-xl leading-relaxed mb-10 font-medium">
            {char.description}
          </p>

          <a 
            href={`/characters/${char.id}`} 
            className="inline-block w-max border-[3px] border-black px-6 py-3 font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200 mb-8 md:mb-0"
          >
            Read the Arc →
          </a>

          {/* Navigation Buttons (Positioned bottom right on desktop) */}
          <div className="flex gap-4 md:absolute md:bottom-12 md:right-12 justify-end">
            <button 
              onClick={prevSlide}
              className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-full hover:bg-[#D32F2F] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-200"
              aria-label="Previous Character"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-full hover:bg-[#D32F2F] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-200"
              aria-label="Next Character"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

        </div>
      </div>
      
      {/* Pagination Indicators (Dots) */}
      <div className="flex justify-center gap-3 mt-12">
        {characters.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 transition-all duration-300 border-2 border-black ${
              currentIndex === idx ? 'w-10 bg-[#D32F2F]' : 'w-3 bg-transparent'
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default CharacterSlider;