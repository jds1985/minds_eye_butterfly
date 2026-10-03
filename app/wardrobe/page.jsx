'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Unlock, Sparkles, Check, Key, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FALLBACK_TOPS = [
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

const FALLBACK_BOTTOMS = [
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

const FALLBACK_VAULT = [
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

const ZONES = [
  {
    id: 'chest',
    label: 'Corvid Antique Chest',
    sub: 'Patron Locked Vault',
    box: { left: '3%', top: '48%', width: '25%', height: '48%' },
    pin: { left: '16%', top: '56%' },
  },
  {
    id: 'mannequin',
    label: 'Fitting Form',
    sub: 'Interactive Ensemble',
    box: { left: '42%', top: '26%', width: '13%', height: '62%' },
    pin: { left: '49%', top: '38%' },
  },
  {
    id: 'armoire',
    label: 'Wardrobe Armoire',
    sub: 'Apparel & Wares',
    box: { left: '62%', top: '15%', width: '36%', height: '78%' },
    pin: { left: '78%', top: '32%' },
  },
];

export default function WardrobeSanctum() {
  const [activeModal, setActiveModal] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);

  // Dynamic state loaded from Supabase with fallbacks
  const [allTops, setAllTops] = useState(FALLBACK_TOPS);
  const [allBottoms, setAllBottoms] = useState(FALLBACK_BOTTOMS);
  const [vaultRelics, setVaultRelics] = useState(FALLBACK_VAULT);

  const [selectedTop, setSelectedTop] = useState(FALLBACK_TOPS[0]);
  const [selectedBottom, setSelectedBottom] = useState(FALLBACK_BOTTOMS[0]);

  const [chestOpen, setChestOpen] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [chestMessage, setChestMessage] = useState('');

  const canvasRef = useRef(null);

  // Load live uploads from Supabase
  useEffect(() => {
    async function loadWardrobe() {
      try {
        const { data, error } = await supabase.from('artworks').select('*');
        if (!error && data && data.length > 0) {
          const tops = data.filter((i) => i.category === 'wardrobe_top');
          const bottoms = data.filter((i) => i.category === 'wardrobe_bottom');
          const vault = data.filter((i) => i.category === 'vault');

          if (tops.length > 0) {
            const mappedTops = tops.map((t) => ({
              id: t.id,
              name: t.title,
              color: t.medium || 'Atelier Textile',
              price: t.price || '$75',
              detail: t.medium || 'Exclusive release',
              image: t.image_url || t.imageUrl,
            }));
            setAllTops(mappedTops);
            setSelectedTop(mappedTops[0]);
          }

          if (bottoms.length > 0) {
            const mappedBottoms = bottoms.map((b) => ({
              id: b.id,
              name: b.title,
              color: b.medium || 'Atelier Textile',
              price: b.price || '$65',
              detail: b.medium || 'Exclusive release',
              image: b.image_url || b.imageUrl,
            }));
            setAllBottoms(mappedBottoms);
            setSelectedBottom(mappedBottoms[0]);
          }

          if (vault.length > 0) {
            setVaultRelics(
              vault.map((v) => ({
                id: v.id,
                name: v.title,
                rarity: v.rarity || 'Patron Exclusive',
                detail: v.medium || 'Hand-finished archive piece',
                image: v.image_url || v.imageUrl,
              }))
            );
          }
        }
      } catch (err) {
        console.error('Wardrobe Supabase fetch error:', err);
      }
    }
    loadWardrobe();
  }, []);

  // Rain & Rare Crow Flight Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let time = 0;

    const WIN_LEFT = 350;
    const WIN_TOP = 20;
    const WIN_WIDTH = 680;
    const WIN_HEIGHT = 650;

    const raindrops = Array.from({ length: 120 }, () => ({
      x: WIN_LEFT + Math.random() * WIN_WIDTH,
      y: WIN_TOP + Math.random() * WIN_HEIGHT,
      len: Math.random() * 22 + 14,
      speedY: Math.random() * 14 + 16,
      speedX: -1.2,
      opacity: Math.random() * 0.4 + 0.15,
      width: Math.random() * 1.2 + 0.6,
    }));

    let crowActive = false;
    let crow = { x: WIN_WIDTH + 100, y: 180, scale: 0.55, speedX: -1.6, speedY: 0.15, wingCycle: 0 };
    let nextCrowTime = 120;

    const drawCrow = (x, y, scale, wingPhase) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = 'rgba(15, 12, 20, 0.78)';
      const wingFlap = Math.sin(wingPhase) * 8;

      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 2.5, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-1, -1);
      ctx.quadraticCurveTo(-5, -8 + wingFlap, -12, -4 + wingFlap);
      ctx.quadraticCurveTo(-6, -1, 0, 0);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(1, -1);
      ctx.quadraticCurveTo(5, -8 + wingFlap, 12, -4 + wingFlap);
      ctx.quadraticCurveTo(6, -1, 0, 0);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, 1920, 1080);
      time += 0.02;

      ctx.save();
      ctx.beginPath();
      ctx.rect(WIN_LEFT, WIN_TOP, WIN_WIDTH, WIN_HEIGHT);
      ctx.clip();

      if (!crowActive) {
        nextCrowTime -= 1;
        if (nextCrowTime <= 0) {
          crowActive = true;
          crow.x = WIN_LEFT + WIN_WIDTH + 40;
          crow.y = WIN_TOP + 120 + Math.random() * 160;
          crow.scale = 0.45 + Math.random() * 0.25;
          crow.speedX = -(1.2 + Math.random() * 0.8);
          crow.wingCycle = 0;
        }
      } else {
        crow.x += crow.speedX;
        crow.y += crow.speedY;
        crow.wingCycle += 0.14;
        drawCrow(crow.x, crow.y, crow.scale, crow.wingCycle);

        if (crow.x < WIN_LEFT - 60) {
          crowActive = false;
          nextCrowTime = 800 + Math.random() * 600;
        }
      }

      ctx.strokeStyle = 'rgba(215, 230, 255, 0.45)';
      raindrops.forEach((drop) => {
        drop.y += drop.speedY;
        drop.x += drop.speedX;

        if (drop.y > WIN_TOP + WIN_HEIGHT) {
          drop.y = WIN_TOP - 20;
          drop.x = WIN_LEFT + Math.random() * WIN_WIDTH;
        }

        ctx.globalAlpha = drop.opacity;
        ctx.lineWidth = drop.width;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.speedX * 2, drop.y + drop.len);
        ctx.stroke();
      });

      const mistGlow = ctx.createLinearGradient(WIN_LEFT, WIN_TOP, WIN_LEFT, WIN_TOP + WIN_HEIGHT);
      mistGlow.addColorStop(0, 'rgba(40, 25, 55, 0.08)');
      mistGlow.addColorStop(0.5, 'rgba(90, 80, 110, 0.04)');
      mistGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mistGlow;
      ctx.fillRect(WIN_LEFT, WIN_TOP, WIN_WIDTH, WIN_HEIGHT);

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleUnlockChest = (e) => {
    e.preventDefault();
    const cleanKey = keyInput.trim().toLowerCase();
    if (cleanKey === 'patron' || cleanKey === 'butterfly' || cleanKey === 'crow') {
      setChestOpen(true);
      setChestMessage('The brass lock clicks open. The corvids yield the vault.');
    } else {
      setChestMessage('The skeleton key does not turn. Corvids stir overhead.');
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black select-none text-stone-200 font-sans flex items-center justify-center">
      
      {/* Top Floating Atelier Bar */}
      <header className="absolute top-3 left-0 right-0 z-40 flex items-center justify-between px-6 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-stone-700 bg-stone-950/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white hover:border-purple-400 transition shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Den</span>
        </Link>

        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-serif italic text-lg sm:text-2xl font-semibold tracking-wide bg-gradient-to-r from-violet-200 via-pink-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            The Dressing Room
          </h1>
          <p className="text-[9px] font-mono tracking-[0.3em] text-amber-200/80 uppercase drop-shadow">
            Atelier Wardrobe & Private Vault
          </p>
        </div>

        <button
          onClick={() => setActiveModal('chest')}
          className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-stone-950/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-amber-300 hover:border-amber-400 transition shadow-lg"
        >
          <Key className="h-3.5 w-3.5 text-amber-400" />
          <span>{chestOpen ? 'Vault Open' : 'Patron Key'}</span>
        </button>
      </header>

      {/* Main Room Viewport */}
      <div className="relative w-full max-w-[1920px] aspect-[16/9] max-h-screen overflow-hidden flex items-center justify-center">
        <img
          src="/Dressing_room.jpg"
          alt="The Dressing Room Atelier"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
        />

        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full pointer-events-none z-10"
        />

        {/* Interactive Hotspot Pins */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {ZONES.map((zone) => {
            const isHovered = hoveredZone === zone.id;
            return (
              <div
                key={zone.id}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => {
                  setHoveredZone(null);
                  setActiveModal(zone.id);
                }}
                style={{
                  left: zone.box.left,
                  top: zone.box.top,
                  width: zone.box.width,
                  height: zone.box.height,
                }}
                className="absolute cursor-pointer pointer-events-auto"
              >
                <div
                  style={{
                    left: `calc(${zone.pin.left} - ${zone.box.left})`,
                    top: `calc(${zone.pin.top} - ${zone.box.top})`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
                    isHovered ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75'
                  }`}
                >
                  <span className="absolute -inset-2 rounded-full bg-purple-500/40 animate-ping" />

                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-stone-950/90 border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.9)] backdrop-blur-md">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-purple-300 drop-shadow-[0_0_6px_#c084fc] animate-pulse"
                    >
                      <path d="M12 4c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1s1-.4 1-1V5c0-.6-.4-1-1-1zm-1.5 2.5C7.5 3 2 4.5 2 9.5c0 4 4.5 6.5 8.5 7.5V6.5zm3 0v10.5c4-1 8.5-3.5 8.5-7.5 0-5-5.5-6.5-8.5-3z" />
                    </svg>
                  </div>

                  <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 flex flex-col items-center">
                    <div className="bg-stone-950/95 border border-purple-400/70 px-3 py-1.5 rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.9)] whitespace-nowrap text-center">
                      <p className="text-xs font-serif font-bold text-purple-200 tracking-wider">
                        {zone.label}
                      </p>
                      <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                        {zone.sub}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-stone-950 border-r border-b border-purple-400/70 rotate-45 -mt-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: CROW CHEST & PATRON VAULT */}
      {activeModal === 'chest' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-amber-600/50 bg-stone-950/95 p-6 shadow-[0_0_50px_rgba(217,119,6,0.3)] space-y-4">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
              <span className="text-3xl">🦅</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-200">
                  Corvid Antique Chest
                </h3>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  Archival Limited Edition Vault
                </p>
              </div>
            </div>

            {!chestOpen ? (
              <form onSubmit={handleUnlockChest} className="space-y-4 pt-2">
                <p className="text-xs text-stone-300 leading-relaxed">
                  Two black crows guard the weathered brass strapping. Enter your patron key or token to turn the heavy tumbler (key: <code className="text-amber-300 font-mono">patron</code>).
                </p>

                <input
                  type="password"
                  placeholder="Enter patron key..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  autoFocus
                  className="w-full text-center rounded-lg bg-stone-900 border border-stone-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono tracking-widest shadow-inner"
                />

                {chestMessage && (
                  <p className="text-xs font-mono text-amber-400 text-center">{chestMessage}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-serif font-bold text-xs text-black uppercase tracking-wider transition shadow-md"
                >
                  Turn Skeleton Key
                </button>
              </form>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-mono pb-1 border-b border-stone-850">
                  <span className="flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5" /> Vault Unlocked</span>
                  <span>{vaultRelics.length} Relics Found</span>
                </div>

                {vaultRelics.map((item) => (
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
      )}

      {/* MODAL 2: FITTING FORM & LIVE STYLING MANNEQUIN */}
      {activeModal === 'mannequin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-stone-800 bg-stone-950/95 p-6 shadow-2xl flex flex-col md:flex-row gap-6">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-stone-800 pb-4 md:pb-0 md:pr-6">
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  Atelier Ensemble
                </span>
                <h3 className="font-serif text-base font-bold text-amber-100">
                  Current Fitting
                </h3>
              </div>

              <div className="relative w-48 h-64 flex flex-col items-center justify-center my-4">
                <div className="w-7 h-7 rounded-full border border-amber-600/50 bg-stone-900 mb-1 shadow" />
                <div className="w-2 h-4 bg-stone-700" />

                <div className="relative w-36 h-28 rounded-t-2xl rounded-b-lg border border-purple-500/50 bg-stone-900 p-2 text-center flex flex-col justify-between shadow-lg">
                  <span className="text-[10px] font-mono text-amber-200 truncate">{selectedTop.name}</span>
                  <span className="text-xs font-serif font-bold text-purple-300">{selectedTop.price}</span>
                </div>

                <div className="relative w-28 h-32 -mt-1 rounded-b-xl border border-stone-700 bg-stone-950 p-2 text-center flex flex-col justify-between shadow-md">
                  <span className="text-[10px] font-mono text-stone-300 truncate">{selectedBottom.name}</span>
                  <span className="text-xs font-serif font-bold text-stone-200">{selectedBottom.price}</span>
                </div>

                <div className="w-2 h-8 bg-stone-700" />
                <div className="w-16 h-1.5 bg-stone-600 rounded-full" />
              </div>

              <div className="w-full pt-2 flex items-center justify-between text-xs border-t border-stone-850">
                <span className="text-stone-400">Total:</span>
                <span className="font-serif font-bold text-amber-300 text-sm">
                  ${parseInt((selectedTop?.price || '$0').replace(/[^0-9]/g, '') || 0) + parseInt((selectedBottom?.price || '$0').replace(/[^0-9]/g, '') || 0)}
                </span>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Select Top</span>
                <div className="space-y-1.5 mt-1.5">
                  {allTops.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTop(t)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition ${
                        selectedTop?.id === t.id
                          ? 'border-purple-400 bg-purple-950/40 text-white'
                          : 'border-stone-850 bg-stone-900/50 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <span className="font-medium truncate">{t.name}</span>
                      <span className="font-bold text-amber-300 pl-2">{t.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Select Bottom</span>
                <div className="space-y-1.5 mt-1.5">
                  {allBottoms.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBottom(b)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition ${
                        selectedBottom?.id === b.id
                          ? 'border-amber-400 bg-amber-950/30 text-white'
                          : 'border-stone-850 bg-stone-900/50 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <span className="font-medium truncate">{b.name}</span>
                      <span className="font-bold text-amber-300 pl-2">{b.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: WARDROBE ARMOIRE CATALOG */}
      {activeModal === 'armoire' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-stone-800 bg-stone-950/95 p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  The Atelier Armoire
                </h3>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  Fine Apparel & Hand-Crafted Goods
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 overflow-y-auto pr-1">
              {[...allTops, ...allBottoms].map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-850 bg-stone-900/60 flex flex-col justify-between space-y-2 hover:border-purple-400/50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-stone-100">{item.name}</h4>
                      <span className="font-serif font-bold text-sm text-amber-300">{item.price}</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 italic block">{item.color}</span>
                    <p className="text-[11px] text-stone-400 leading-snug">{item.detail}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (allTops.some((t) => t.id === item.id)) setSelectedTop(item);
                      else setSelectedBottom(item);
                      setActiveModal('mannequin');
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg border border-purple-500/40 bg-purple-950/30 text-xs font-serif text-purple-200 hover:bg-purple-900/50 transition"
                  >
                    Try on Fitting Form →
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-850 pt-3 text-center text-[10px] font-mono text-stone-500 uppercase tracking-widest">
              Direct Inquiries & Pre-Orders Open Through Studio Mobile
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
