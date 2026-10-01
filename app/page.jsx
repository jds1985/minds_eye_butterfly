'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
            title="Click to view art on laptop screen"
          >
            <div className="h-full w-full rounded-md border-2 border-purple-400/50 bg-purple-500/20 group-hover:bg-purple-500/40 transition shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-purple-200 opacity-0 group-hover:opacity-100 transition shadow">
              Click to view art
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen Laptop Gallery Experience (Fades seamlessly once zoomed in) */}
      <div
        className={`absolute inset-0 z-40 flex flex-col justify-between bg-zinc-950 transition-opacity duration-700 ${
          zoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Laptop Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
          <button
            onClick={() => setZoomed(false)}
            className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-zinc-900 px-4 py-2 text-xs font-medium text-purple-200 hover:bg-zinc-800 transition shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Step back to room</span>
          </button>

          <div className="text-center">
            <h2 className="text-sm sm:text-base font-serif tracking-wide text-zinc-100">
              {currentArt?.title || 'Atelier Collection'}
            </h2>
            <p className="text-[10px] text-zinc-400">
              {currentArt?.medium || 'Original Work'} • {activeIndex + 1} of {artworks.length}
            </p>
          </div>

          <div className="w-28 text-right text-xs font-mono text-zinc-500 hidden sm:block">
            MindsEye Portfolio
          </div>
        </div>

        {/* Artwork Carousel Viewport */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-10 overflow-hidden">
          {/* Previous Arrow */}
          <button
            onClick={prevArt}
            className="absolute left-4 sm:left-8 z-50 rounded-full border border-zinc-700 bg-black/60 p-3 text-white hover:bg-purple-900/80 hover:border-purple-400 transition"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Main Displayed Artwork */}
          <div className="relative h-full max-h-[75vh] w-full max-w-4xl flex items-center justify-center">
            <img
              key={currentArt?.id}
              src={currentArt?.imageUrl}
              alt={currentArt?.title}
              className="max-h-full max-w-full rounded-lg object-contain shadow-[0_10px_35px_rgba(0,0,0,0.9)] border border-zinc-800 animate-in fade-in zoom-in-95 duration-500"
            />
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextArt}
            className="absolute right-4 sm:right-8 z-50 rounded-full border border-zinc-700 bg-black/60 p-3 text-white hover:bg-purple-900/80 hover:border-purple-400 transition"
            aria-label="Next artwork"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Thumbnail Strip at Bottom */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto px-6 py-4 border-t border-zinc-900 bg-zinc-950">
          {artworks.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition ${
                activeIndex === idx ? 'border-purple-400 scale-105 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
