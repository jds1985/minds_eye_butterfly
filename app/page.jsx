'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, Laptop, Image as ImageIcon, Flame } from 'lucide-react';

export default function AtelierStudio() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      {/* Studio Top Navigation */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif tracking-wider text-white">
            MINDS EYE BUTTERFLY
          </h1>
          <p className="text-[10px] sm:text-xs tracking-widest text-zinc-400 uppercase">
            Interactive Fine Art Atelier
          </p>
        </div>

        <Link
          href="/studio"
          className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 px-3.5 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-900 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          <span>Sanctum Access</span>
        </Link>
      </header>

      {/* Interactive Studio Stage */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Aspect Ratio Box to keep the studio artwork sharp and uncropped */}
        <div className="relative w-full max-w-5xl aspect-[16/10] max-h-[80vh] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
          <img
            src="/Studio1.jpg"
            alt="Minds Eye Butterfly Atelier"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Interactive Hotspot: Laptop */}
          <button
            onClick={() => setActiveModal('laptop')}
            title="Inspect Digital Easel"
            className="absolute bottom-[16%] right-[22%] sm:bottom-[18%] sm:right-[24%] h-14 w-20 sm:h-20 sm:w-28 rounded-lg border-2 border-purple-400/60 bg-purple-500/20 backdrop-blur-[2px] transition-all hover:scale-105 hover:border-purple-300 hover:bg-purple-500/30 flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 bg-black/80 px-2 py-0.5 rounded text-[10px] text-purple-200 transition">
              Atelier Laptop
            </span>
          </button>

          {/* Interactive Hotspot: Wall Paintings */}
          <button
            onClick={() => setActiveModal('gallery')}
            title="Inspect Wall Art"
            className="absolute top-[32%] left-[34%] h-24 w-16 sm:h-32 sm:w-20 rounded-md border-2 border-amber-400/50 bg-amber-500/10 backdrop-blur-[1px] transition-all hover:scale-105 hover:border-amber-300 hover:bg-amber-500/25 flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 bg-black/80 px-2 py-0.5 rounded text-[10px] text-amber-200 transition">
              Curated Art
            </span>
          </button>

          {/* Interactive Hotspot: Lucky on the Velvet Couch */}
          <button
            onClick={() => setActiveModal('lucky')}
            title="Lucky snoozing on the couch"
            className="absolute bottom-[28%] left-[6%] sm:bottom-[30%] sm:left-[8%] h-14 w-20 sm:h-18 sm:w-24 rounded-full border-2 border-dashed border-purple-400/70 bg-purple-900/30 transition-all hover:scale-110 flex items-center justify-center group animate-pulse"
          >
            <span className="text-[10px] font-medium text-purple-200 bg-black/70 px-2 py-0.5 rounded">
              Lucky z z Z
            </span>
          </button>
        </div>
      </div>

      {/* Info / Footer Bar */}
      <footer className="py-3 text-center text-xs text-zinc-500 border-t border-zinc-900 bg-zinc-950">
        Click items in the room (the laptop, wall paintings, or couch) to explore the atelier.
      </footer>

      {/* Modals for Clicked Objects */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-purple-500/40 bg-zinc-900 p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === 'laptop' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <Laptop className="h-5 w-5" />
                  <h3 className="text-lg font-serif">Digital Creation Station</h3>
                </div>
                <p className="text-xs text-zinc-300">
                  The primary workstation where digital prints and custom commissions take shape.
                </p>
                <div className="pt-2">
                  <Link
                    href="/studio"
                    className="inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
                  >
                    Open Studio Sanctum
                  </Link>
                </div>
              </div>
            )}

            {activeModal === 'gallery' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <ImageIcon className="h-5 w-5" />
                  <h3 className="text-lg font-serif">Original Wall Collection</h3>
                </div>
                <p className="text-xs text-zinc-300">
                  Hand-crafted original works and mixed media displayed within the studio den.
                </p>
              </div>
            )}

            {activeModal === 'lucky' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="text-lg font-serif">Lucky the Wizard Cat</h3>
                </div>
                <p className="text-xs text-zinc-300">
                  "Purrrr... you found my favorite cushion. When you are ready to manage the atelier spells, whisper to the Sanctum door."
                </p>
                <div className="pt-2">
                  <Link
                    href="/studio"
                    className="inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
                  >
                    Enter Sanctum Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
