// app/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ZODIACS, Zodiac } from '@/lib/zodiacs';
import { ShootingStarsAndStarsBackgroundDemo } from '@/components/Shootingstarsbg';
import Particles from '@/components/Particles';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { ASTROSIGILS_CONTRACT_ADDRESS } from '@/contracts';
import astrosigilsAbi from '@/abi/astrosigils.json';

export default function Home() {
  const [currentZodiac, setCurrentZodiac] = useState<Zodiac>(ZODIACS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  
  const { address, isConnected } = useAccount();
  
  // Write contract function for minting
  const { data: hash, writeContract, error: writeError, isPending } = useWriteContract();
  
  // Wait for transaction receipt to know when minting is complete
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  // Refs to track current values in callbacks without re-rendering
  const currentZodiacRef = useRef(currentZodiac);
  const rotationAngleRef = useRef(rotationAngle);
  
  // Update refs whenever values change
  useEffect(() => {
    currentZodiacRef.current = currentZodiac;
  }, [currentZodiac]);
  
  useEffect(() => {
    rotationAngleRef.current = rotationAngle;
  }, [rotationAngle]);
  
  // Function to mint the current zodiac sigil
  const handleMintSigil = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      // Call the mint function on the Astrosigils contract
      writeContract({
        address: ASTROSIGILS_CONTRACT_ADDRESS as `0x${string}`,
        abi: astrosigilsAbi,
        functionName: 'mint',
      });
    } catch (error) {
      console.error('Error minting sigil:', error);
      alert(`Error minting ${currentZodiac.name} Sigil: ${error.message || 'Unknown error'}`);
    }
  };

  // Get the next zodiac sign in sequence
  const getNextZodiac = (current: Zodiac): Zodiac => {
    const currentIndex = current.index;
    const nextIndex = (currentIndex + 1) % ZODIACS.length; // Go to next, wrap to 0 after 11
    return ZODIACS[nextIndex];
  };

  // Calculate rotation angle based on zodiac index
  // Each segment = 30 degrees; rotate so selected zodiac is at top (0°)
  const calculateRotation = (zodiac: Zodiac): number => {
    return -zodiac.index * 30;
  };

  // Start spin animation and update zodiac
const spinWheel = useCallback(() => {
  setIsSpinning(true);

  // Use the ref to get the current zodiac value
  const newZodiac = getNextZodiac(currentZodiacRef.current);
  const finalAngle = calculateRotation(newZodiac); // e.g., -90°

  // Use the ref to get the current rotation angle
  const currentAngle = rotationAngleRef.current;
  const spinAngle = currentAngle - 360; // Make one full clockwise rotation from current position

  // Step 3: Animate fast spin
  setRotationAngle(spinAngle);

  // Step 4: After fast spin, transition smoothly to final angle
  setTimeout(() => {
    setRotationAngle(finalAngle);
    setCurrentZodiac(newZodiac);
    setIsSpinning(false);
  }, 1500); // Fast spin duration (1.5s)
}, [getNextZodiac, calculateRotation]); // Adding dependencies
  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          spinWheel();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [spinWheel]); // Adding spinWheel as dependency since it's now properly memoized with useCallback

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 flex flex-col items-center justify-center gap-6 md:gap-8 font-sans overflow-hidden relative" style={{ pointerEvents: 'auto' }}>
      <div className="absolute inset-0 z-0">
        <ShootingStarsAndStarsBackgroundDemo/>
      </div>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-300 text-center z-10 relative" style={{ pointerEvents: 'auto' }}>AstroLOLogy</h1>
      <p className="text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-gray-400 px-2 z-10 relative" style={{ pointerEvents: 'auto' }}>
        Mint mystical zodiac sigils as the cosmic wheel turns. Each sign appears for one minute in the eternal celestial dance.
      </p>

      {/* Current Zodiac Display */}
      <div className="text-center mb-4 px-2 z-10 relative" style={{ pointerEvents: 'auto' }}>
        <h2 className="text-lg sm:text-xl md:text-2xl">
          Current: <span className="font-bold text-purple-300">{currentZodiac.name} {currentZodiac.symbol}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Next rotation in: <span className="text-yellow-300">{formatTime(timeLeft)}</span>
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square z-10" style={{ pointerEvents: 'auto' }}>
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
            src="/images/sigilwheel.png" // 👈 Use your final image
            alt="Zodiac Wheel"
            width={400}
            height={400}
            priority
            className="w-full h-auto max-w-full max-h-full rotate-[-13deg]"
          />
        </div>

        {/* Fixed Pointer Arrow (Top Center) */}
       <div className="absolute top-[-5] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-180 pointer-events-none z-20">
  <svg
    width="70"
    height="70"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 5L10 15H20L15 5Z" fill="#60A5FA" stroke="#fff" strokeWidth="2" />
  </svg>
</div>
      </div>

      {/* Mint Button */}
      <div className="mt-4 sm:mt-6 px-2 w-full max-w-xs sm:max-w-sm z-10 relative" style={{ pointerEvents: 'auto' }}>
        <button
          onClick={handleMintSigil}
          disabled={isPending || isConfirming}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-3 sm:px-6 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? 'Minting...' : `Mint ${currentZodiac.name} Sigil ✨`}
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">Mint the currently active zodiac sigil NFT</p>
        
        {/* Transaction status messages */}
        {writeError && (
          <p className="text-red-500 text-sm mt-2 text-center">
            Error: {writeError.message}
          </p>
        )}
        {isConfirming && (
          <p className="text-yellow-400 text-sm mt-2 text-center">
            Waiting for confirmation...
          </p>
        )}
        {isConfirmed && (
          <p className="text-green-500 text-sm mt-2 text-center">
            Successfully minted {currentZodiac.name} Sigil! 🎉
          </p>
        )}
      </div>
    </div>
  );
}