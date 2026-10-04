'use client';

import { useState, useEffect } from 'react';

export default function LuckyCat() {
  const [pos, setPos] = useState({ x: 52, y: 84 });
  const [facing, setFacing] = useState(1);
  const [isSleeping, setIsSleeping] = useState(false);

  useEffect(() => {
    let timeoutId;

    const runCatBehavior = () => {
      if (Math.random() < 0.35) {
        setIsSleeping(true);
        timeoutId = setTimeout(() => {
          setIsSleeping(false);
          runCatBehavior();
        }, 12000 + Math.random() * 8000);
        return;
      }

      const newX = 36 + Math.random() * 32;
      const newY = 82 + Math.random() * 8;
      
      setPos((prev) => {
        setFacing(newX >= prev.x ? 1 : -1);
        return { x: newX, y: newY };
      });

      timeoutId = setTimeout(runCatBehavior, 4000 + Math.random() * 4000);
    };

    timeoutId = setTimeout(runCatBehavior, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(-50%, -50%) scaleX(${facing})`,
        transition: isSleeping ? 'none' : 'left 4s ease-in-out, top 4s ease-in-out',
      }}
      className="absolute z-20 pointer-events-none select-none"
    >
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/60 rounded-full blur-[3px]" />

      <img
        src="/lucky.gif"
        alt="Lucky the Cat"
        className={`w-20 sm:w-24 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-all duration-700 ${
          isSleeping ? 'opacity-85 brightness-90 scale-90' : 'opacity-100'
        }`}
      />
    </div>
  );
}
