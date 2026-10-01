'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SPOTS = [
  { name: 'hearth', style: 'bottom-12 left-16 sm:bottom-16 sm:left-24' },
  { name: 'armchair', style: 'bottom-24 left-8 sm:bottom-28 sm:left-12' },
  { name: 'desk', style: 'bottom-16 right-16 sm:bottom-20 sm:right-28' },
  { name: 'crystal', style: 'bottom-28 right-8 sm:bottom-32 sm:right-16' },
];

export default function AmbientLucky() {
  const router = useRouter();
  const [spotIndex, setSpotIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotIndex((prev) => (prev + 1) % SPOTS.length);
    }, 70000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const nextClicks = clickCount + 1;
    setClickCount(nextClicks);

    if (nextClicks === 1) setSpeech("Purrrr... *sleepy yawn*");
    else if (nextClicks === 2) setSpeech("Meow! Are you looking for the wizard sanctum?");
    else if (nextClicks >= 3) {
      setSpeech("✨ Opening secret portal! ✨");
      setTimeout(() => router.push('/studio'), 900);
      return;
    }

    setTimeout(() => setSpeech(null), 3500);
  };

  const currentSpot = SPOTS[spotIndex];

  return (
    <div
      className={`absolute z-30 transition-all duration-1000 ease-in-out cursor-pointer select-none ${currentSpot.style}`}
      onClick={handleClick}
      title="Lucky the Wizard Cat is snoozing here..."
    >
      {speech && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-purple-400/40 bg-purple-950/90 px-3 py-1.5 text-xs font-medium text-purple-200 shadow-xl backdrop-blur-sm">
          {speech}
        </div>
      )}

      {!speech && (
        <div className="absolute -top-4 right-1 pointer-events-none text-purple-300 text-xs font-serif opacity-70 animate-pulse">
          z z Z
        </div>
      )}

      <div className="relative h-20 w-20 sm:h-24 sm:w-24 transition-transform hover:scale-110 active:scale-95 animate-pulse duration-[3500ms]">
        <Image src="/lucky-wizard.png" alt="Lucky sleeping" fill className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter brightness-95" />
      </div>
    </div>
  );
}
