import React from 'react';
import heroBg from '../assets/backgound for hero section.jpg';
import sevenStars from '../assets/seven-stars.png';

const Hero = () => {
  const stats = [
    { number: '20', label: 'CHARACTERS' },
    { number: '10', label: 'LOCATIONS' },
    { number: '40+', label: 'YEARS' },
  ];

  return (
    <section className="relative w-full border-b-[3px] border-black overflow-hidden min-h-[80vh] flex flex-col justify-center">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url("${heroBg}")` }}
      />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 w-full flex flex-col">

        {/* TOP AREA - DRAGON BALLS & TITLE */}
        <div className="w-full pt-16 pb-12 px-4 flex flex-col items-center text-center">

          <img
            src={sevenStars}
            alt="Seven Dragon Balls"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-8 object-contain drop-shadow-[0_5px_5px_rgba(255,255,255,0.7)]"
          />

          <div className="w-full max-w-2xl bg-[#D32F2F] border-[3px] border-black p-6 sm:p-8 text-white text-left shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

            <h2 className="text-5xl sm:text-6xl font-black leading-[0.85] tracking-tight uppercase mb-4">
              ONE
              <br />
              JOURNEY.
            </h2>

            <p className="text-sm sm:text-base font-medium leading-relaxed tracking-wide opacity-95">
              Forty years of a story that began with a boy, a staff and a river.
              Read every character's arc, trace the route from Mount Paozu to the
              edge of the universe, and discover the path to a full series order guide.
            </p>

          </div>
        </div>

        {/* BOTTOM AREA - BUTTONS & STATS */}
        <div className="w-full py-8 px-6 sm:px-12 flex justify-center">

          <div className="w-full max-w-7xl flex flex-col gap-8">

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5">

              <a
                href="/characters"
                className="bg-black text-white px-8 py-4 font-black text-sm uppercase tracking-widest border-[3px] border-black border-b-[6px] border-b-[#D32F2F] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
              >
                ENTER THE ROSTER
              </a>

              <a
                href="/journey"
                className="bg-[#F4F1EA] text-black px-8 py-4 font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all"
              >
                TRACE THE JOURNEY
              </a>

            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-6">

              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#F4F1EA] border-[3px] border-black px-8 py-5 min-w-[150px] text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >

                  <h4 className="text-5xl font-black text-black leading-none mb-2">
                    {stat.number}
                  </h4>

                  <p className="text-xs font-bold text-gray-700 tracking-widest uppercase">
                    {stat.label}
                  </p>

                </div>
              ))}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;