'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles, BookOpen, 
  Volume2, VolumeX, Wifi, Battery 
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

export default function AtelierEngine() {
  const [activePortal, setActivePortal] = useState('room'); // 'room' | 'laptop' | 'sketchbook'
  const [artworks, setArtworks] = useState([]);
  const [artIdx, setArtIdx] = useState(0);
  const [sketchIdx, setSketchIdx] = useState(0);
  const [pageFlipping, setPageFlipping] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const canvasRef = useRef(null);

  // Firestore sync
  useEffect(() => {
    try {
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setArtworks(docs.length > 0 ? docs : FALLBACK_ARTWORKS);
        },
        () => setArtworks(FALLBACK_ARTWORKS)
      );
      return () => unsub();
    } catch {
      setArtworks(FALLBACK_ARTWORKS);
    }
  }, []);

  // Living Canvas: Fireplace Embers & Hearth Flickering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    const embers = Array.from({ length: 28 }, () => ({
      x: 1350 + (Math.random() * 100 - 50),
      y: 650 + Math.random() * 60,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 1.5 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      life: Math.random() * 1,
      decay: Math.random() * 0.012 + 0.006,
    }));

    const render = () => {
      ctx.clearRect(0, 0, 1920, 1080);

      // Hearth Flame & Light Flickering
      const flicker = 0.85 + Math.sin(Date.now() * 0.008) * 0.08 + Math.random() * 0.07;
      const fireGrad = ctx.createRadialGradient(1350, 640, 10, 1350, 640, 240);
      fireGrad.addColorStop(0, `rgba(255, 140, 0, ${0.45 * flicker})`);
      fireGrad.addColorStop(0.4, `rgba(234, 88, 12, ${0.25 * flicker})`);
      fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(1350, 640, 240, 0, Math.PI * 2);
      ctx.fill();

      // Rising Embers
      embers.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.life -= p.decay;

        if (p.life <= 0 || p.y < 460) {
          p.x = 1350 + (Math.random() * 90 - 45);
          p.y = 660 + Math.random() * 20;
          p.life = 1;
        }

        ctx.fillStyle = `rgba(255, 200, 100, ${p.life * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const totalWorks = artworks.length || 1;
  const currentArt = artworks[artIdx] || artworks[0];
  const safeSketchIdx = sketchIdx % totalWorks;
  const currentSketch = artworks[safeSketchIdx] || artworks[0];

  const nextSketch = () => {
    if (pageFlipping) return;
    setPageFlipping(true);
    setTimeout(() => {
      setSketchIdx((prev) => (prev + 1) % totalWorks);
      setPageFlipping(false);
    }, 250);
  };

  const prevSketch = () => {
    if (pageFlipping) return;
    setPageFlipping(true);
    setTimeout(() => {
      setSketchIdx((prev) => (prev === 0 ? totalWorks - 1 : prev - 1));
      setPageFlipping(false);
    }, 250);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none text-white font-sans flex items-center justify-center">
      {/* Studio Header Overlay */}
      <header
        className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-6 transition-all duration-700 ${
          activePortal !== 'room' ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-serif tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            MINDS EYE BUTTERFLY
          </h1>
          <p className="text-[10px] sm:text-xs tracking-widest text-zinc-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Living Atelier Studio
          </p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-zinc-950/80 px-4 py-2 text-xs font-medium text-amber-200 backdrop-blur-md shadow-xl hover:bg-zinc-900 transition"
        >
          {soundOn ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4 text-zinc-400" />}
          <span>{soundOn ? 'Atelier Hearth Active' : 'Sound Ambient Off'}</span>
        </button>
      </header>

      {/* 
        VIRTUAL 1920x1080 STAGE:
        Maintains fixed aspect ratio across all displays.
      */}
      <div className="relative w-full max-w-[1920px] aspect-[16/9] max-h-screen overflow-hidden flex items-center justify-center">
        
        {/* Dynamic Camera Matrix Layer */}
        <div
          className="relative w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            transformOrigin:
              activePortal === 'laptop'
                ? '59% 62%'
                : activePortal === 'sketchbook'
                ? '61% 86%'
                : '50% 50%',
            transform:
              activePortal === 'laptop'
                ? 'scale(5.6)'
                : activePortal === 'sketchbook'
                ? 'scale(3.8)'
                : 'scale(1)',
          }}
        >
          {/* Base Studio Artwork */}
          <img
            src="/Studio1.jpg"
            alt="Minds Eye Atelier"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          />

          {/* Canvas Engine: Fire Embers & Ambient Lighting */}
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full pointer-events-none z-10"
          />

          {/* HOTSPOT 1: LAPTOP WORKSTATION */}
          {activePortal === 'room' && (
            <div
              onClick={() => setActivePortal('laptop')}
              className="absolute z-20 cursor-pointer group"
              style={{
                top: '55.5%',
                left: '54.5%',
                width: '7.8%',
                height: '11.5%',
              }}
              title="Sit at the Laptop Station"
            >
              <div className="h-full w-full rounded transition-all duration-300 group-hover:bg-purple-500/15 group-hover:ring-1 group-hover:ring-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]" />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 border border-purple-500/40 px-2 py-0.5 text-[10px] text-purple-200 opacity-0 group-hover:opacity-100 transition shadow-lg pointer-events-none">
                Open Atelier Laptop
              </div>
            </div>
          )}

          {/* HOTSPOT 2: TABLE SKETCHBOOK */}
          {activePortal === 'room' && (
            <div
              onClick={() => setActivePortal('sketchbook')}
              className="absolute z-20 cursor-pointer group"
              style={{
                top: '68%',
                left: '52%',
                width: '18%',
                height: '19%',
              }}
              title="Inspect Sketchbook on Desk"
            >
              <div className="h-full w-full rounded-lg transition-all duration-300 group-hover:bg-amber-500/15 group-hover:ring-1 group-hover:ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/90 border border-amber-500/40 px-2 py-0.5 text-[10px] text-amber-200 opacity-0 group-hover:opacity-100 transition shadow-lg pointer-events-none">
                Open Sketchbook
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================= LAPTOP PORTAL ======================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-end bg-black/65 backdrop-blur-[4px] transition-opacity duration-700 pointer-events-none ${
          activePortal === 'laptop' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[85vw] h-[65vh] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

        <div className="relative w-full max-w-5xl h-[80vh] flex flex-col justify-between rounded-t-[32px] p-[10px] sm:p-[14px] pb-0 bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.2)]">
          <div className="relative flex-1 flex flex-col justify-between rounded-t-[22px] bg-zinc-950 border border-zinc-700/80 shadow-inner overflow-hidden">
            
            <div className="relative z-20 flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/95 text-zinc-300 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePortal('room')}
                  title="Close laptop & step back"
                  className="h-3.5 w-3.5 rounded-full bg-rose-500 hover:brightness-125 transition flex items-center justify-center text-[9px] text-zinc-950 font-black shadow"
                >
                  ×
                </button>
                <div className="h-3.5 w-3.5 rounded-full bg-amber-500/90 shadow" />
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/90 shadow" />
                <span className="ml-3 font-mono text-[11px] text-zinc-300 font-semibold tracking-wider">Atelier Gallery Display</span>
              </div>

              <button
                onClick={() => setActivePortal('room')}
                className="flex items-center gap-1.5 text-xs rounded-md bg-purple-950/70 hover:bg-purple-900 border border-purple-400/50 text-purple-200 px-3 py-1 font-medium transition shadow-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Room</span>
              </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-between bg-zinc-900/90 p-4 sm:p-6 overflow-hidden">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-2xl font-serif tracking-wide text-zinc-100 drop-shadow-md">
                  {currentArt?.title}
                </h2>
                <p className="text-xs text-purple-300 font-medium">
                  {currentArt?.medium} • {artIdx + 1} of {totalWorks}
                </p>
              </div>

              <div className="relative flex-1 flex items-center justify-center p-2 my-auto">
                <button
                  onClick={() => setArtIdx((prev) => (prev === 0 ? totalWorks - 1 : prev - 1))}
                  className="absolute left-2 sm:left-4 z-30 rounded-full border border-zinc-600 bg-zinc-800/90 p-3 text-white shadow-2xl hover:bg-purple-950 hover:border-purple-400 transition"
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
                  onClick={() => setArtIdx((prev) => (prev === totalWorks - 1 ? 0 : prev + 1))}
                  className="absolute right-2 sm:right-4 z-30 rounded-full border border-zinc-600 bg-zinc-800/90 p-3 text-white shadow-2xl hover:bg-purple-950 hover:border-purple-400 transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
                {artworks.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setArtIdx(idx)}
                    className={`relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      artIdx === idx
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

      {/* ======================= SKETCHBOOK PORTAL ======================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activePortal === 'sketchbook' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />

        {/* Top Control Header */}
        <div className="w-full max-w-xl flex items-center justify-between mb-3 px-2 z-50">
          <button
            onClick={() => setActivePortal('room')}
            className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-black/85 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Close & Return to Den</span>
          </button>

          <span className="text-xs font-serif tracking-widest text-amber-200/90 uppercase drop-shadow">
            Page {safeSketchIdx + 1} of {totalWorks}
          </span>
        </div>

        {/* Portrait Pad Stage */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={prevSketch}
            className="absolute -left-16 sm:-left-20 z-50 rounded-full border-2 border-amber-500/60 bg-zinc-900/95 p-3 text-amber-200 shadow-2xl hover:bg-amber-950 hover:scale-110 active:scale-95 transition"
            title="Previous sketch"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div
            onClick={nextSketch}
            className={`relative h-[82vh] max-h-[820px] aspect-[3/4] flex flex-col rounded-2xl bg-[#f5ede0] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_0_1px_rgba(180,150,110,0.3)] border border-[#c8baa0] overflow-hidden cursor-pointer group transition-all duration-300 ${
              pageFlipping ? 'scale-[0.98] -translate-y-1 opacity-80' : 'scale-100 translate-y-0 opacity-100'
            }`}
            title="Click page to flip forward"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/[0.08] via-transparent to-stone-900/[0.05] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none z-20" />

            {/* TOP WIRE SPIRAL */}
            <div className="relative w-full h-11 bg-[#dfd4be] border-b border-[#bfae94] flex items-center justify-evenly px-4 shadow-inner z-30">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-stone-400 via-stone-200 to-stone-600 shadow-sm border border-stone-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-900 shadow-inner -mt-1" />
                </div>
              ))}
            </div>

            <div className="w-full border-b border-dashed border-stone-400/80 pointer-events-none" />

            {/* Main Portrait Sketch Area */}
            <div className="relative flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500 font-bold">
                  Plate № {String(safeSketchIdx + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-serif italic text-stone-600">
                  Archival Atelier Study
                </span>
              </div>

              <div className="relative flex-1 my-3 rounded-xl border border-stone-300 bg-[#efe4d2] p-2 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-amber-600/50 transition">
                <img
                  key={currentSketch?.id}
                  src={currentSketch?.imageUrl}
                  alt={currentSketch?.title}
                  className="max-h-full max-w-full rounded object-contain filter contrast-105 shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

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
