import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapPoster from '../assets/DBZ.webp';
import { API_BASE_URL } from '../config/api';

// Actual pixel dimensions of DBZ.webp (checked directly on the file)
const IMAGE_WIDTH = 1785;
const IMAGE_HEIGHT = 1261;

// Leaflet's CRS.Simple treats [0,0] as bottom-left with y increasing upward.
// Our image (and the backend's x/y percentages) use top-left origin, y increasing
// downward. This bounds shape is the standard pattern for a non-geographic
// "fantasy map" in Leaflet.
const IMAGE_BOUNDS = [[0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH]];

// The default (initial) view is padded slightly beyond the image's true
// edges — this shows a thin blank margin around the poster art itself,
// like a frame mat. The three off-map planet locations (Namek, Yardrat,
// Supreme Kai's World) live in that top margin, fully clear of the artwork
// and every Earth-side marker, and are visible without panning since this
// is the starting view.
const FIT_PADDING = 110;
const FIT_BOUNDS = [
  [-FIT_PADDING, -FIT_PADDING],
  [IMAGE_HEIGHT + FIT_PADDING, IMAGE_WIDTH + FIT_PADDING],
];

// Panning is allowed a bit further than the initial frame, so a popup
// opening near any edge (including the margin planets) always has room to
// auto-pan into rather than getting clipped by the container.
const PAN_PADDING = 260;
const MAX_PAN_BOUNDS = [
  [-PAN_PADDING, -PAN_PADDING],
  [IMAGE_HEIGHT + PAN_PADDING, IMAGE_WIDTH + PAN_PADDING],
];

// Converts backend {x, y} percentages (0-100, top-left origin) into
// Leaflet [lat, lng] coordinates for CRS.Simple. Values outside 0-100 are
// valid — they land in the padded margin, used for the off-map planets.
function percentToLatLng(x, y) {
  const pixelX = (x / 100) * IMAGE_WIDTH;
  const pixelY = (y / 100) * IMAGE_HEIGHT;
  return [IMAGE_HEIGHT - pixelY, pixelX];
}

// When the same location is visited more than once in a journey (e.g. the
// Tournament in the Dragon Ball saga), stacking markers exactly on top of
// each other hides all but the last one. Spread repeat visits out in a
// small spiral around the true point so every stop stays visible and
// clickable. `occurrence` is 0 for the first visit (no offset), 1+ for
// each repeat.
function offsetLatLng([lat, lng], occurrence) {
  if (occurrence === 0) return [lat, lng];
  const GOLDEN_ANGLE = 2.399963; // ~137.5deg in radians, keeps repeats from lining up
  const RADIUS_STEP = 22; // pixels between successive repeats
  const angle = occurrence * GOLDEN_ANGLE;
  const radius = RADIUS_STEP * occurrence;
  return [lat + radius * Math.sin(angle), lng + radius * Math.cos(angle)];
}

// Off-map locations that get a custom illustrated planet icon instead of
// the standard dot/badge marker, since they represent whole other worlds
// rather than a spot on Earth. Colors are original, not lifted from the
// show's own key art.
const PLANET_STYLES = {
  planet_namek: { fill: '#3FA66B', ring: '#1F6B44', shade: '#0F3D28' },
  yardrat: { fill: '#E08A3C', ring: '#A85A1F', shade: '#6B3410' },
  supreme_kai_world: { fill: '#F2D06B', ring: '#C99A2E', shade: '#9C6E12' },
};

// Default, unselected marker (small red pulsing dot) for ordinary Earth locations.
const dbIcon = L.divIcon({
  className: 'db-map-marker',
  html: `
    <div class="db-marker-outer">
      <div class="db-marker-pulse"></div>
      <div class="db-marker-dot"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

// Numbered marker used for the active journey's stops, colored per-saga.
function createNumberedIcon(number, color) {
  return L.divIcon({
    className: 'db-numbered-marker',
    html: `<div class="db-numbered-badge" style="background:${color}">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

// Illustrated planet marker for off-map worlds. `number` is optional — pass
// it when the planet is a stop in the active journey so the sequence is
// still readable; omit it for the default "explore" view.
function createPlanetIcon(style, number = null) {
  return L.divIcon({
    className: 'db-planet-marker',
    html: `
      <div class="db-planet-icon" style="--planet-fill:${style.fill}; --planet-ring:${style.ring}; --planet-shade:${style.shade}">
        <div class="db-planet-sparkle db-planet-sparkle-1"></div>
        <div class="db-planet-sparkle db-planet-sparkle-2"></div>
        <div class="db-planet-ring"></div>
        <div class="db-planet-body">
          <div class="db-planet-shade"></div>
          ${number ? `<span class="db-planet-number">${number}</span>` : ''}
        </div>
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -26],
  });
}

function getIcon(locId, number, color) {
  const planetStyle = PLANET_STYLES[locId];
  if (planetStyle) return createPlanetIcon(planetStyle, number);
  return number ? createNumberedIcon(number, color) : dbIcon;
}

const JOURNEY_BUTTONS = [
  { key: 'dragon-ball', label: 'DRAGON BALL' },
  { key: 'saiyan-saga', label: 'SAIYAN SAGA' },
  { key: 'cell-saga', label: 'CELL SAGA' },
  { key: 'buu-saga', label: 'BUU SAGA' },
];

const JourneyMap = () => {
  const [locations, setLocations] = useState([]);
  const [journeys, setJourneys] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeJourney, setActiveJourney] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, journeyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/locations`),
          fetch(`${API_BASE_URL}/journeys`),
        ]);
        const locData = await locRes.json();
        const journeyData = await journeyRes.json();
        setLocations(locData);
        setJourneys(journeyData);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const locationById = useMemo(() => {
    const map = {};
    locations.forEach((loc) => {
      map[loc.id] = loc;
    });
    return map;
  }, [locations]);

  const markers = useMemo(
    () =>
      locations.map((loc) => ({
        ...loc,
        latLng: percentToLatLng(loc.x, loc.y),
      })),
    [locations]
  );

  // Resolve the active journey's stops into full location + coordinate data.
  // Stops that revisit the same location get a spiraled-out offset (see
  // offsetLatLng) so repeat visits don't hide behind the most recent one.
  const activeStops = useMemo(() => {
    if (!activeJourney || !journeys[activeJourney]) return [];
    const seenCount = {};
    return journeys[activeJourney].stops
      .map((stop) => {
        const loc = locationById[stop.id];
        if (!loc) return null;
        const occurrence = seenCount[stop.id] || 0;
        seenCount[stop.id] = occurrence + 1;
        const baseLatLng = percentToLatLng(loc.x, loc.y);
        return {
          ...loc,
          blurb: stop.blurb,
          latLng: offsetLatLng(baseLatLng, occurrence),
        };
      })
      .filter(Boolean);
  }, [activeJourney, journeys, locationById]);

  const activeStopIds = useMemo(() => new Set(activeStops.map((s) => s.id)), [activeStops]);
  const journeyColor = activeJourney ? journeys[activeJourney]?.color : null;

  const handleToggle = (key) => {
    setActiveJourney((prev) => (prev === key ? null : key));
  };

  return (
    <div className="w-full py-8 px-4 sm:px-8 font-sans">
      <div className="max-w-[1600px] mx-auto mb-6 text-center">
        <span className="text-[#D32F2F] font-bold text-sm tracking-[0.2em] uppercase block mb-2">
          INTERACTIVE
        </span>
        <h1 className="text-4xl md:text-6xl font-normal tracking-tight uppercase mb-6">
          THE JOURNEY MAP
        </h1>

        <div className="flex flex-wrap justify-center gap-3">
          {JOURNEY_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleToggle(btn.key)}
              className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider border-[2px] border-black transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                activeJourney === btn.key
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative w-full max-w-[1600px] mx-auto border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        style={{ height: '75vh' }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F4F1EA] z-[1000]">
            <p className="font-bold uppercase tracking-widest">Loading map...</p>
          </div>
        )}

        <MapContainer
          crs={L.CRS.Simple}
          bounds={FIT_BOUNDS}
          maxBounds={MAX_PAN_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={-2}
          maxZoom={0.5}
          zoomSnap={0.25}
          attributionControl={false}
          style={{ height: '100%', width: '100%', background: '#F4F1EA' }}
        >
          <ImageOverlay url={mapPoster} bounds={IMAGE_BOUNDS} />

          {/* Route line for the active journey */}
          {activeStops.length > 1 && (
            <Polyline
              positions={activeStops.map((s) => s.latLng)}
              pathOptions={{
                color: journeyColor,
                weight: 4,
                dashArray: '12,10',
                className: 'db-journey-line',
              }}
            />
          )}

          {/* Base markers — dimmed for stops covered by the active journey,
              since those get the numbered badge instead. Namek/Yardrat/
              Supreme Kai's World use an illustrated planet icon instead of
              the default dot. */}
          {markers
            .filter((loc) => !activeStopIds.has(loc.id))
            .map((loc) => (
              <Marker
                key={loc.id}
                position={loc.latLng}
                icon={getIcon(loc.id, null, null)}
                opacity={activeJourney ? 0.35 : 1}
                keyboard={false}
              >
                <Popup
                  autoPan={true}
                  autoPanPaddingTopLeft={[24, 24]}
                  autoPanPaddingBottomRight={[24, 24]}
                >
                  <span className="db-popup-label">{loc.label}</span>
                </Popup>
              </Marker>
            ))}

          {/* Numbered stops for the active journey (rendered in order; a
              location revisited later in the same saga, like the Tournament,
              gets a separate numbered badge each time it appears — offset via
              offsetLatLng so repeats don't hide behind each other). Planet
              locations keep their illustrated look with the number overlaid. */}
          {activeStops.map((stop, idx) => (
            <Marker
              key={`${activeJourney}-${stop.id}-${idx}`}
              position={stop.latLng}
              icon={getIcon(stop.id, idx + 1, journeyColor)}
              keyboard={false}
            >
              <Popup
                autoPan={true}
                autoPanPaddingTopLeft={[24, 24]}
                autoPanPaddingBottomRight={[24, 24]}
              >
                <span className="db-popup-journey-title">{idx + 1}. {stop.label}</span>
                <span className="db-popup-journey-blurb">{stop.blurb}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default JourneyMap;
