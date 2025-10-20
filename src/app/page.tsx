// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ZODIACS, Zodiac } from '@/lib/zodiacs';
import Header from '@/components/header';
export default function Home() {
  const [currentZodiac, setCurrentZodiac] = useState<Zodiac>(ZODIACS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  // Pick a random zodiac
  const getRandomZodiac = (): Zodiac => {
    const randomIndex = Math.floor(Math.random() * ZODIACS.length);
    return ZODIACS[randomIndex];
  };

  // Calculate rotation angle based on zodiac index
  // Each segment = 30 degrees; rotate so selected zodiac is at top (0°)
  const calculateRotation = (zodiac: Zodiac): number => {
    return -zodiac.index * 30;
  };

  // Start spin animation and update zodiac
const spinWheel = () => {
  setIsSpinning(true);

  // Step 1: Pick the final zodiac
  const newZodiac = getRandomZodiac();
  const finalAngle = calculateRotation(newZodiac); // e.g., -90°

  // Step 2: Add extra full rotations (e.g., 5 full spins = 1800°)
  const extraRotations = 5 * 360; // 5 full spins
  const spinAngle = finalAngle - extraRotations; // e.g., -90 - 1800 = -1890

  // Step 3: Animate fast spin
  setRotationAngle(spinAngle);

  // Step 4: After fast spin, instantly snap to final angle
  setTimeout(() => {
    // Disable transition for instant snap
    setRotationAngle(finalAngle);
    setCurrentZodiac(newZodiac);
    setIsSpinning(false);
  }, 1500); // Fast spin duration (1.5s)
};
  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          spinWheel();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <>
    
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center gap-8 font-sans">
      <h1 className="text-4xl md:text-6xl font-bold text-blue-300">AstroLOLogy</h1>
      <p className="text-center max-w-lg text-gray-400 mb-6">
        Mint mystical zodiac sigils as the cosmic wheel turns. Each sign appears for one minute in the eternal celestial dance.
      </p>

      {/* Current Zodiac Display */}
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl">
          Current: <span className="font-bold text-purple-300">{currentZodiac.name} {currentZodiac.symbol}</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Next rotation in: <span className="text-yellow-300">{formatTime(timeLeft)}</span>
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative w-full max-w-md mx-auto">
        <div
    className={`transition-transform duration-1500 ease-out ${
      isSpinning ? '' : 'transition-none'
    }`}
    style={{
      transform: `rotate(${rotationAngle}deg)`,
      transition: isSpinning ? 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
    }}
  >
          <Image
            src="/images/final.png" // 👈 Use your final image
            alt="Zodiac Wheel"
            width={400}
            height={400}
            priority
            className="mx-auto"
          />
        </div>

        {/* Fixed Pointer Arrow (Top Center) */}
       <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-180 pointer-events-none">
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 5L10 15H20L15 5Z" fill="#60A5FA" stroke="#fff" strokeWidth="2" />
  </svg>
</div>
      </div>

      {/* Mint Button */}
      <div className="mt-6">
        <button
          onClick={() => alert(`Minting ${currentZodiac.name} Sigil...`)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
        >
          Mint {currentZodiac.name} Sigil ✨
        </button>
        <p className="text-xs text-gray-500 mt-2">Mint the currently active zodiac sigil NFT</p>
      </div>
    </div>
    </>
  );
}