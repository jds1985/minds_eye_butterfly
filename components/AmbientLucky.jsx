'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const SPOTS = [
  { name: 'hearth', style: 'bottom-16 left-12 sm:bottom-20 sm:left-24' },
  { name: 'armchair', style: 'bottom-28 left-8 sm:bottom-32 sm:left-16' },
  { name: 'desk', style: 'bottom-20 right-12 sm:bottom-24 sm:right-28' },
];

export default function AmbientLucky() {
  const router = useRouter();
  const [spotIndex, setSpotIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotIndex((prev) => (prev + 1) % SPOTS.length);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const next = clickCount + 1;
    setClickCount(next);

    if (next === 1) setSpeech("Purrrr... *sleepy wizard yawn*");
    else if (next === 2) setSpeech("Meow! Click me again to enter the Sanctum...");
    else if (next >= 3) {
      setSpeech("✨ Teleporting! ✨");
      setTimeout(() => router.push('/studio'), 800);
      return;
    }
    setTimeout(() => setSpeech(null), 3000);
  };

  const current = SPOTS[spotIndex];

  return (
    <div
      className={`absolute z-30 transition-all duration-1000 cursor-pointer select-none ${current.style}`}
      onClick={handleClick}
      title="Lucky the Wizard Cat"
    >
      {speech ? (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-purple-400 bg-purple-950 px-3 py-1.5 text-xs text-purple-200 shadow-xl">
          {speech}
        </div>
      ) : (
        <div className="absolute -top-5 right-2 text-purple-300 text-xs font-serif opacity-80 animate-bounce">
          z z Z
        </div>
      )}

      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-purple-400/60 bg-purple-950/80 p-2 shadow-2xl backdrop-blur transition hover:scale-110 active:scale-95">
        <Sparkles className="h-8 w-8 text-purple-300 animate-pulse" />
      </div>
    </div>
  );
}
