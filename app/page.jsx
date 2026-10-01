'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Upload, Eye } from 'lucide-react';

export default function AtelierStudio() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none">
      {/* Top Banner (Only visible in wide room view) */}
      <header
        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 transition-all duration-700 ${
          zoomed ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-serif tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            MINDS EYE BUTTERFLY
          </h1>
          <p className="text-[10px] sm:text-xs tracking-widest text-zinc-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Interactive Atelier Studio
          </p>
        </div>

        <button
          onClick={() => setZoomed(true)}
          className="flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-950/70 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md shadow-xl hover:bg-purple-900 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          <span>Focus Laptop</span>
        </button>
      </header>

      {/* Interactive Studio Stage with Dynamic Camera Zoom */}
      <div
        className="relative h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform"
        style={{
          transformOrigin: '58% 62%',
          transform: zoomed ? 'scale(3.2)' : 'scale(1)',
        }}
      >
        <img
          src="/Studio1.jpg"
          alt="Minds Eye Atelier"
          className="h-full w-full object-cover"
        />

        {/* Physical Laptop Display Overlay */}
        <div
          className="absolute z-20 transition-all duration-700"
          style={{
            top: '55.2%',
            left: '54.5%',
            width: '7.2%',
            height: '7.8%',
            transform: 'perspective(600px) rotateX(4deg) rotateY(-5deg) rotateZ(0.5deg)',
          }}
        >
          {!zoomed ? (
            /* Unfocused state: glowing click hotspot */
            <div
              onClick={() => setZoomed(true)}
              className="h-full w-full cursor-pointer rounded-[2px] bg-purple-600/20 hover:bg-purple-500/30 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.5)] transition"
              title="Click to sit at the workstation"
            />
          ) : (
            /* Focused state: Live Interactive Laptop Display */
            <div className="h-full w-full rounded-[2px] bg-zinc-950/95 border border-purple-500/60 p-1 flex flex-col justify-between shadow-2xl animate-in fade-in duration-700">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-0.5">
                <span className="text-[3px] font-mono text-purple-300">MindsEye OS</span>
                <span className="text-[2.5px] text-zinc-500">online</span>
              </div>

              <div className="flex flex-col gap-0.5 my-auto">
                <Link
                  href="/studio"
                  className="flex items-center justify-center gap-0.5 rounded bg-purple-600/80 hover:bg-purple-600 py-0.5 text-[3px] font-bold text-white shadow transition"
                >
                  <Upload className="h-1 w-1" />
                  <span>Sanctum Admin</span>
                </Link>

                <button
                  onClick={() => alert("Exhibition Gallery loading...")}
                  className="flex items-center justify-center gap-0.5 rounded bg-zinc-800 hover:bg-zinc-700 py-0.5 text-[3px] font-medium text-zinc-200 transition"
                >
                  <Eye className="h-1 w-1" />
                  <span>Exhibition</span>
                </button>
              </div>

              <div className="text-[2px] text-zinc-500 text-center">
                Atelier v2.4
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Return Button when zoomed */}
      {zoomed && (
        <button
          onClick={() => setZoomed(false)}
          className="absolute bottom-8 left-8 z-50 flex items-center gap-2 rounded-full border border-purple-500/50 bg-black/85 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md shadow-2xl hover:bg-zinc-900 transition animate-in fade-in duration-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Step back to room</span>
        </button>
      )}
    </main>
  );
}
