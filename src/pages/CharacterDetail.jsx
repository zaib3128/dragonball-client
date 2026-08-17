import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import bgImage from '../assets/bg2.jpg';
import characterImages from '../data/characterImages';

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/characters/${id}`);

        if (!response.ok) {
          throw new Error('Character not found');
        }

        const data = await response.json();
        setCharacter(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  /* ================================
     LOADING
     ================================ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA]">
        <p className="font-bold uppercase tracking-widest">
          Loading character...
        </p>
      </div>
    );
  }

  /* ================================
     ERROR
     ================================ */

  if (error || !character) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F1EA] gap-4">
        <p className="font-bold uppercase tracking-widest text-[#D32F2F]">
          Character not found
        </p>

        <Link
          to="/characters"
          className="underline font-bold uppercase text-sm"
        >
          ← Back to Archive
        </Link>
      </div>
    );
  }

  /* ================================
     CHARACTER DATA
     ================================ */

  const characterImage = characterImages[character.id];
  const story = character.story || [];
  const stats = character.stats || {};
  const appearsIn = character.appearsIn || [];

  return (
    <div
      className="min-h-screen text-black font-sans pb-24 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* ==========================================
          BACKGROUND OVERLAY
          Keeps bg2.jpg visible but subtle
          ========================================== */}

      <div className="absolute inset-0 bg-[#F4F1EA]/80 pointer-events-none" />

      {/* ==========================================
          PAGE CONTENT
          ========================================== */}

      <div className="relative z-10">

        {/* ==========================================
            CHARACTER HERO
            ========================================== */}

        <section className="relative border-b-[3px] border-black overflow-hidden py-12 px-6 sm:px-12 min-h-[40vh] flex items-center">

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-8 md:pt-0">

            {/* CHARACTER NAME / TITLE */}

            <div className="flex flex-col items-start w-full md:w-3/5">

              <Link
                to="/characters"
                className="text-xs font-bold tracking-widest uppercase mb-6 hover:text-[#D32F2F] transition-colors flex items-center gap-1"
              >
                ← ARCHIVE
              </Link>

              <h1 className="text-7xl sm:text-9xl font-normal tracking-tight uppercase leading-none mb-4">
                {character.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">

                <span className="bg-[#D32F2F] text-white px-4 py-2 font-black text-xs sm:text-sm tracking-widest uppercase">
                  {character.subtitle || character.race}
                </span>

                {character.kanji && (
                  <span className="text-2xl text-gray-800 font-serif">
                    {character.kanji}
                  </span>
                )}

              </div>

            </div>

            {/* CHARACTER IMAGE */}

            <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-8 md:mt-0">

              {characterImage ? (
                <img
                  src={characterImage}
                  alt={character.name}
                  className="max-h-[350px] md:max-h-[450px] object-contain drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-300"
                />
              ) : (
                <div className="w-64 h-64 border-[3px] border-dashed border-gray-400 flex items-center justify-center text-gray-400 font-bold text-sm tracking-widest text-center">
                  IMAGE PENDING
                </div>
              )}

            </div>

          </div>

        </section>

        {/* ==========================================
            MAIN CONTENT
            ========================================== */}

        <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ========================================
              LEFT COLUMN
              ======================================== */}

          <div className="lg:col-span-7 flex flex-col gap-10">

            {/* STORY */}

            <div>

              <h2 className="text-3xl font-normal tracking-tight uppercase mb-8">
                THE STORY
              </h2>

              {story.length > 0 ? (
                <div className="flex flex-col gap-6">

                  {story.map((paragraph, idx) => (
                    <div
                      key={idx}
                      className="border-l-[4px] border-black pl-5 py-1"
                    >
                      <p className="text-lg leading-relaxed text-gray-900 font-bold">
                        {paragraph}
                      </p>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-gray-600 font-medium italic">
                  Full story details coming soon.
                </p>
              )}

            </div>

            {/* APPEARS IN */}

            {appearsIn.length > 0 && (
              <div className="pt-6">

                <h2 className="text-2xl font-normal tracking-tight uppercase mb-6">
                  APPEARS IN
                </h2>

                <div className="flex flex-wrap gap-3">

                  {appearsIn.map((saga) => (
                    <span
                      key={saga}
                      className="bg-white border-[2px] border-black px-4 py-2 font-bold text-xs tracking-wider uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {saga}
                    </span>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* ========================================
              RIGHT COLUMN
              ======================================== */}

          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* DATA FILE */}

            <div className="bg-white/90 backdrop-blur-sm border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

              <span className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase block mb-6">
                DATA FILE
              </span>

              <div className="flex flex-col gap-5 text-sm">

                {/* RACE */}

                <div>
                  <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-1">
                    RACE
                  </span>

                  <span className="font-bold text-base text-black">
                    {character.race}
                  </span>
                </div>

                {/* SIGNATURE */}

                <div>
                  <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-1">
                    SIGNATURE
                  </span>

                  <span className="font-bold text-base text-black">
                    {character.signature || character.action}
                  </span>
                </div>

                {/* AFFILIATION */}

                {character.affiliation && (
                  <div>
                    <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-1">
                      AFFILIATION
                    </span>

                    <span className="font-bold text-base text-black">
                      {character.affiliation}
                    </span>
                  </div>
                )}

                {/* DEBUT */}

                {character.debut && (
                  <div>
                    <span className="text-xs font-bold text-gray-600 tracking-wider uppercase block mb-1">
                      DEBUT
                    </span>

                    <span className="font-bold text-base text-black">
                      {character.debut}
                    </span>
                  </div>
                )}

              </div>

            </div>

            {/* FAN RATINGS */}

            {Object.keys(stats).length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                <span className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase block mb-6">
                  FAN RATINGS
                </span>

                <div className="flex flex-col gap-4">

                  {Object.entries(stats).map(([stat, val]) => (
                    <div key={stat}>

                      <div className="flex justify-between text-xs font-bold tracking-wider uppercase mb-1">
                        <span>{stat}</span>
                        <span>{val}</span>
                      </div>

                      <div className="w-full h-4 bg-gray-200 border-[2px] border-black overflow-hidden p-[1px]">

                        <div
                          className="h-full bg-[#D32F2F] border-r-[1px] border-black transition-all duration-500"
                          style={{ width: `${val}%` }}
                        />

                      </div>

                    </div>
                  ))}

                </div>

                <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mt-6">
                  SUBJECTIVE FAN ESTIMATES, NOT CANON FIGURES
                </p>

              </div>
            )}

            {/* NEXT CHARACTER */}

            {character.nextId && (
              <button
                onClick={() =>
                  navigate(`/characters/${character.nextId}`)
                }
                className="w-full bg-white border-[3px] border-black p-5 text-left font-black text-sm tracking-widest uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors flex justify-between items-center group"
              >

                <span>
                  NEXT: {character.nextName}
                </span>

                <span className="text-[#D32F2F] group-hover:text-white transition-colors">
                  →
                </span>

              </button>
            )}

          </div>

        </section>

      </div>
    </div>
  );
};

export default CharacterDetail;