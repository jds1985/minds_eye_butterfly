'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Image as ImageIcon, Upload, ShieldCheck } from 'lucide-react';

export default function AtelierStudio() {
  const [viewMode, setViewMode] = useState('room'); // 'room' | 'laptop' | 'wall'

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white select-none">
      {/* Top Header Overlay */}
      <header className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-6 transition-opacity duration-700 ${viewMode !== 'room' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-serif tracking-wider drop-shadow-lg">
            MINDS EYE BUTTERFLY
          </h1>
          <p className="text-[10px] sm:text-xs tracking-widest text-zinc-300 uppercase drop-shadow">
            Atelier & Wizard Sanctum
          </p>
        </div>

        <button
          onClick={() => setViewMode('laptop')}
          className="flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-950/70 px-4 py-2 text-xs font-semibold text-purple-200 backdrop-blur-md shadow-lg hover:bg-purple-900 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          <span>Open Laptop</span>
        </button>
      </header>

      {/* The Dynamic Scaling Room Stage */}
      <div
        className={`relative h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          viewMode === 'laptop'
            ? 'scale-[3.2] sm:scale-[3.8] translate-x-[-18%] translate-y-[-24%]'
            : 'scale-100 translate-x-0 translate-y-0'
        }`}
      >
        <img
          src="/den-background.jpg"
          alt="Minds Eye Atelier"
          className="h-full w-full object-cover"
        />

        {/* Clickable Laptop Hotspot on the Desk (Only active in room view) */}
        {viewMode === 'room' && (
          <button
            onClick={() => setViewMode('laptop')}
            title="Focus on Atelier Laptop"
            className="absolute bottom-[16%] right-[20%] sm:bottom-[18%] sm:right-[22%] h-24 w-32 rounded-xl cursor-pointer group"
          >
            <div className="absolute inset-0 rounded-lg border-2 border-purple-400/60 bg-purple-500/20 animate-pulse group-hover:bg-purple-500/40 transition" />
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] text-purple-200 px-2 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
              Click to Open Laptop
            </span>
          </button>
        )}
      </div>

      {/* Zoomed-in Laptop Screen Interface */}
      {viewMode === 'laptop' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-500">
          <div className="relative w-full max-w-3xl rounded-2xl border-4 border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col h-[75vh]">
            {/* Mock Laptop Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-zinc-400">AtelierOS v2.4</span>
              </div>

              <button
                onClick={() => setViewMode('room')}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition px-2 py-1 rounded bg-zinc-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Step back to room</span>
              </button>
            </div>

            {/* Laptop Workspace Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-xl font-serif text-purple-200">Minds Eye Workstation</h2>
                  <p className="text-xs text-zinc-400">Manage fine art pieces, summon creations, and configure gallery views.</p>
                </div>
                <Link
                  href="/studio"
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-purple-500 transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Sanctum Admin</span>
                </Link>
              </div>

              {/* Workstation Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/studio"
                  className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-purple-500/40 hover:bg-zinc-900 transition"
                >
                  <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
                    <Upload className="h-4 w-4" />
                    <span>Upload & Summon Art</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Drop original works into Lucky's enchanted bowl to broadcast them to the live exhibition.
                  </p>
                </Link>

                <div
                  onClick={() => alert("Connecting to Firestore live exhibits...")}
                  className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-amber-500/40 hover:bg-zinc-900 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-amber-400 font-medium text-sm">
                    <ImageIcon className="h-4 w-4" />
                    <span>Live Exhibition Feed</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Browse all currently active paintings and digital prints installed in the gallery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
