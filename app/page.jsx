'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, BookOpen, Wifi, Battery, Volume2 } from 'lucide-react';
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
  const [activeMode, setActiveMode] = useState('room'); // 'room' | 'laptop' | 'sketchbook'
  const [artworks, setArtworks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sketchIndex, setSketchIndex] = useState(0);
  const [pageFlipping, setPageFlipping] = useState(false);

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
  const currentSketch = artworks[sketchIndex] || artworks[0];

  const prevArt = () => setActiveIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
  const nextArt = () => setActiveIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));

  const nextSketch = () => {
    if (pageFlipping) return;
    setPageFlipping(true);
    setTimeout(() => {
      setSketchIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));
      setPageFlipping(false);
    }, 280);
  };

  const prevSketch = () => {
    if (pageFlipping) return;
    setPageFlipping(true);
    setTimeout(() => {
      setSketchIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
      setPageFlipping(false);
    }, 280);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none text-white font-sans">
      {/* Top Banner (Only visible in full room view) */}
      <header
        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 transition-all duration-700 ${
          activeMode !== 'room' ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMode('laptop')}
            className="flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-950/70 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md shadow-xl hover:bg-purple-900 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
            <span>Laptop</span>
          </button>
          <button
            onClick={() => setActiveMode('sketchbook')}
            className="flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-950/70 px-4 py-2 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-xl hover:bg-amber-900 transition"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-300" />
            <span>Sketchbook</span>
          </button>
        </div>
      </header>

      {/* Dynamic Camera Zoom Stage */}
      <div
        className="relative h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{
          transformOrigin:
            activeMode === 'laptop'
              ? '59% 68%'
              : activeMode === 'sketchbook'
              ? '58% 82%'
              : '50% 50%',
          transform:
            activeMode === 'laptop'
              ? 'scale(6.2)'
              : activeMode === 'sketchbook'
              ? 'scale(3.6)'
              : 'scale(1)',
        }}
      >
        <img
          src="/Studio1.jpg"
          alt="Minds Eye Atelier"
          className="h-full w-full object-cover"
        />

        {/* Room View Hotspots */}
        {activeMode === 'room' && (
          <>
            {/* Hotspot: Laptop */}
            <div
              onClick={() => setActiveMode('laptop')}
              className="absolute z-20 cursor-pointer group"
              style={{
                top: '55%',
                left: '54%',
                width: '10%',
                height: '14%',
              }}
              title="Click to sit at the laptop"
            >
              <div className="h-full w-full rounded-md border-2 border-purple-400/50 bg-purple-500/20 group-hover:bg-purple-500/40 transition shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-purple-200 opacity-0 group-hover:opacity-100 transition shadow">
                Sit at laptop
              </span>
            </div>

            {/* Hotspot: Spiral Sketchbook on the Table */}
            <div
              onClick={() => setActiveMode('sketchbook')}
              className="absolute z-20 cursor-pointer group"
              style={{
                top: '68%',
                left: '52%',
                width: '18%',
                height: '18%',
                transform: 'rotate(8deg)',
              }}
              title="Click to inspect sketchbook"
            >
              <div className="h-full w-full rounded-lg border-2 border-amber-400/50 bg-amber-500/20 group-hover:bg-amber-500/40 transition shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-amber-200 opacity-0 group-hover:opacity-100 transition shadow">
                Open Sketchbook
              </span>
            </div>
          </>
        )}
      </div>

      {/* ======================= LAPTOP PERSPECTIVE ======================= */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-end bg-black/60 backdrop-blur-[4px] transition-opacity duration-700 pointer-events-none ${
          activeMode === 'laptop' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[85vw] h-[65vh] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

        <div className="relative w-full max-w-5xl h-[80vh] flex flex-col justify-between rounded-t-[32px] p-[10px] sm:p-[14px] pb-0 bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.2)]">
          <div className="relative flex-1 flex flex-col justify-between rounded-t-[22px] bg-zinc-950 border border-zinc-700/80 shadow-inner overflow-hidden">
            <div className="relative z-20 flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/95 text-zinc-300 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMode('room')}
                  title="Close laptop & step back"
                  className="h-3.5 w-3.5 rounded-full bg-rose-500 hover:brightness-125 transition flex items-center justify-center text-[9px] text-zinc-950 font-black shadow"
                >
                  ×
                </button>
                <div className="h-3.5 w-3.5 rounded-full bg-amber-500/90 shadow" />
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/90 shadow" />
                <span className="ml-3 font-mono text-[11px] text-zinc-300 font-semibold tracking-wider">Atelier Gallery Display</span>
              </div>

              <div className="absolute left-1/2 top-2 -translate-x-1/2 flex items-center gap-2 px-3 py-0.5 rounded-full bg-zinc-950/80 border border-zinc-800">
                <div className="h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-zinc-600" />
                <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveMode('room')}
                  className="flex items-center gap-1.5 text-xs rounded-md bg-purple-950/70 hover:bg-purple-900 border border-purple-400/50 text-purple-200 px-3 py-1 font-medium transition shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Room</span>
                </button>
                <div className="flex items-center gap-2 text-zinc-400 pl-2 border-l border-zinc-800">
                  <Wifi className="h-3.5 w-3.5" />
                  <Volume2 className="h-3.5 w-3.5" />
                  <Battery className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-purple-300/[0.05] pointer-events-none z-30" />

            <div className="relative z-10 flex-1 flex flex-col justify-between bg-zinc-900/90 p-4 sm:p-6 overflow-hidden">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-2xl font-serif tracking-wide text-zinc-100 drop-shadow-md">
                  {currentArt?.title}
                </h2>
                <p className="text-xs text-purple-300 font-medium">
                  {currentArt?.medium} • {activeIndex + 1} of {artworks.length}
                </p>
              </div>

              <div className="relative flex-1 flex items-center justify-center p-2 my-auto">
                <button
                  onClick={prevArt}
                  className="absolute left-2 sm:left-4 z-30 rounded-full border border-zinc-600 bg-zinc-800/90 p-3 text-white shadow-2xl hover:bg-purple-950 hover:border-purple-400 transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="relative h-full max-h-[46vh] w-full max-w-3xl flex items-center justify-center">
                  <img
                    key={currentArt?.id}
                    src={currentArt?.imageUrl}
                    alt={currentArt?.title}
                    className="max-h-full max-w-full rounded-lg object-contain border border-zinc-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-300"
                  />
                </div>

                <button
                  onClick={nextArt}
                  className="absolute right-2 sm:right-4 z-30 rounded-full border border-zinc-600 bg-zinc-800/90 p-3 text-white shadow-2xl hover:bg-purple-950 hover:border-purple-400 transition"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
                {artworks.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      activeIndex === idx
                        ? 'border-purple-400 scale-105 shadow-[0_0_12px_rgba(168,85,247,0.8)]'
                        : 'border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative z-20 bg-zinc-950 py-1.5 text-center border-t border-zinc-800">
              <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-mono font-bold">
                MINDS EYE ATELIER
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-6xl h-16 sm:h-20 bg-gradient-to-b from-zinc-400 via-zinc-500 to-zinc-700 rounded-t-xl border-t-2 border-zinc-200/40 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center">
          <div className="w-56 sm:w-80 h-3 bg-zinc-900 border-b border-zinc-600 rounded-b-md shadow-inner" />
          <div className="w-[85%] h-3.5 mt-1 bg-zinc-800/90 rounded border border-zinc-600/60 shadow-inner flex items-center justify-center gap-1.5 px-3">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="h-2 flex-1 rounded-[1.5px] bg-zinc-700 border-t border-zinc-500/40 shadow-sm" />
            ))}
          </div>
          <div className="w-32 sm:w-48 h-3 mt-1.5 rounded-t-lg bg-zinc-400/80 border-t-2 border-zinc-300 shadow-inner" />
        </div>
      </div>

      {/* ===================== VERTICAL PORTRAIT SKETCHBOOK ===================== */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activeMode === 'sketchbook' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Soft amber illumination on desk surface */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />

        {/* Top Control Header */}
        <div className="w-full max-w-xl flex items-center justify-between mb-3 px-2 z-50">
          <button
            onClick={() => setActiveMode('room')}
            className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-black/85 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Close & Return to Den</span>
          </button>

          <span className="text-xs font-serif tracking-widest text-amber-200/90 uppercase drop-shadow">
            Page {sketchIndex + 1} of {artworks.length}
          </span>
        </div>

        {/* Vertical Portrait Pad Container with Side Arrows */}
        <div className="relative w-full max-w-xl flex items-center justify-center">
          
          {/* Flip Back Arrow */}
          <button
            onClick={prevSketch}
            className="absolute -left-4 sm:-left-12 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Previous page"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Single Portrait Sheet Pad */}
          <div
            onClick={nextSketch}
            className={`relative w-full max-w-md h-[78vh] flex flex-col justify-between rounded-b-xl bg-[#f5ede0] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(180,150,110,0.3)] border-x border-b border-[#c8baa0] overflow-hidden cursor-pointer group transition-all duration-300 ${
              pageFlipping ? 'scale-[0.97] -translate-y-2 opacity-75' : 'scale-100 translate-y-0 opacity-100'
            }`}
            title="Click to flip to next page"
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/[0.06] via-transparent to-stone-900/[0.08] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none z-20" />

            {/* TOP WIRE SPIRAL BINDING */}
            <div className="relative w-full h-9 bg-[#dfd4be] border-b border-[#bfae94] flex items-center justify-evenly px-4 shadow-md z-30">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-stone-400 via-stone-200 to-stone-600 shadow-sm border border-stone-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-900 shadow-inner -mt-1" />
                </div>
              ))}
            </div>

            {/* Micro Perforation Line under spiral */}
            <div className="w-full border-b border-dashed border-stone-400/80 my-1 pointer-events-none" />

            {/* MAIN PORTRAIT SKETCH CANVAS */}
            <div className="relative flex-1 mx-4 sm:mx-6 my-2 flex items-center justify-center p-2 rounded-lg bg-[#efe4d2] border border-stone-300 shadow-inner overflow-hidden">
              <img
                key={currentSketch?.id}
                src={currentSketch?.imageUrl}
                alt={currentSketch?.title}
                className="max-h-[58vh] w-auto max-w-full rounded object-contain shadow-md filter contrast-105 transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* BOTTOM HANDWRITTEN ANNOTATION FOOTER */}
            <div className="px-6 pb-4 pt-1 flex items-center justify-between border-t border-stone-300/80 text-stone-700">
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide text-stone-900">
                  {currentSketch?.title}
                </h4>
                <p className="font-serif italic text-xs text-stone-600">
                  {currentSketch?.medium || 'Atelier Study'}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest block">
                  Sheet № {sketchIndex + 1}
                </span>
                <span className="text-[11px] font-serif text-amber-800 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  Turn Page →
                </span>
              </div>
            </div>
          </div>

          {/* Flip Forward Arrow */}
          <button
            onClick={nextSketch}
            className="absolute -right-4 sm:-right-12 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Next page"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>
    </main>
  );
}
