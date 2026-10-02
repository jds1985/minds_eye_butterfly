'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles, BookOpen, 
  Smartphone, Volume2, VolumeX, Wifi, Battery, Mail, Send, Palette, 
  Frame
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

// Interactive Butterfly Pin Component
function ButterflyPin({ label, top, left, color = 'purple', onClick }) {
  const colorMap = {
    purple: {
      ring: 'border-purple-400',
      glow: 'shadow-[0_0_15px_rgba(192,132,252,0.8)]',
      bg: 'bg-purple-950/85',
      text: 'text-purple-200',
      svg: '#d8b4fe'
    },
    amber: {
      ring: 'border-amber-400',
      glow: 'shadow-[0_0_15px_rgba(251,191,36,0.8)]',
      bg: 'bg-amber-950/85',
      text: 'text-amber-200',
      svg: '#fde68a'
    }
  }[color];

  return (
    <div
      onClick={onClick}
      className="absolute z-30 cursor-pointer group -translate-x-1/2 -translate-y-1/2"
      style={{ top, left }}
    >
      {/* Outer Pulse Wave */}
      <span className="absolute -inset-1 rounded-full animate-ping opacity-35 bg-white/40" />

      {/* Main Butterfly Pin Marker */}
      <div className={`relative flex items-center justify-center h-8 w-8 rounded-full border ${colorMap.ring} ${colorMap.bg} ${colorMap.glow} backdrop-blur-md transition-transform duration-300 group-hover:scale-125`}>
        {/* Butterfly Icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform group-hover:rotate-12"
          fill="none"
          stroke={colorMap.svg}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v18" />
          <path d="M12 7c-3-4-9-4-9 2s6 7 9 2" />
          <path d="M12 7c3-4 9-4 9 2s-6 7-9 2" />
          <path d="M12 17c-2 2-6 3-6-1s4-4 6-1" />
          <path d="M12 17c2 2 6 3 6-1s-4-4-6-1" />
        </svg>
      </div>

      {/* Hover Callout Badge */}
      <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border ${colorMap.ring} bg-black/90 px-2.5 py-1 text-[11px] font-medium ${colorMap.text} shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none flex items-center gap-1.5`}>
        <Sparkles className="h-3 w-3" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function AtelierEngine() {
  const [activePortal, setActivePortal] = useState('room');
  const [artworks, setArtworks] = useState([]);
  const [artIdx, setArtIdx] = useState(0);
  const [sketchIdx, setSketchIdx] = useState(0);
  const [pageFlipping, setPageFlipping] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

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

  // Web Audio procedural hearth fire
  const toggleSound = () => {
    if (!soundOn) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5I remember the exact project: we're building the **Minds Eye Butterfly** atelier room in Next.js, and we were struggling with those clunky, invisible rectangular hitboxes that kept drifting into the fireplace and stretching across different screens.

Your idea to scrap the giant boxes and replace them with **small glowing butterfly map pins** is the right way to solve this. 

Here is why that fixes the issue:
1. **No width/height bounding box guessing:** You don't have to define a 12% by 30% box that stretches differently on every display. It’s just **a single $(X, Y)$ point**.
2. **Intentional & Thematic:** Instead of the user blindly dragging their mouse around trying to find invisible hover zones, delicate little glowing butterflies rest naturally on each interactive spot with subtle fluttering wings.
3. **Clean hover states:** Hovering over a butterfly blooms an elegant callout badge with the name of the spot (e.g. "Exhibition Laptop", "Artist Sketchbook", "Studio Easel").

Here is the clean component to replace the hotspot section in your `app/page.jsx`:

### 1. Define the Butterfly Hotspots
Instead of messy divs with arbitrary widths, we use an array of pin coordinates:

```jsx
const STUDIO_PINS = [
  {
    id: 'laptop',
    label: 'Atelier Laptop',
    sub: 'Portfolio Exhibition',
    x: '58.5%',
    y: '62%'
  },
  {
    id: 'sketchbook',
    label: 'Drawing Pad',
    sub: 'Graphite Studies',
    x: '59%',
    y: '78%'
  },
  {
    id: 'phone',
    label: 'Studio Phone',
    sub: 'Commissions & Sanctum',
    x: '64.5%',
    y: '64%'
  },
  {
    id: 'easel',
    label: 'Studio Easel',
    sub: 'Work in Progress',
    x: '74%',
    y: '48%'
  },
  {
    id: 'wallArt',
    label: 'Wall Masterpiece',
    sub: 'Permanent Collection',
    x: '66%',
    y: '27%'
  }
];
cat << 'EOF' > app/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles, BookOpen, 
  Smartphone, Volume2, VolumeX, Wifi, Battery, Mail, Send, Palette, 
  Frame
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

// Single-point Butterfly Pins
const STUDIO_PINS = [
  {
    id: 'laptop',
    label: 'Atelier Laptop',
    sub: 'Portfolio Exhibition',
    x: '58.5%',
    y: '62%'
  },
  {
    id: 'sketchbook',
    label: 'Drawing Pad',
    sub: 'Graphite Studies',
    x: '60%',
    y: '77%'
  },
  {
    id: 'phone',
    label: 'Studio Phone',
    sub: 'Commissions & Sanctum',
    x: '64.5%',
    y: '64%'
  },
  {
    id: 'easel',
    label: 'Studio Easel',
    sub: 'Work in Progress',
    x: '75%',
    y: '48%'
  },
  {
    id: 'wallArt',
    label: 'Wall Masterpiece',
    sub: 'Permanent Collection',
    x: '66%',
    y: '27%'
  }
];

export default function AtelierEngine() {
  const [activePortal, setActivePortal] = useState('room');
  const [artworks, setArtworks] = useState([]);
  const [artIdx, setArtIdx] = useState(0);
  const [sketchIdx, setSketchIdx] = useState(0);
  const [pageFlipping, setPageFlipping] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

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

  // Web Audio procedural fire sound
  const toggleSound = () => {
    if (!soundOn) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(ctx.destination);
        whiteNoise.start();

        setSoundOn(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setSoundOn(false);
    }
  };

  // Canvas: Flying Crows & Hearth Embers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    const embers = Array.from({ length: 30 }, () => ({
      x: 1350 + (Math.random() * 100 - 50),
      y: 650 + Math.random() * 60,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 1.5 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      life: Math.random() * 1,
      decay: Math.random() * 0.012 + 0.006,
    }));

    const crows = [
      { x: 380, y: 320, scale: 0.8, speedX: 1.2, speedY: 0.2, wingCycle: 0 },
      { x: 620, y: 280, scale: 0.5, speedX: 0.9, speedY: -0.1, wingCycle: 2 },
      { x: 250, y: 360, scale: 1.1, speedX: 1.6, speedY: 0.15, wingCycle: 4 },
    ];

    const drawCrow = (x, y, scale, wingPhase) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = 'rgba(20, 15, 25, 0.85)';
      const wingFlap = Math.sin(wingPhase) * 10;

      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 3, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-2, -1);
      ctx.quadraticCurveTo(-6, -10 + wingFlap, -14, -6 + wingFlap);
      ctx.quadraticCurveTo(-8, -2, 0, 0);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(2, -1);
      ctx.quadraticCurveTo(6, -10 + wingFlap, 14, -6 + wingFlap);
      ctx.quadraticCurveTo(8, -2, 0, 0);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, 1920, 1080);

      // Crows clipped to window panes
      ctx.save();
      ctx.beginPath();
      ctx.rect(340, 210, 520, 260);
      ctx.clip();
      crows.forEach((c) => {
        c.x += c.speedX;
        c.y += c.speedY;
        c.wingCycle += 0.15;
        if (c.x > 880) {
          c.x = 320;
          c.y = 260 + Math.random() * 150;
        }
        drawCrow(c.x, c.y, c.scale, c.wingCycle);
      });
      ctx.restore();

      // Fireplace Flicker
      const flicker = 0.85 + Math.sin(Date.now() * 0.008) * 0.08 + Math.random() * 0.07;
      const fireGrad = ctx.createRadialGradient(1350, 640, 10, 1350, 640, 240);
      fireGrad.addColorStop(0, `rgba(255, 140, 0, ${0.45 * flicker})`);
      fireGrad.addColorStop(0.4, `rgba(234, 88, 12, ${0.25 * flicker})`);
      fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(1350, 640, 240, 0, Math.PI * 2);
      ctx.fill();

      // Embers
      embers.forEach((p) => {
        p.y -= p.speedY;
        p.x -= p.speedX;
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
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-zinc-950/80 px-4 py-2 text-xs font-medium text-amber-200 backdrop-blur-md shadow-xl hover:bg-zinc-900 transition"
        >
          {soundOn ? <Volume2 className="h-4 w-4 text-amber-400 animate-pulse" /> : <VolumeX className="h-4 w-4 text-zinc-400" />}
          <span>{soundOn ? 'Atelier Hearth Active' : 'Sound Ambient Off'}</span>
        </button>
      </header>

      {/* VIRTUAL 1920x1080 STAGE */}
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
                : activePortal === 'phone'
                ? '63.5% 65%'
                : activePortal === 'easel'
                ? '75% 48%'
                : activePortal === 'wallArt'
                ? '66% 27%'
                : '50% 50%',
            transform:
              activePortal === 'laptop'
                ? 'scale(5.6)'
                : activePortal === 'sketchbook'
                ? 'scale(3.8)'
                : activePortal === 'phone'
                ? 'scale(5.2)'
                : activePortal === 'easel'
                ? 'scale(3.4)'
                : activePortal === 'wallArt'
                ? 'scale(3.9)'
                : 'scale(1)',
          }}
        >
          {/* Base Studio Image */}
          <img
            src="/Studio1.jpg"
            alt="Minds Eye Atelier"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          />

          {/* Living Canvas */}
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full pointer-events-none z-10"
          />

          {/* BUTTERFLY PIN HOTSPOTS */}
          {activePortal === 'room' && (
            <div className="absolute inset-0 pointer-events-none">
              {STUDIO_PINS.map((pin) => (
                <div
                  key={pin.id}
                  onClick={() => setActivePortal(pin.id)}
                  style={{ left: pin.x, top: pin.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-30"
                >
                  {/* Outer Pulsing Aura */}
                  <span className="absolute -inset-2 rounded-full bg-purple-500/35 animate-ping opacity-60 group-hover:opacity-100" />

                  {/* Pin Orb with Butterfly SVG */}
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950/85 border border-purple-400/70 shadow-[0_0_18px_rgba(168,85,247,0.7)] backdrop-blur-md transition-all duration-300 group-hover:scale-125 group-hover:border-purple-300 group-hover:bg-purple-950">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-purple-300 drop-shadow-[0_0_6px_#c084fc] transition-transform duration-300 group-hover:rotate-12"
                    >
                      <path d="M12 4c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1s1-.4 1-1V5c0-.6-.4-1-1-1zm-1.5 2.5C7.5 3 2 4.5 2 9.5c0 4 4.5 6.5 8.5 7.5V6.5zm3 0v10.5c4-1 8.5-3.5 8.5-7.5 0-5-5.5-6.5-8.5-3z"/>
                    </svg>
                  </div>

                  {/* Map-style Tooltip Callout */}
                  <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none transition-all duration-200">
                    <div className="bg-zinc-950/95 border border-purple-400/60 px-3 py-1.5 rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.9)] whitespace-nowrap text-center">
                      <p className="text-xs font-serif font-bold text-purple-200 tracking-wider">
                        {pin.label}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                        {pin.sub}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-zinc-950 border-r border-b border-purple-400/60 rotate-45 -mt-1" />
                  </div>
                </div>
              ))}
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

            <div className="relative w-full h-11 bg-[#dfd4be] border-b border-[#bfae94] flex items-center justify-evenly px-4 shadow-inner z-30">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-stone-400 via-stone-200 to-stone-600 shadow-sm border border-stone-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-900 shadow-inner -mt-1" />
                </div>
              ))}
            </div>

            <div className="w-full border-b border-dashed border-stone-400/80 pointer-events-none" />

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

      {/* ======================= SMARTPHONE PORTAL ======================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activePortal === 'phone' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm flex items-center justify-between mb-3 px-2 z-50">
          <button
            onClick={() => setActivePortal('room')}
            className="flex items-center gap-2 rounded-full border border-purple-500/50 bg-black/85 px-4 py-1.5 text-xs font-semibold text-purple-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Put Down Phone</span>
          </button>
          <span className="text-[10px] font-mono tracking-widest text-purple-300 uppercase">
            Atelier Mobile
          </span>
        </div>

        <div className="relative w-full max-w-[340px] h-[78vh] max-h-[700px] rounded-[44px] p-3 bg-gradient-to-b from-zinc-700 via-zinc-850 to-zinc-950 border-[3px] border-zinc-600 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">
          <div className="relative flex-1 rounded-[36px] bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between p-4 text-white">
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-black border border-zinc-800/80 z-50 flex items-center justify-end px-2">
              <div className="h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 pt-1 px-3 z-40">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3 w-3" />
                <Battery className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-between py-2 space-y-3 overflow-y-auto">
              <div className="text-center space-y-1 pt-2">
                <div className="h-16 w-16 mx-auto rounded-full border-2 border-purple-500/60 p-0.5 shadow-lg">
                  <div className="h-full w-full rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold tracking-wide">Minds Eye Butterfly</h3>
                <p className="text-[10px] text-zinc-400 font-mono">@mindseyebutterfly • Atelier Studio</p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="https://www.tiktok.com/@mindseyebutterfly"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl bg-zinc-900 border border-zinc-800 p-3 hover:border-purple-500/50 transition group"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-zinc-200">TikTok Atelier</div>
                      <div className="text-[9px] text-zinc-500">Live studio streams & process</div>
                    </div>
                  </div>
                  <Send className="h-3.5 w-3.5 text-zinc-500 group-hover:text-purple-400 transition" />
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

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-2.5 text-center text-[10px] text-zinc-400">
                Studio open for select original oil and digital mixed commissions.
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <div className="h-1 w-32 rounded-full bg-zinc-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ======================= EASEL PAINTING PORTAL ======================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activePortal === 'easel' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute w-[700px] h-[700px] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl flex items-center justify-between mb-4 z-50">
          <button
            onClick={() => setActivePortal('room')}
            className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-black/90 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Step Back to Room</span>
          </button>

          <span className="text-xs font-serif tracking-widest text-amber-200/90 uppercase drop-shadow flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-amber-400" />
            <span>Studio Easel Work-in-Progress</span>
          </span>
        </div>

        <div className="relative max-h-[76vh] max-w-3xl flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-stone-800 via-stone-900 to-black border-4 border-amber-800/70 shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
          <img
            src={artworks[0]?.imageUrl || '/Studio1.jpg'}
            alt="Easel Artwork"
            className="max-h-[58vh] w-auto max-w-full rounded-lg object-contain shadow-2xl border border-stone-700"
          />

          <div className="w-full mt-3 pt-3 border-t border-amber-800/40 flex items-center justify-between px-2 text-stone-300">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-amber-100">
                {artworks[0]?.title || 'Atelier Focal Study'}
              </h3>
              <p className="text-xs text-amber-300/80 font-serif italic">
                {artworks[0]?.medium || 'Oil on Belgian Linen'}
              </p>
            </div>
            <div className="text-right text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              Available for Collector Acquisition
            </div>
          </div>
        </div>
      </div>

      {/* ======================= WALL MASTERPIECE PORTAL ======================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-700 pointer-events-none ${
          activePortal === 'wallArt' ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-3xl flex items-center justify-between mb-4 z-50">
          <button
            onClick={() => setActivePortal('room')}
            className="flex items-center gap-2 rounded-full border border-amber-400/50 bg-black/90 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl hover:bg-zinc-900 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Step Back to Room</span>
          </button>

          <span className="text-xs font-serif tracking-widest text-amber-200/90 uppercase drop-shadow flex items-center gap-1.5">
            <Frame className="h-3.5 w-3.5 text-amber-300" />
            <span>Permanent Atelier Collection</span>
          </span>
        </div>

        <div className="relative max-h-[76vh] max-w-2xl flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-amber-950/80 via-stone-900 to-black border-[6px] border-amber-600/80 shadow-[0_30px_70px_rgba(0,0,0,0.95)]">
          <img
            src={artworks[1]?.imageUrl || '/den-background.jpg'}
            alt="Wall Artwork"
            className="max-h-[56vh] w-auto max-w-full rounded object-contain shadow-2xl border border-amber-900"
          />

          <div className="w-full mt-3 pt-2 border-t border-amber-700/40 text-center space-y-0.5">
            <h3 className="font-serif text-lg font-bold text-amber-100">
              {artworks[1]?.title || 'Sanctum Twilight Heritage'}
            </h3>
            <p className="text-xs text-amber-300/80 font-serif italic">
              Original Fine Oil & Gilded Varnish • Atelier Archive
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
