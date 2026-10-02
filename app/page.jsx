'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles, BookOpen, 
  Volume2, VolumeX, Wifi, Battery, Maximize2 
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
  const [activePortal, setActivePortal] = useState('room'); // 'room' | 'laptop'
  const [artworks, setArtworks] = useState([]);
  const [artIdx, setArtIdx] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Firestore sync for exhibition artwork
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

  // Living Canvas Engine: Ambient Hearth Fire, Floating Embers, and Light Glow
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

      // 1. Dynamic Hearth Flame & Light Flickering
      const flicker = 0.85 + Math.sin(Date.now() * 0.008) * 0.08 + Math.random() * 0.07;
      const fireGrad = ctx.createRadialGradient(1350, 640, 10, 1350, 640, 240);
      fireGrad.addColorStop(0, `rgba(255, 140, 0, ${0.45 * flicker})`);
      fireGrad.addColorStop(0.4, `rgba(234, 88, 12, ${0.25 * flicker})`);
      fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(1350, 640, 240, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rising Fire Embers
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

  const currentArt = artworks[artIdx] || artworks[0];

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
        VIRTUAL 1920x1080 STAGE CONTAINER:
        Scales proportionally on mobile, tablets, and ultra-wide screens.
        Coordinates NEVER move or disconnect.
      */}
      <div className="relative w-full max-w-[1920px] aspect-[16/9] max-h-screen overflow-hidden flex items-center justify-center">
        
        {/* Dynamic Camera Matrix Layer */}
        <div
          className="relative w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          style={{
            transformOrigin: '59% 62%',
            transform: activePortal === 'laptop' ? 'scale(5.6)' : 'scale(1)',
          }}
        >
          {/* Base High-Resolution Studio Artwork */}
          <img
            src="/Studio1.jpg"
            alt="Minds Eye Atelier"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          />

          {/* Canvas Engine Layer: Hearth Fire, Embers & Lighting FX */}
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full pointer-events-none z-10"
          />

          {/* 
            LOCKED VIRTUAL HOTSPOT: LAPTOP WORKSTATION
            Fixed strictly to (1050px, 600px) in 1920x1080 coordinate space.
          */}
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
        </div>
      </div>

      {/* ======================= LAPTOP WORKSTATION PORTAL ======================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-end bg-black/65 backdrop-blur-[4px] transition-opacity duration-700 pointer-events-none ${
          activePortal === 'laptop' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[85vw] h-[65vh] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

        {/* Silver Anodized Laptop Display */}
        <div className="relative w-full max-w-5xl h-[80vh] flex flex-col justify-between rounded-t-[32px] p-[10px] sm:p-[14px] pb-0 bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.2)]">
          <div className="relative flex-1 flex flex-col justify-between rounded-t-[22px] bg-zinc-950 border border-zinc-700/80 shadow-inner overflow-hidden">
            
            {/* Display Header Bar */}
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

            {/* Screen Workstation Area */}
            <div className="relative z-10 flex-1 flex flex-col justify-between bg-zinc-900/90 p-4 sm:p-6 overflow-hidden">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-2xl font-serif tracking-wide text-zinc-100 drop-shadow-md">
                  {currentArt?.title}
                </h2>
                <p className="text-xs text-purple-300 font-medium">
                  {currentArt?.medium} • {artIdx + 1} of {artworks.length}
                </p>
              </div>

              {/* Main Artwork Stage */}
              <div className="relative flex-1 flex items-center justify-center p-2 my-auto">
                <button
                  onClick={() => setArtIdx((prev) => (prev === 0 ? artworks.length - 1 : prev - 1))}
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
                  onClick={() => setArtIdx((prev) => (prev === artworks.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 sm:right-4 z-30 rounded-full border border-zinc-600 bg-zinc-800/90 p-3 text-white shadow-2xl hover:bg-purple-950 hover:border-purple-400 transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Bottom Thumbnail Dock */}
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

        {/* Keyboard Deck & Trackpad */}
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
    </main>
  );
}
