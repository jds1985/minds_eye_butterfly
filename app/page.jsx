'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Wifi, Battery, Volume2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const FALLBACK_ARTWORKS = [
  {
    id: 'f1',
    title: 'Violet Metamorphosis',
    imageUrl: '/Studio1.jpg',
    medium: 'Digital Fine Art & Acrylic Base'
  },
  {
    id: 'f2',
    title: 'Sanctum Twilight',
    imageUrl: '/den-background.jpg',
    medium: 'Atelier Interior Study'
  }
];

export default function AtelierStudio() {
  const [zoomed, setZoomed] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    try {
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (docs.length > 0) {
            setArtworks(docs);
          } else {
            setArtworks(FALLBACK_ARTWORKS);
          }
        },
        () => setArtworks(FALLBACK_ARTWORKS)
      );
      return () => unsub();
    } catch {
      setArtworks(FALLBACK_ARTWORKS);
    }
  }, []);

  const currentArt = artworks[activeIndex] || artworks[0];

  const prevArt = () => {
    setActiveIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
  };

  const nextArt = () => {
    setActiveIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none text-white">
      {/* Top Banner (Only visible in full room view) */}
      <header
        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 transition-all duration-700 ${
          zoomed ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-serif tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            MINDS EYE BUTTERFLY
          </h1>
          <p className="text-[10px] sm:text-xs tracking-widest text-zinc-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Fine Art Atelier & Interactive Den
          </p>
        </div>

        <button
          onClick={() => setZoomed(true)}
          className="flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-950/70 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md shadow-xl hover:bg-purple-900 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          <span>Inspect Laptop</span>
        </button>
      </header>

      {/* Dynamic Camera Zoom Stage */}
      <div
        className="relative h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          transformOrigin: '59% 68%',
          transform: zoomed ? 'scale(6.2)' : 'scale(1)',
        }}
      >
        <img
          src="/Studio1.jpg"
          alt="Minds Eye Atelier"
          className="h-full w-full object-cover"
        />

        {/* Room View Hotspot Over the Laptop */}
        {!zoomed && (
          <div
            onClick={() => setZoomed(true)}
            className="absolute z-20 cursor-pointer group"
            style={{
              top: '55%',
              left: '54%',
              width: '10%',
              height: '14%',
            }}
            title="Click to sit at the workstation"
          >
            <div className="h-full w-full rounded-md border-2 border-purple-400/50 bg-purple-500/20 group-hover:bg-purple-500/40 transition shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-purple-200 opacity-0 group-hover:opacity-100 transition shadow">
              Click to sit at laptop
            </span>
          </div>
        )}
      </div>

      {/* First-Person Physical Laptop Perspective */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-end bg-black/85 backdrop-blur-[2px] transition-opacity duration-700 pointer-events-none ${
          zoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Glow behind the physical laptop screen */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[80vh] rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />

        {/* Laptop Display Chassis */}
        <div className="relative w-full max-w-6xl h-[86vh] flex flex-col justify-between rounded-t-[28px] border-[12px] sm:border-[16px] border-b-[20px] border-zinc-900 bg-zinc-950 shadow-[0_-15px_60px_rgba(0,0,0,0.95)] overflow-hidden ring-1 ring-zinc-800">
          
          {/* Subtle screen glare reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-purple-400/[0.04] pointer-events-none z-30" />

          {/* Top Bezel with Camera Notch & Status Bar */}
          <div className="relative z-20 flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/90 text-zinc-400 text-xs backdrop-blur">
            {/* Window Dots / Exit Room */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomed(false)}
                title="Close laptop & step back"
                className="h-3.5 w-3.5 rounded-full bg-red-500/90 hover:brightness-125 transition flex items-center justify-center text-[8px] text-black font-bold"
              >
                ×
              </button>
              <div className="h-3.5 w-3.5 rounded-full bg-amber-500/80" />
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-[11px] text-zinc-400">Atelier Studio Pro</span>
            </div>

            {/* Simulated WebCam Center Dot */}
            <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-950 ring-1 ring-zinc-700" />
              <div className="h-1 w-1 rounded-full bg-emerald-400/80 animate-pulse" />
            </div>

            {/* Laptop System Tray & Step Back Action */}
            <div className="flex items-center gap-4 text-zinc-400">
              <button
                onClick={() => setZoomed(false)}
                className="flex items-center gap-1 text-[11px] rounded bg-zinc-800 hover:bg-zinc-700 text-purple-200 px-2 py-0.5 transition"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Exit Desk</span>
              </button>
              <div className="flex items-center gap-2">
                <Wifi className="h-3.5 w-3.5" />
                <Volume2 className="h-3.5 w-3.5" />
                <Battery className="h-3.5 w-3.5 text-zinc-300" />
              </div>
            </div>
          </div>

          {/* Active Laptop Screen Workstation Area */}
          <div className="relative z-10 flex-1 flex flex-col justify-between bg-zinc-950 p-4 sm:p-6 overflow-hidden">
            {/* Art Viewer Header */}
            <div className="text-center space-y-0.5">
              <h2 className="text-base sm:text-xl font-serif tracking-wide text-zinc-100 drop-shadow">
                {currentArt?.title}
              </h2>
              <p className="text-xs text-purple-300">
                {currentArt?.medium} • {activeIndex + 1} of {artworks.length}
              </p>
            </div>

            {/* Main Stage Image with Navigation Paddles */}
            <div className="relative flex-1 flex items-center justify-center p-2 my-auto">
              <button
                onClick={prevArt}
                className="absolute left-2 sm:left-4 z-20 rounded-full border border-zinc-700 bg-zinc-900/80 p-2.5 sm:p-3 text-white shadow-xl hover:bg-purple-900 hover:border-purple-400 transition"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="relative h-full max-h-[52vh] w-full max-w-3xl flex items-center justify-center">
                <img
                  key={currentArt?.id}
                  src={currentArt?.imageUrl}
                  alt={currentArt?.title}
                  className="max-h-full max-w-full rounded-md object-contain border border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-300"
                />
              </div>

              <button
                onClick={nextArt}
                className="absolute right-2 sm:right-4 z-20 rounded-full border border-zinc-700 bg-zinc-900/80 p-2.5 sm:p-3 text-white shadow-xl hover:bg-purple-900 hover:border-purple-400 transition"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Bottom Dock / Thumbnail Selector */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
              {artworks.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    activeIndex === idx
                      ? 'border-purple-400 scale-105 shadow-[0_0_12px_rgba(168,85,247,0.7)]'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Chin Bezel Branding */}
          <div className="relative z-20 bg-zinc-900/95 py-1 text-center border-t border-zinc-800">
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono">
              MINDS EYE ATELIER
            </span>
          </div>
        </div>

        {/* Physical Laptop Aluminum Keyboard Deck & Hinge Bottom Perspective */}
        <div className="relative w-full max-w-7xl h-10 sm:h-14 bg-gradient-to-b from-zinc-800 via-zinc-850 to-zinc-900 border-t border-zinc-700 shadow-2xl rounded-t-sm flex items-center justify-center">
          {/* Recessed Screen Hinge */}
          <div className="absolute -top-1 w-48 sm:w-64 h-2 bg-zinc-950 rounded-b border-b border-zinc-700" />
          
          {/* Subtle Top Edge of the Trackpad */}
          <div className="w-24 sm:w-36 h-2 rounded-t-md border-t border-zinc-600/40 bg-zinc-800/40" />
        </div>
      </div>
    </main>
  );
}
