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

// Rich Artist Sketchbook Pages (Visual sketches, studies, and notes)
const SKETCHBOOK_PAGES = [
  {
    id: 'p1',
    leftTitle: 'Chitin Lattice & Iridescence',
    leftNote: 'Field sketch of Morpho peleides wing scales under 40x magnification. The purple hue is structural, bending twilight light rather than utilizing pigment.',
    leftPlate: 'Plate 01 - Chitin Geometry',
    rightTitle: 'Metamorphosis Concept',
    rightNote: 'Final ink draft mapping wing vein flow into the oil painting base. Note the asymmetric curl along the lower apex.',
    rightPlate: 'Plate 02 - Vein Blueprint',
    artworkUrl: '/Studio1.jpg',
    drawingType: 'butterfly'
  },
  {
    id: 'p2',
    leftTitle: 'Den Chandelier & Timber Arch',
    leftNote: 'Rapid charcoal gesture captured from the velvet armchair. Soft amber glow from the Edison filaments reflecting across the mahogany rafters.',
    leftPlate: 'Plate 03 - Interior Light Study',
    rightTitle: 'Glass Table Refraction',
    rightNote: 'Study on candle reflections and the dark lacquer top of the cocktail table. Deep violet shadows ground the workstation.',
    rightPlate: 'Plate 04 - Refraction Grid',
    artworkUrl: '/den-background.jpg',
    drawingType: 'interior'
  },
  {
    id: 'p3',
    leftTitle: 'Lucky at Rest (Velvet Nook)',
    leftNote: 'Wizard cat asleep by the potion shelf. Ear twitches every few minutes to the crackle of the hearth fire.',
    leftPlate: 'Plate 05 - Feline Gesture Study',
    rightTitle: 'Talisman & Hat Proportions',
    rightNote: 'Drafting the miniature peaked wizard cap and obsidian charm. Lucky permitted exactly three minutes of posing before falling back asleep.',
    rightPlate: 'Plate 06 - Arcane Apparel',
    artworkUrl: '/Studio1.jpg',
    drawingType: 'cat'
  }
];

export default function AtelierStudio() {
  const [activeMode, setActiveMode] = useState('room'); // 'room' | 'laptop' | 'sketchbook'
  const [artworks, setArtworks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

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

  const nextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setPageIndex((prev) => (prev === SKETCHBOOK_PAGES.length - 1 ? 0 : prev + 1));
      setIsFlipping(false);
    }, 250);
  };

  const prevPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setPageIndex((prev) => (prev === 0 ? SKETCHBOOK_PAGES.length - 1 : prev - 1));
      setIsFlipping(false);
    }, 250);
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
              ? 'scale(3.8)'
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
              title="Click to open artist sketchbook"
            >
              <div className="h-full w-full rounded-lg border-2 border-amber-400/50 bg-amber-500/20 group-hover:bg-amber-500/40 transition shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-amber-200 opacity-0 group-hover:opacity-100 transition shadow">
                Open Artist Sketchbook
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

      {/* ===================== REAL ARTIST SKETCHBOOK ===================== */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activeMode === 'sketchbook' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Warm Lamp Illumination on Table */}
        <div className="absolute w-[800px] h-[500px] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Top Control Header */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-3 px-2 z-50">
          <button
            onClick={() => setActiveMode('room')}
            className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-black/85 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Close & Return to Den</span>
          </button>

          <span className="text-xs font-serif tracking-widest text-amber-200/90 uppercase drop-shadow">
            Atelier Sketchbook • Spread {pageIndex + 1} of {SKETCHBOOK_PAGES.length}
          </span>
        </div>

        {/* The Open Sketchbook Workstation with Side Navigation Arrows */}
        <div className="relative w-full max-w-5xl flex items-center justify-center">
          
          {/* Big Floating Left Page Turn Arrow */}
          <button
            onClick={prevPage}
            className="absolute -left-3 sm:-left-6 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Flip to previous sketch page"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Sketchbook Physical Pad Container */}
          <div
            className={`relative w-full h-[68vh] sm:h-[72vh] flex rounded-2xl bg-[#f0e7d5] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(180,150,110,0.3)] border border-[#c4b59b] overflow-hidden transition-all duration-300 ${
              isFlipping ? 'scale-[0.98] opacity-80 rotate-[-0.5deg]' : 'scale-100 opacity-100 rotate-0'
            }`}
          >
            {/* Paper Texture Overlay (Grain, fiber specks, corner shading) */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/[0.08] via-transparent to-stone-900/[0.08] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none z-20" />

            {/* LEFT PAGE: Pencil / Ink Drawing Study (Click to flip backward) */}
            <div
              onClick={prevPage}
              className="relative flex-1 p-5 sm:p-8 flex flex-col justify-between bg-[#f4ece0] border-r border-[#d4c7b2] cursor-pointer group"
              title="Click left page to flip back"
            >
              {/* Header plate */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <span className="font-mono text-[10px] tracking-wider uppercase text-stone-500 font-bold">
                  {currentPage.leftPlate}
                </span>
                <span className="text-[11px] font-serif italic text-stone-600">
                  Graphite & Sepia Wash
                </span>
              </div>

              {/* Hand-Drawn Sketch Illustration Frame */}
              <div className="relative flex-1 my-3 rounded-lg border border-dashed border-stone-400/70 bg-[#ede4d3] p-2 flex flex-col items-center justify-center overflow-hidden shadow-inner group-hover:border-amber-600/70 transition">
                <img
                  src={currentPage.artworkUrl}
                  alt={currentPage.leftTitle}
                  className="max-h-[30vh] w-auto rounded object-contain filter contrast-125 sepia-[0.35] opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="mt-2 text-xs font-serif font-bold text-stone-800 tracking-wide">
                  {currentPage.leftTitle}
                </span>
              </div>

              {/* Handwritten Artist Annotation */}
              <div className="font-serif italic text-xs text-stone-700 leading-relaxed border-t border-stone-300 pt-2">
                "{currentPage.leftNote}"
              </div>
            </div>

            {/* CENTER SPIRAL BINDING: Real double-loop metal wire coils */}
            <div className="relative w-8 sm:w-10 bg-[#dfd4c0] border-x border-[#c2b49d] flex flex-col justify-between py-3 items-center shadow-inner z-30">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="relative flex items-center justify-center w-full">
                  <div className="h-3 w-7 rounded-full bg-gradient-to-r from-stone-400 via-stone-200 to-stone-600 shadow-md border border-stone-700" />
                  <div className="absolute h-1 w-1.5 rounded-full bg-stone-900 left-1 shadow-inner" />
                </div>
              ))}
            </div>

            {/* RIGHT PAGE: Color Study & Working Notes (Click to flip forward) */}
            <div
              onClick={nextPage}
              className="relative flex-1 p-5 sm:p-8 flex flex-col justify-between bg-[#f7f0e4] cursor-pointer group"
              title="Click right page to flip next"
            >
              {/* Header plate */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <span className="font-serif tracking-wider text-xs font-bold text-stone-800 uppercase">
                  {currentPage.rightTitle}
                </span>
                <span className="font-mono text-[10px] text-stone-500 uppercase">
                  {currentPage.rightPlate}
                </span>
              </div>

              {/* Working Color Palette Swatches & Geometry Study */}
              <div className="relative flex-1 my-3 rounded-lg border border-dashed border-stone-400/70 bg-[#ede4d3] p-3 flex flex-col justify-between shadow-inner group-hover:border-amber-600/70 transition">
                <div className="space-y-1.5 font-serif text-xs text-stone-800 leading-relaxed">
                  <p className="first-letter:text-2xl first-letter:font-bold first-letter:text-stone-900 first-letter:mr-0.5">
                    {currentPage.rightNote}
                  </p>
                </div>

                {/* Hand-Mixed Color Swatches on Rough Paper */}
                <div className="pt-2 border-t border-stone-300">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1.5">
                    Palette Swatches & Wash Test:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-10 rounded bg-[#4c1d95]/90 border border-stone-400 shadow-sm flex items-end p-0.5">
                      <span className="text-[7px] font-mono text-white/90">Violet</span>
                    </div>
                    <div className="h-8 w-10 rounded bg-[#1e1b4b]/90 border border-stone-400 shadow-sm flex items-end p-0.5">
                      <span className="text-[7px] font-mono text-white/90">Midnight</span>
                    </div>
                    <div className="h-8 w-10 rounded bg-[#b45309]/90 border border-stone-400 shadow-sm flex items-end p-0.5">
                      <span className="text-[7px] font-mono text-white/90">Amber</span>
                    </div>
                    <div className="h-8 w-10 rounded bg-[#d97706]/80 border border-stone-400 shadow-sm flex items-end p-0.5">
                      <span className="text-[7px] font-mono text-stone-950 font-bold">Ochre</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Note with Page Flip Cue */}
              <div className="flex items-center justify-between border-t border-stone-300 pt-2 text-[11px] font-mono text-stone-500">
                <span>Medium: 300gsm Cold-Pressed Rag</span>
                <span className="text-amber-800 font-semibold group-hover:translate-x-1 transition-transform">
                  Flip next →
                </span>
              </div>
            </div>
          </div>

          {/* Big Floating Right Page Turn Arrow */}
          <button
            onClick={nextPage}
            className="absolute -right-3 sm:-right-6 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Flip to next sketch page"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>
    </main>
  );
}
