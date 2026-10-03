'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Unlock, Sparkles, Check, Key, Feather } from 'lucide-react';

const WARDROBE_TOPS = [
  {
    id: 'top-1',
    name: 'Minds Eye Heavyweight Hoodie',
    color: 'Washed Charcoal',
    price: '$78',
    detail: '450 GSM French Terry with embroidered iridescent crest',
  },
  {
    id: 'top-2',
    name: 'Atelier Metamorphosis Tee',
    color: 'Vintage Bone',
    price: '$42',
    detail: 'Silkscreened botanical butterfly plate on ring-spun cotton',
  },
  {
    id: 'top-3',
    name: 'Sanctum Velvet Draped Kimono',
    color: 'Midnight Violet',
    price: '$110',
    detail: 'Plush velvet outer with gilded silk lining',
  },
];

const WARDROBE_BOTTOMS = [
  {
    id: 'bot-1',
    name: 'Atelier Studio Work Trouser',
    color: 'Iron Slate',
    price: '$68',
    detail: 'Relaxed fit with reinforced brush pockets and copper rivets',
  },
  {
    id: 'bot-2',
    name: 'Raw Hem Painter Denim',
    color: 'Washed Indigo',
    price: '$82',
    detail: 'Custom brass button fly with subtle atelier paint splatter accents',
  },
  {
    id: 'bot-3',
    name: 'Sanctum Draped Linen Skirt',
    color: 'Raven Black',
    price: '$64',
    detail: 'Layered organic linen weave with asymmetric raw hem',
  },
];

const VAULT_ITEMS = [
  {
    id: 'vault-1',
    name: '№ 01/05 Hand-Gilded Silk Shroud',
    rarity: '1-of-5 Atelier Archive',
    detail: 'Hand-finished by the artist with 24k gold foil leaf accents.',
  },
  {
    id: 'vault-2',
    name: 'Lucky Memorial Enamel Relic Pin',
    rarity: 'Patron Exclusive',
    detail: 'Heavy antique brass pin cast in solid metal with stained glass enamel.',
  },
];

export default function WardrobeSanctum() {
  const [selectedTop, setSelectedTop] = useState(WARDROBE_TOPS[0]);
  const [selectedBottom, setSelectedBottom] = useState(WARDROBE_BOTTOMS[0]);

  const [chestOpen, setChestOpen] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [chestMessage, setChestMessage] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleUnlockChest = (e) => {
    e.preventDefault();
    if (keyInput.trim().toLowerCase() === 'patron') {
      setChestOpen(true);
      setShowKeyModal(false);
      setChestMessage('The lock clicks. The corvids yield the vault.');
    } else {
      setChestMessage('The key does not turn. Corvids stir overhead.');
    }
  };

  return (
    <main className="min-h-screen bg-[#070608] text-stone-200 font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-purple-950">
      
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-stone-850 pb-5">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/90 px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white hover:border-purple-400 hover:bg-stone-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Atelier Den</span>
        </Link>

        <div className="text-center">
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 uppercase">
            The Dressing Room
          </h1>
          <p className="text-[10px] font-mono tracking-[0.3em] text-stone-500 uppercase mt-0.5">
            Atelier Wardrobe & Private Vault
          </p>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/40 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/80 transition"
        >
          <Key className="h-3.5 w-3.5 text-amber-400" />
          <span>{chestOpen ? 'Vault Unlocked' : 'Use Patron Key'}</span>
        </button>
      </header>

      {/* Main Room Body */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
        
        {/* Left Column: Gothic Window & Corvid Chest */}
        <div className="lg:col-span-4 w-full space-y-6">
          
          {/* Gothic Arched Window */}
          <div className="relative rounded-t-full border-4 border-stone-800 bg-[#0a0810] h-72 sm:h-80 shadow-[inset_0_10px_35px_rgba(0,0,0,0.9),0_10px_30px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col justify-end p-4">
            {/* Window Glass Grid Tracery */}
            <div className="absolute inset-0 pointer-events-none flex justify-center">
              <div className="w-[2px] h-full bg-stone-800/90 shadow-[0_0_10px_rgba(0,0,0,0.9)]" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-stone-800/90" />
              <div className="absolute top-1/4 left-1/4 right-1/4 h-24 border border-stone-850 rounded-t-full" />
            </div>

            {/* Ambient Mist & Twilight Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-amber-700/10 to-transparent pointer-events-none" />

            <div className="relative z-10 text-center space-y-0.5 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-400">
                Outer Woods • Twilight Rain
              </span>
              <p className="text-[11px] font-serif italic text-stone-500">
                Mist gathers against the atelier glass
              </p>
            </div>
          </div>

          {/* Corvid Antique Chest */}
          <div className="rounded-2xl border border-stone-800 bg-gradient-to-b from-stone-900/95 to-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🦅</span>
                <div>
                  <h3 className="font-serif text-sm font-bold tracking-wide text-amber-200">
                    Corvid Antique Chest
                  </h3>
                  <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    One-of-a-Kind Patron Vault
                  </p>
                </div>
              </div>

              {chestOpen ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <Unlock className="h-3.5 w-3.5" /> Opened
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                  <Lock className="h-3.5 w-3.5" /> Sealed
                </span>
              )}
            </div>

            {!chestOpen ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-stone-400 leading-relaxed">
                  Crows perch upon the heavy brass strapping. This locked vault holds 1-of-1 archive originals and limited atelier drops.
                </p>
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-xs font-serif font-bold text-amber-300 transition"
                >
                  Turn Patron Skeleton Key
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {VAULT_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-amber-100">{item.name}</span>
                      <span className="text-[9px] font-mono text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        {item.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Interactive Mannequin / Fitting Form */}
        <div className="lg:col-span-4 w-full flex flex-col items-center justify-between p-6 rounded-3xl border border-stone-800 bg-stone-900/40 shadow-2xl relative min-h-[520px]">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase tracking-widest border-b border-stone-850 pb-3">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Fitting Room Form</span>
            </span>
            <span className="text-stone-400">Live Ensemble</span>
          </div>

          {/* Mannequin Graphic Form */}
          <div className="relative w-full max-w-[280px] h-[360px] flex flex-col items-center justify-center my-4">
            <div className="w-8 h-8 rounded-full border-2 border-amber-600/50 bg-stone-950 mb-1" />
            <div className="w-2.5 h-6 bg-stone-800 rounded-t" />

            {/* Selected Top Layer */}
            <div className="relative w-48 h-36 rounded-t-3xl rounded-b-xl border border-purple-500/50 bg-gradient-to-b from-stone-850 to-stone-950 p-4 shadow-xl flex flex-col justify-between text-center overflow-hidden">
              <div className="text-xs font-mono text-amber-300/90 font-medium truncate">
                {selectedTop.name}
              </div>
              <div className="text-[10px] text-stone-400 italic">
                {selectedTop.color}
              </div>
              <div className="text-sm font-serif font-bold text-purple-300">
                {selectedTop.price}
              </div>
            </div>

            {/* Selected Bottom Layer */}
            <div className="relative w-40 h-40 -mt-2 rounded-b-2xl border border-stone-700 bg-gradient-to-b from-stone-900 to-stone-950 p-4 shadow-lg flex flex-col justify-between text-center">
              <div className="text-xs font-mono text-stone-300 font-medium truncate">
                {selectedBottom.name}
              </div>
              <div className="text-[10px] text-stone-400 italic">
                {selectedBottom.color}
              </div>
              <div className="text-sm font-serif font-bold text-stone-200">
                {selectedBottom.price}
              </div>
            </div>

            {/* Base Stand */}
            <div className="w-2.5 h-12 bg-stone-800" />
            <div className="w-24 h-2 bg-stone-700 rounded-full" />
          </div>

          <div className="w-full border-t border-stone-800 pt-3 flex items-center justify-between text-xs">
            <span className="text-stone-400">Total Ensemble:</span>
            <span className="font-serif font-bold text-amber-300 text-base">
              ${(parseInt(selectedTop.price.replace('$', '')) + parseInt(selectedBottom.price.replace('$', '')))}
            </span>
          </div>
        </div>

        {/* Right Column: Garment Racks */}
        <div className="lg:col-span-4 w-full space-y-6">
          
          {/* Tops Rack */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="font-serif text-sm font-bold text-stone-200">
                Tops & Outerwear
              </h3>
              <span className="text-[10px] font-mono text-stone-500 uppercase">{WARDROBE_TOPS.length} items</span>
            </div>

            <div className="space-y-2.5">
              {WARDROBE_TOPS.map((top) => {
                const active = selectedTop.id === top.id;
                return (
                  <button
                    key={top.id}
                    onClick={() => setSelectedTop(top)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                      active
                        ? 'border-purple-500 bg-purple-950/30 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'border-stone-850 bg-stone-950/60 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="pr-2">
                      <p className="font-serif font-bold text-xs text-stone-200">{top.name}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">{top.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-serif font-bold text-amber-300">{top.price}</span>
                      {active && <Check className="h-3.5 w-3.5 text-purple-400 ml-auto mt-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottoms Rack */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="font-serif text-sm font-bold text-stone-200">
                Bottoms & Skirts
              </h3>
              <span className="text-[10px] font-mono text-stone-500 uppercase">{WARDROBE_BOTTOMS.length} items</span>
            </div>

            <div className="space-y-2.5">
              {WARDROBE_BOTTOMS.map((bot) => {
                const active = selectedBottom.id === bot.id;
                return (
                  <button
                    key={bot.id}
                    onClick={() => setSelectedBottom(bot)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                      active
                        ? 'border-amber-500 bg-amber-950/20 text-white shadow-[0_0_15px_rgba(217,119,6,0.2)]'
                        : 'border-stone-850 bg-stone-950/60 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="pr-2">
                      <p className="font-serif font-bold text-xs text-stone-200">{bot.name}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">{bot.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-serif font-bold text-amber-300">{bot.price}</span>
                      {active && <Check className="h-3.5 w-3.5 text-amber-400 ml-auto mt-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Patron Key Unlock Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-amber-600/50 bg-stone-950 p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Key className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-amber-100">Patron Skeleton Key</h3>
              <p className="text-xs text-stone-400">
                Enter your subscription token to unlock the Corvid Chest (test key: <code className="text-amber-300 font-mono">patron</code>).
              </p>
            </div>

            <form onSubmit={handleUnlockChest} className="space-y-3">
              <input
                type="password"
                placeholder="Enter key..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                autoFocus
                className="w-full text-center rounded-lg bg-stone-900 border border-stone-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono tracking-widest"
              />

              {chestMessage && (
                <p className="text-[11px] font-mono text-amber-400">{chestMessage}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="w-1/2 py-2 rounded-lg border border-stone-700 bg-stone-900 text-xs text-stone-300 hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-black transition"
                >
                  Turn Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-4 border-t border-stone-850 text-[10px] font-mono text-stone-500 tracking-widest uppercase">
        Minds Eye Butterfly • Archival Wardrobe & Limited Editions
      </footer>

    </main>
  );
}
