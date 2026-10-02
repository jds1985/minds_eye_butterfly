'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles, BookOpen, 
  Smartphone, Wifi, Battery, Volume2, MessageSquare, Instagram, 
  Palette, Mail, Send
} from 'lucide-react';
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
  const [activeMode, setActiveMode] = useState('room'); // 'room' | 'laptop' | 'sketchbook' | 'phone'
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

  const totalArtworks = artworks.length || 1;
  const currentArt = artworks[activeIndex] || artworks[0];
  const safeSketchIdx = sketchIndex % totalArtworks;
  const currentSketch = artworks[safeSketchIdx] || artworks[0];

  const prevArt = () => setActiveIndex((prev) => (prev === 0 ? totalArtworks - 1 : prev - 1));
  const nextArt = () => setActiveIndex((prev) => (prev === totalArtworks - 1 ? 0 : prev + 1));

  const nextSketch = () => {
    if (pageFlipping) return;
    setPageFlipping(true);
    setTimeout(() => {
      setSketchIndex((prev) => (prev + 1) % totalArtworks);
      setPageFlipping(false);
    }, 280);
  };

  const prevSketch = () => {
    if (pageFlipping) return;
    setPageFlipping(true);
    setTimeout(() => {
      setSketchIndex((prev) => (prev === 0 ? totalArtworks - 1 : prev - 1));
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
            onClick={() => setActiveMode('phone')}
            className="flex items-center gap-2 rounded-full border border-pink-400/50 bg-pink-950/70 px-4 py-2 text-xs font-semibold text-pink-200 backdrop-blur-md shadow-xl hover:bg-pink-900 transition"
          >
            <Smartphone className="h-3.5 w-3.5 text-pink-300" />
            <span>Phone</span>
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
              : activeMode === 'phone'
              ? '66% 66%'
              : activeMode === 'sketchbook'
              ? '41% 67%'
              : '50% 50%',
          transform:
            activeMode === 'laptop'
              ? 'scale(6.2)'
              : activeMode === 'phone'
              ? 'scale(5.8)'
              : activeMode === 'sketchbook'
              ? 'scale(3.4)'
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
                Sit at Laptop
              </span>
            </div>

            {/* Hotspot 2: Smartphone beside Laptop */}
            <div
              onClick={() => setActiveMode('phone')}
              className="absolute z-20 cursor-pointer group"
              style={{
                top: '63%',
                left: '64.5%',
                width: '3.2%',
                height: '6.5%',
                transform: 'rotate(-10deg)',
              }}
              title="Click to check smartphone"
            >
              <div className="h-full w-full rounded-md border-2 border-pink-400/60 bg-pink-500/20 group-hover:bg-pink-500/40 transition shadow-[0_0_12px_rgba(244,114,182,0.7)]" />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-pink-200 opacity-0 group-hover:opacity-100 transition shadow">
                Check Phone
              </span>
            </div>

            {/* Hotspot 3: Sketchbook moved to the Beanbag Chair */}
            <div
              onClick={() => setActiveMode('sketchbook')}
              className="absolute z-20 cursor-pointer group"
              style={{
                top: '58%',
                left: '34%',
                width: '13%',
                height: '15%',
                transform: 'rotate(-14deg)',
              }}
              title="Inspect sketchbook resting on the beanbag"
            >
              <div className="h-full w-full rounded-xl border-2 border-amber-400/50 bg-amber-500/20 group-hover:bg-amber-500/40 transition shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] text-amber-200 opacity-0 group-hover:opacity-100 transition shadow">
                Open Sketchbook (Beanbag)
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
                  {currentArt?.medium} • {activeIndex + 1} of {totalArtworks}
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

      {/* ===================== SMARTPHONE PERSPECTIVE ===================== */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activeMode === 'phone' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-3xl pointer-events-none" />

        {/* Top Exit */}
        <div className="w-full max-w-sm flex items-center justify-between mb-3 px-2 z-50">
          <button
            onClick={() => setActiveMode('room')}
            className="flex items-center gap-2 rounded-full border border-pink-500/50 bg-black/85 px-4 py-1.5 text-xs font-semibold text-pink-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Put Down Phone</span>
          </button>
          <span className="text-[10px] font-mono tracking-widest text-pink-300 uppercase">
            Atelier Mobile
          </span>
        </div>

        {/* Realistic Smartphone Chassis */}
        <div className="relative w-full max-w-[340px] h-[78vh] max-h-[700px] rounded-[44px] p-3 bg-gradient-to-b from-zinc-700 via-zinc-850 to-zinc-950 border-[3px] border-zinc-600 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">
          
          {/* Inner OLED Display */}
          <div className="relative flex-1 rounded-[36px] bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between p-4 text-white">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-black border border-zinc-800/80 z-50 flex items-center justify-end px-2">
              <div className="h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
            </div>

            {/* Mobile Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 pt-1 px-3 z-40">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3 w-3" />
                <Battery className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Mobile App Screen Content */}
            <div className="mt-4 flex-1 flex flex-col justify-between py-2 space-y-3 overflow-y-auto">
              {/* Profile Card */}
              <div className="text-center space-y-1 pt-2">
                <div className="h-16 w-16 mx-auto rounded-full border-2 border-pink-500/60 p-0.5 shadow-lg">
                  <div className="h-full w-full rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold tracking-wide">Minds Eye Butterfly</h3>
                <p className="text-[10px] text-zinc-400 font-mono">@mindseyebutterfly • Atelier Studio</p>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href="https://www.tiktok.com/@mindseyebutterfly"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-zinc-900 border border-zinc-800 p-3 hover:border-pink-500/50 transition group"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="p-1.5 rounded-lg bg-pink-950/60 text-pink-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-zinc-200">TikTok Atelier</div>
                      <div className="text-[9px] text-zinc-500">Live studio streams & process</div>
                    </div>
                  </div>
                  <Send className="h-3.5 w-3.5 text-zinc-500 group-hover:text-pink-400 transition" />
                </a>

                <a
                  href="mailto:contact@mindseyebutterfly.com"
                  className="flex items-center justify-between rounded-xl bg-zinc-900 border border-zinc-800 p-3 hover:border-purple-500/50 transition group"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-zinc-200">Commission Inquiries</div>
                      <div className="text-[9px] text-zinc-500">Direct studio dispatch</div>
                    </div>
                  </div>
                  <Send className="h-3.5 w-3.5 text-zinc-500 group-hover:text-purple-400 transition" />
                </a>

                <Link
                  href="/studio"
                  className="flex items-center justify-between rounded-xl bg-purple-600/90 p-3 hover:bg-purple-600 transition group shadow-lg shadow-purple-600/30"
                >
                  <div className="flex items-center gap-2.5 text-xs text-white">
                    <div className="p-1.5 rounded-lg bg-white/20 text-white">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Sanctum Admin Portal</div>
                      <div className="text-[9px] text-purple-200">Upload new creations</div>
                    </div>
                  </div>
                  <Send className="h-3.5 w-3.5 text-white/80 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>

              {/* Status Note */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-2.5 text-center text-[10px] text-zinc-400">
                Studio open for select original oil and digital mixed commissions.
              </div>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="pt-2 flex justify-center">
              <div className="h-1 w-32 rounded-full bg-zinc-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== VERTICAL TOP-SPIRAL SKETCHBOOK ===================== */}
      <div
        className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activeMode === 'sketchbook' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
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
            Page {safeSketchIdx + 1} of {totalArtworks}
          </span>
        </div>

        {/* Vertical Portrait Pad Container */}
        <div className="relative flex items-center justify-center">
          
          {/* Side Arrow: Previous */}
          <button
            onClick={prevSketch}
            className="absolute -left-16 sm:-left-20 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Previous sketch"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Portrait Sheet Pad */}
          <div
            onClick={nextSketch}
            className={`relative h-[82vh] max-h-[820px] aspect-[3/4] flex flex-col rounded-2xl bg-[#f5ede0] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_0_1px_rgba(180,150,110,0.3)] border border-[#c8baa0] overflow-hidden cursor-pointer group transition-all duration-300 ${
              pageFlipping ? 'scale-[0.98] -translate-y-1 opacity-80' : 'scale-100 translate-y-0 opacity-100'
            }`}
            title="Click page to flip forward"
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/[0.08] via-transparent to-stone-900/[0.05] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none z-20" />

            {/* TOP WIRE SPIRAL BINDING */}
            <div className="relative w-full h-11 bg-[#dfd4be] border-b border-[#bfae94] flex items-center justify-evenly px-4 shadow-inner z-30">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-stone-400 via-stone-200 to-stone-600 shadow-sm border border-stone-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-900 shadow-inner -mt-1" />
                </div>
              ))}
            </div>

            {/* Micro Perforation Line */}
            <div className="w-full border-b border-dashed border-stone-400/80 pointer-events-none" />

            {/* MAIN PORTRAIT PAGE CONTENT */}
            <div className="relative flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              {/* Header plate */}
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500 font-bold">
                  Plate № {String(safeSketchIdx + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-serif italic text-stone-600">
                  Archival Atelier Study
                </span>
              </div>

              {/* Centered Artwork Display */}
              <div className="relative flex-1 my-3 rounded-xl border border-stone-300 bg-[#efe4d2] p-2 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-amber-600/50 transition">
                <img
                  key={currentSketch?.id}
                  src={currentSketch?.imageUrl}
                  alt={currentSketch?.title}
                  className="max-h-full max-w-full rounded object-contain filter contrast-105 shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Handwritten Artist Footer */}
              <div className="border-t border-stone-300 pt-2 flex items-center justify-between text-stone-700">
                <div>
                  <h4 className="font-serif font-bold text-sm tracking-wide text-stone-900">
                    {currentSketch?.title}
                  </h4>
                  <p className="font-serif italic text-xs text-stone-600">
                    {currentSketch?.medium || 'Graphite & Mixed Media'}
                  </p>
                </div>

                <span className="text-[11px] font-serif text-amber-800 font-semibold group-hover:translate-x-1 transition-transform">
                  Turn Page →
                </span>
              </div>
            </div>
          </div>

          {/* Side Arrow: Next */}
          <button
            onClick={nextSketch}
            className="absolute -right-16 sm:-right-20 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Next sketch"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>
    </main>
  );
}
