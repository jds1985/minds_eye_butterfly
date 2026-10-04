'use client';

import { useState, useEffect } from 'react';

export default function LuckyCat() {
  const [pos, setPos] = useState({ x: 50, y: 86 });
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
        }, 10000 + Math.random() * 8000);
        return;
      }

      const newX = 35 + Math.random() * 32;
      const newY = 82 + Math.random() * 8;

      setPos((prev) => {
        setFacing(newX >= prev.x ? -1 : 1); // Face the direction of motion
        return { x: newX, y: newY };
      });

      timeoutId = setTimeout(runCatBehavior, 4500 + Math.random() * 3500);
    };

    timeoutId = setTimeout(runCatBehavior, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `translate(-50%, -50%) scaleX(${facing})`,
        transition: isSleeping ? 'none' : 'left 4.5s ease-in-out, top 4.5s ease-in-out',
      }}
      className="absolute z-20 pointer-events-none select-none"
    >
      {/* Soft candle drop shadow on floor */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/60 rounded-full blur-[3px]" />

      <img
        src="/lucky.gif"
        alt=""
        aria-hidden="true"
        className={`w-20 sm:w-28 h-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] transition-all duration-700 ${
          isSleeping ? 'opacity-85 brightness-90 scale-90' : 'opacity-100'
        }`}
      />
    </div>
  );
}
