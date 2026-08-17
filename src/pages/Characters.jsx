import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/api';

const Characters = () => {
  const navigate = useNavigate();

  // ================================
  // CHARACTER CATEGORIES
  // ================================

  const categories = [
    "ALL",
    "SAIYAN",
    "NAMEKIAN",
    "HALF-SAIYAN",
    "FROST DEMON",
    "ANDROID",
    "BIO-ANDROID",
    "MAGICAL LIFEFORM",
    "HUMAN",
    "MODIFIED HUMAN",
    "DIVINE BEING",
    "ANGEL",
  ];

  const [activeFilter, setActiveFilter] = useState("ALL");

  // ================================
  // CHARACTER DATA (fetched from backend)
  // ================================

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/characters`);
        if (!response.ok) throw new Error("Failed to fetch characters");
        const data = await response.json();

        // Map backend fields onto what this page's card UI expects:
        // description -> subtitle, action -> signature
        const mapped = data.map((char) => ({
          id: char.id,
          name: char.name,
          race: char.race,
          description: char.subtitle,
          action: char.signature,
        }));

        setCharacters(mapped);
      } catch (err) {
        console.error("Failed to fetch characters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // ================================
  // FILTER CHARACTERS
  // ================================

  const filteredCharacters =
    activeFilter === "ALL"
      ? characters
      : characters.filter(
          (char) => char.race === activeFilter
        );

  // ================================
  // RENDER
  // ================================

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-black font-sans pb-20">

      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">

        {/* ============================
            HEADER
        ============================ */}

        <span className="text-[#D32F2F] font-bold text-sm tracking-[0.2em] uppercase block mb-4">
          {characters.length} ENTRIES
        </span>

        <h1 className="text-5xl md:text-7xl font-normal tracking-tight uppercase mb-8">
          CHARACTER ARCHIVE
        </h1>

        {/* ============================
            FILTER BUTTONS
        ============================ */}

        <div className="flex flex-wrap gap-3 mb-12">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-[2px] border-black transition-colors ${
                activeFilter === category
                  ? "bg-[#D32F2F] text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* ============================
            LOADING / ERROR STATES
        ============================ */}

        {loading && (
          <p className="text-center py-20 font-bold uppercase tracking-widest text-gray-500">
            Loading characters...
          </p>
        )}
        {error && (
          <p className="text-center py-20 font-bold uppercase tracking-widest text-[#D32F2F]">
            Could not load characters. Is the backend running?
          </p>
        )}

        {/* ============================
            CHARACTER GRID
        ============================ */}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredCharacters.map((char) => (
              <div
                key={char.id}
                onClick={() =>
                  navigate(`/characters/${char.id}`)
                }
                className="relative bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[240px] group cursor-pointer hover:-translate-y-1 transition-transform"
              >

                {/* ============================
                    DECORATIVE DOT PATTERN
                ============================ */}

                <div
                  className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#000 1.5px, transparent 1.5px)",
                    backgroundSize: "8px 8px",
                    maskImage:
                      "linear-gradient(to bottom left, black 20%, transparent 80%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom left, black 20%, transparent 80%)",
                  }}
                />

                {/* ============================
                    CARD CONTENT
                ============================ */}

                <div className="relative z-10">

                  <h2 className="text-4xl font-normal tracking-tight mb-1">
                    {char.name}
                  </h2>

                  <span className="text-[#D32F2F] font-bold text-xs tracking-widest uppercase block mb-4">
                    {char.race}
                  </span>

                  <p className="text-gray-600 text-sm md:text-base font-medium">
                    {char.description}
                  </p>

                </div>

                {/* ============================
                    ACTION LINE
                ============================ */}

                <div className="relative z-10 mt-8">

                  <div className="w-full h-[2px] bg-black mb-4" />

                  <div className="flex justify-between items-center">

                    <span className="text-xs font-bold uppercase tracking-widest text-black">
                      {char.action}
                    </span>

                    <span className="text-[#D32F2F] font-bold group-hover:translate-x-1 transition-transform">
                      →
                    </span>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Characters;
