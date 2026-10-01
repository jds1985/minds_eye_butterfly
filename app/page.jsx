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

const SKETCHBOOK_PAGES = [
  {
    id: 'p1',
    title: 'Butterfly Wing Geometry',
    date: 'Atelier Study #01',
    content: 'Charcoal pencil draft exploring biological symmetry and light dispersion through iridescent chitin scales.',
    sketchType: 'pencil'
  },
  {
    id: 'p2',
    title: 'Sanctum Chandelier Form',
    date: 'Atelier Study #02',
    content: 'Raw ink study capturing the warm filament reflections off dark mahogany ceiling timbers.',
    sketchType: 'ink'
  },
  {
    id: 'p3',
    title: 'Wizard Lucky Sleeping Poses',
    date: 'Atelier Study #03',
    content: 'Quick gestures of Lucky curled in the velvet nook. Tail curled tightly around mystical talisman.',
    sketchType: 'gesture'
  },
  {
    id: 'p4',
    title: 'Violet Resin Translucence',
    date: 'Atelier Study #04',
    content: 'Watercolor pigment notes on mixing deep Prussian blue and violet dye with clear polymer mediums.',
    sketchType: 'watercolor'
  }
];

export default function AtelierStudio() {
  const [activeMode, setActiveMode] = useState('room'); // 'room' | 'laptop' | 'sketchbook'
  const [artworks, setArtworks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [coverOpened, setCoverOpened] = useState(false);

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
  const currentPage = SKETCHBOOK_PAGES[pageIndex];

  const prevArt = () => setActiveIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
  const nextArt = () => setActiveIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));

  const openSketchbook = () => {
    setActiveMode('sketchbook');
    setTimeout(() => setCoverOpened(true), 400);
  };

  const closeSketchbook = () => {
    setCoverOpened(false);
    setTimeout(() => {
      setActiveMode('room');
      setPageIndex(0);
    }, 450);
  };

  const nextPage = () => setPageIndex((prev) => (prev === SKETCHBOOK_PAGES.length - 1 ? 0 : prev + 1));
  const prevPage = () => setPageIndex((prev) => (prev === 0 ? SKETCHBOOK_PAGES.length - 1 : prev - 1));

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none text-white">
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
            onClick={openSketchbook}
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
              ? '60% 84%'
              : '50% 50%',
          transform:
            activeMode === 'laptop'
              ? 'scale(6.2)'
              : activeMode === 'sketchbook'
              ? 'scale(4.8)'
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
            {/* Hotspot 1: Laptop */}
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

            {/* Hotspot 2: Sketchbook on Glass Table */}
            <div
              onClick={openSketchbook}
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

      {/* ===================== SKETCHBOOK PERSPECTIVE ===================== */}
      <div
        className={`absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[5px] transition-all duration-700 pointer-events-none ${
          activeMode === 'sketchbook' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Warm wooden desk backlighting */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />

        {/* Floating Book Header Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
          <button
            onClick={closeSketchbook}
            className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-zinc-950/80 px-4 py-2 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-2xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Den</span>
          </button>

          <span className="text-xs font-serif tracking-widest text-amber-200/80 uppercase">
            Atelier Field Sketchbook • Page {pageIndex + 1} of {SKETCHBOOK_PAGES.length}
          </span>
        </div>

        {/* 3D Sketchbook Container */}
        <div
          className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center transition-all duration-700 ease-out"
          style={{
            perspective: '1400px',
            transform: coverOpened ? 'rotateX(4deg) rotateZ(0deg)' : 'rotateX(20deg) rotateZ(-12deg) scale(0.85)',
          }}
        >
          {/* Closed Leather Cover State */}
          {!coverOpened ? (
            <div className="relative w-[340px] sm:w-[420px] h-[520px] rounded-r-2xl rounded-l-md bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-2 border-amber-800/60 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-8 flex flex-col justify-between items-center text-center">
              {/* Spiral Edge Binding */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-evenly py-4 -translate-x-4">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="h-3 w-7 rounded-full bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-600 shadow-md border border-zinc-700" />
                ))}
              </div>

              <div className="w-full border-b border-amber-700/40 pb-4 mt-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">Archive Volume I</span>
              </div>

              <div className="space-y-3">
                <div className="h-16 w-16 mx-auto rounded-full border border-amber-500/50 flex items-center justify-center bg-amber-900/30">
                  <Sparkles className="h-8 w-8 text-amber-300" />
                </div>
                <h3 className="text-2xl font-serif text-amber-100 tracking-wider">STUDIO DEN SKETCHES</h3>
                <p className="text-xs text-amber-300/60 font-serif italic">Minds Eye Butterfly Atelier</p>
              </div>

              <div className="text-[10px] text-amber-500/70 tracking-widest uppercase font-mono">
                Opening Cover...
              </div>
            </div>
          ) : (
            /* Open Sketchbook Spread (Two Pages + Center Spiral Binding) */
            <div className="relative w-full h-full flex rounded-2xl bg-[#efe8da] text-stone-900 shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-[#d6cbba] overflow-hidden animate-in zoom-in-95 duration-500">
              
              {/* Left Page: Hand-Drawn Artwork Illustration Study */}
              <div className="relative flex-1 p-6 sm:p-10 flex flex-col justify-between border-r border-[#ded4c1] bg-[#f7f2e7]">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-amber-900/[0.04] pointer-events-none" />

                <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-500">{currentPage.date}</span>
                  <span className="text-xs font-serif italic text-stone-600">Archival Graphite & Ink</span>
                </div>

                {/* Hand Drawn Study Canvas Box */}
                <div className="relative my-4 flex-1 rounded-xl border border-stone-300/80 bg-[#ede4d0] shadow-inner flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  <div className="absolute inset-2 border border-dashed border-stone-400/60 rounded-lg pointer-events-none" />
                  
                  <div className="relative z-10 space-y-3 max-w-xs">
                    <div className="h-12 w-12 mx-auto rounded-full bg-amber-900/10 flex items-center justify-center border border-stone-400">
                      <Sparkles className="h-6 w-6 text-stone-700" />
                    </div>
                    <h4 className="text-xl font-serif tracking-wide text-stone-900">{currentPage.title}</h4>
                    <p className="text-xs text-stone-600 font-serif leading-relaxed italic">
                      "{currentPage.content}"
                    </p>
                  </div>
                </div>

                <div className="text-left text-[11px] font-mono text-stone-500">
                  Plate № {pageIndex * 2 + 1}
                </div>
              </div>

              {/* Center Spiral Metal Wire Binding Ring */}
              <div className="relative w-8 sm:w-10 bg-[#e0d6c2] border-x border-[#c9beaa] flex flex-col justify-evenly items-center shadow-inner z-20">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="h-2.5 w-6 rounded-full bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 shadow-sm border border-stone-600" />
                ))}
              </div>

              {/* Right Page: Studio Notes & Annotations */}
              <div className="relative flex-1 p-6 sm:p-10 flex flex-col justify-between bg-[#fbf8f0]">
                {/* Subtle paper line rule */}
                <div className="absolute inset-0 bg-gradient-to-bl from-black/[0.02] via-transparent to-amber-900/[0.03] pointer-events-none" />

                <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                  <span className="text-xs font-serif tracking-wider text-stone-800 font-bold uppercase">Atelier Notes</span>
                  <span className="text-xs font-mono text-stone-400">Study Ref: MEB-{(pageIndex + 1) * 14}</span>
                </div>

                <div className="my-auto space-y-4 font-serif text-stone-700 text-sm leading-relaxed px-2">
                  <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-stone-900 first-letter:mr-1">
                    Light studies collected within the den during evening twilight. High concentrations of amber and deep violet tones complement the natural studio atmosphere.
                  </p>
                  <div className="p-3 rounded-lg bg-stone-200/50 border border-stone-300 text-xs font-mono text-stone-600 space-y-1">
                    <div>• Pigment Base: Ultramarine & Burnt Umber</div>
                    <div>• Medium: Cold-pressed 300gsm Cotton Paper</div>
                    <div>• Curator Verification: Signed by Studio Atelier</div>
                  </div>
                </div>

                {/* Page Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-300">
                  <button
                    onClick={prevPage}
                    className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-200 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous Page</span>
                  </button>

                  <span className="text-xs font-mono text-stone-500">Plate № {pageIndex * 2 + 2}</span>

                  <button
                    onClick={nextPage}
                    className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-200 transition"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
