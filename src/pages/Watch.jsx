import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

// Shows the entry's poster as a full-width banner (cropped to fit this
// wide strip). If the image file isn't there yet (404), the whole banner
// collapses away instead of leaving a broken-image icon — a colored
// placeholder strip (using the entry's own accent color) shows in its
// place so the card doesn't look empty.
// Clicking opens the COMPLETE, uncropped poster in a lightbox (see
// Lightbox below) — this thumbnail is just a cropped preview of it.
const PosterBanner = ({ entry, onOpen }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="w-full h-3 border-b-[3px] border-black"
        style={{ background: entry.color }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="w-full aspect-[21/9] border-b-[3px] border-black overflow-hidden bg-gray-100 block cursor-pointer group relative"
      aria-label={`View full ${entry.title} poster`}
    >
      <img
        src={entry.image}
        alt={`${entry.title} poster`}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
      {/* Hover hint that this opens the full poster, not an in-place zoom */}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-[2px] border-white">
          View Full Poster
        </span>
      </span>
    </button>
  );
};

// Full-size, uncropped poster lightbox with a Watch Now button. object-contain
// (not object-cover) guarantees the entire image is always visible regardless
// of its aspect ratio — nothing gets cut off like the card banner's crop does.
// Closes on backdrop click, the close button, or Escape.
const Lightbox = ({ entry, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!entry) return null;

  const hasLink = Boolean(entry.watchLink);

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative bg-white border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white border-[2px] border-black font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 z-10"
          aria-label="Close"
        >
          ×
        </button>

        <div className="w-full max-h-[70vh] flex items-center justify-center bg-gray-100 border-b-[3px] border-black">
          <img
            src={entry.image}
            alt={`${entry.title} poster`}
            className="w-full h-full max-h-[70vh] object-contain"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight uppercase mb-1">
            {entry.title}
          </h2>
          <p className="text-xs font-bold tracking-widest uppercase text-gray-600 mb-5">
            {entry.years} · {entry.episodes}
          </p>

          {hasLink ? (
            <a
              href={entry.watchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-sm font-bold uppercase tracking-wider border-[2px] border-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:opacity-90 transition-opacity"
              style={{ background: entry.color }}
            >
              Watch Now
            </a>
          ) : (
            <span className="inline-block px-6 py-3 text-sm font-bold uppercase tracking-wider border-[2px] border-black text-gray-400 bg-gray-100 cursor-not-allowed">
              Link coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Watch = () => {
  const [recommended, setRecommended] = useState(true);
  const [openEntry, setOpenEntry] = useState(null);

  const [entries, setEntries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesRes, moviesRes, upcomingRes] = await Promise.all([
          fetch(`${API_BASE_URL}/series`),
          fetch(`${API_BASE_URL}/movies`),
          fetch(`${API_BASE_URL}/upcoming`),
        ]);
        const [seriesData, moviesData, upcomingData] = await Promise.all([
          seriesRes.json(),
          moviesRes.json(),
          upcomingRes.json(),
        ]);
        setEntries(seriesData);
        setMovies(moviesData);
        setUpcoming(upcomingData);
      } catch (err) {
        console.error('Failed to fetch watch page data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-black font-sans pb-24">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <span className="text-[#D32F2F] font-bold text-sm tracking-[0.2em] uppercase block mb-4">
          VIEWING GUIDE
        </span>
        <h1 className="text-5xl md:text-7xl font-normal tracking-tight uppercase mb-6">
          THE WATCH ORDER
        </h1>
        <p className="text-gray-700 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10">
          Forty years, six series, and a franchise that keeps un-ending itself.
          Here's every release in order — and which ones you can actually skip.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setRecommended(true)}
            className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider border-[2px] border-black transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              recommended ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Recommended Route
          </button>
          <button
            onClick={() => setRecommended(false)}
            className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider border-[2px] border-black transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
              !recommended ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Every Episode
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-center font-bold uppercase tracking-widest text-gray-500 py-12">
          Loading watch guide...
        </p>
      )}

      {error && !loading && (
        <p className="text-center font-bold uppercase tracking-widest text-red-600 py-12">
          Couldn't load the watch guide — is the server running?
        </p>
      )}

      {!loading && !error && (
        <>
          {/* TIMELINE */}
          <div className="max-w-4xl mx-auto px-6 relative">
            <div className="absolute left-[27px] sm:left-[35px] top-2 bottom-2 w-[3px] bg-black" />

            <div className="flex flex-col gap-12">
              {entries.map((entry) => {
                const muted = recommended && entry.muteInRecommended;
                return (
                  <div key={entry.id} className="relative pl-16 sm:pl-24">
                    {/* Year medallion */}
                    <div
                      className="absolute left-0 top-0 w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full border-[4px] bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      style={{ borderColor: entry.color }}
                    >
                      <span className="text-black font-black text-xs sm:text-sm">
                        {entry.startYear}
                      </span>
                    </div>

                    <div
                      className={`bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden ${
                        muted ? 'opacity-45 grayscale-[60%]' : 'opacity-100'
                      }`}
                    >
                      <PosterBanner entry={entry} onOpen={setOpenEntry} />

                      <div className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold tracking-[0.2em] text-gray-500">
                            VOL. {entry.volume}
                          </span>
                          {entry.tag && (
                            <span
                              className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 border-[2px] border-black text-white"
                              style={{ background: entry.color }}
                            >
                              {entry.tag}
                            </span>
                          )}
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight uppercase mb-1">
                          {entry.title}
                        </h2>
                        <p className="text-xs font-bold tracking-widest uppercase text-gray-600 mb-4">
                          {entry.years} · {entry.episodes}
                        </p>
                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                          {entry.description}
                        </p>

                        {entry.watchLink ? (
                          <a
                            href={entry.watchLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-[2px] border-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:opacity-90 transition-opacity"
                            style={{ background: entry.color }}
                          >
                            Watch Now
                          </a>
                        ) : (
                          <span className="inline-block mt-4 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-[2px] border-black text-gray-400 bg-gray-100 cursor-not-allowed">
                            Link Coming Soon
                          </span>
                        )}

                        {entry.inset && (
                          <p className="text-xs sm:text-sm text-gray-600 italic border-l-[3px] border-black pl-3 mt-4">
                            {entry.inset}
                          </p>
                        )}

                        {entry.films && (
                          <div className="mt-5 pt-5 border-t-2 border-dashed border-gray-300">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 block mb-3">
                              Canon Films — Watch Alongside
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {entry.films.map((film) => (
                                <div key={film.title} className="border-[2px] border-black p-3">
                                  <p className="font-bold text-sm uppercase">
                                    {film.title}{' '}
                                    <span className="text-gray-500 font-normal">
                                      ({film.year})
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">{film.note}</p>
                                  {film.watchLink && (
                                    <a
                                      href={film.watchLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block mt-3 px-4 py-2 text-[10px] font-bold uppercase tracking-wider border-[2px] border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:opacity-90 transition-opacity"
                                      style={{ background: entry.color }}
                                    >
                                      Watch Movie
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* MOVIES */}
              {movies.length > 0 && (
                <div className="relative pl-16 sm:pl-24">
                  <div className="absolute left-0 top-0 w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full border-[4px] bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-[#D32F2F]">
                    <span className="text-black font-black text-xs sm:text-sm">FILM</span>
                  </div>

                  <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
                    <div className="mb-5">
                      <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                        MOVIE COLLECTION
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-normal tracking-tight uppercase mt-1">
                        Dragon Ball Movies
                      </h2>
                      <p className="text-sm text-gray-700 mt-2">
                        Standalone films worth watching alongside the main timeline.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {movies.map((movie) => (
                        <div
                          key={movie.id}
                          className="border-[2px] border-black overflow-hidden bg-white"
                        >
                          <div className="w-full aspect-[16/9] bg-gray-100 border-b-[2px] border-black overflow-hidden">
                            <img
                              src={movie.image}
                              alt={`${movie.title} poster`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="p-4">
                            <div className="flex flex-wrap items-baseline gap-2 mb-2">
                              <h3 className="font-bold text-base uppercase">{movie.title}</h3>
                              <span className="text-xs text-gray-500 font-bold">
                                ({movie.year})
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                              {movie.note}
                            </p>

                            {movie.watchLink ? (
                              <a
                                href={movie.watchLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-[2px] border-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:opacity-90 transition-opacity"
                                style={{ background: '#D32F2F' }}
                              >
                                Watch Movie
                              </a>
                            ) : (
                              <span className="inline-block px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-[2px] border-black text-gray-400 bg-gray-100 cursor-not-allowed">
                                Link Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* UPCOMING */}
              {upcoming.length > 0 && (
                <div className="relative pl-16 sm:pl-24">
                  <div className="absolute left-0 top-0 w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full border-[4px] border-dashed border-[#D32F2F] bg-[#F4F1EA] flex items-center justify-center">
                    <span className="text-[#D32F2F] font-black text-[10px] sm:text-xs">2026</span>
                  </div>

                  <div className="relative border-[3px] border-dashed border-black p-6 bg-white overflow-hidden">
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-[0.07] pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)',
                        backgroundSize: '10px 10px',
                        maskImage: 'linear-gradient(to bottom left, black 20%, transparent 80%)',
                        WebkitMaskImage:
                          'linear-gradient(to bottom left, black 20%, transparent 80%)',
                      }}
                    />
                    <span className="relative text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase block mb-4">
                      On the Horizon — Announced Jan 2026
                    </span>
                    <div className="relative flex flex-col gap-5">
                      {upcoming.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                          {item.image && (
                            <div className="w-full sm:w-32 h-40 sm:h-20 flex-shrink-0 border-[2px] border-black overflow-hidden bg-gray-100">
                              <img
                                src={item.image}
                                alt={`${item.title} poster`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.parentElement.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="flex flex-wrap items-baseline gap-2 mb-1">
                              <h3 className="text-xl sm:text-2xl font-normal uppercase tracking-tight">
                                {item.title}
                              </h3>
                              <span className="text-xs font-bold text-[#D32F2F] uppercase tracking-wide">
                                {item.window}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
  <p className="text-xs text bold-gray-500 font-medium max-w-xl mx-auto">
    Most of the franchise streams on Crunchyroll. Availability shifts by region
    and changes over time, so it's worth a quick check before committing to a
    few hundred episodes.
  </p>

  <p className="text-xs text bold-gray-500 font-medium max-w-xl mx-auto mt-3">
    For free viewing, check 9anime or Aniwatch or other
    licensed services available in your region.
  </p>
</div>
        </>
      )}

      <Lightbox entry={openEntry} onClose={() => setOpenEntry(null)} />
    </div>
  );
};

export default Watch;
