'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ZODIACS, Zodiac } from '@/lib/zodiacs';
import { ShootingStarsAndStarsBackgroundDemo } from '@/components/Shootingstarsbg';
import Particles from '@/components/Particles';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { ASTROSIGILS_CONTRACT_ADDRESS, ASTROOCULI_CONTRACT_ADDRESS } from '@/contracts';
import astrosigilsAbi from '@/abi/astrosigils.json';
import astrooculiAbi from '@/abi/astrooculi.json'

// ⚠️ If your contract uses a different cycle length, replace this or read it from chain
const CYCLE_LENGTH_SECONDS = 10; // Must match contract's cycleLengthInSeconds()
export default function Home() {

  
  // Blockchain state
  const { data: cycleEpoch } = useReadContract({
    address: ASTROSIGILS_CONTRACT_ADDRESS,
    abi: astrosigilsAbi,
    functionName: 'cycleEpoch',
  });

  const { data: loopLength } = useReadContract({
    address: ASTROSIGILS_CONTRACT_ADDRESS,
    abi: astrosigilsAbi,
    functionName: 'loopLength',
  });

  // Local UI state
  const [currentZodiac, setCurrentZodiac] = useState<Zodiac>(ZODIACS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(CYCLE_LENGTH_SECONDS);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Separate state for Occuli minting
  const { data: occuliHash, writeContract: writeOcculiContract, error: occuliWriteError, isPending: isOcculiPending } = useWriteContract();
  const { isLoading: isOcculiConfirming, isSuccess: isOcculiConfirmed } = useWaitForTransactionReceipt({ hash: occuliHash });

  // Refs to avoid re-renders in callbacks
  const currentZodiacRef = useRef(currentZodiac);
  const rotationAngleRef = useRef(rotationAngle);
  const prevZodiacIndexRef = useRef<number | null>(null);


  const { data: hasCompleteSet, refetch: refetchCompleteSet } = useReadContract({
    address: ASTROOCULI_CONTRACT_ADDRESS,
    abi: astrooculiAbi,
    functionName: 'checkCompleteSet',
    args: address ? [address] : undefined, // Only call if address exists
   
  });
 
  // Keep refs in sync
  useEffect(() => {
    currentZodiacRef.current = currentZodiac;
  }, [currentZodiac]);

  useEffect(() => {
    rotationAngleRef.current = rotationAngle;
  }, [rotationAngle]);

  // 🔁 Calculate current zodiac & time left from blockchain time
  const updateFromChainTime = useCallback(() => {
    if (cycleEpoch === undefined || loopLength === undefined) return;

    const now = Math.floor(Date.now() / 1000);
    const epoch = Number(cycleEpoch);
    const totalLoops = Number(loopLength);

    const elapsed = now - epoch;
    const currentZodiacIndex = Math.floor(elapsed / CYCLE_LENGTH_SECONDS) % totalLoops;
    const timeIntoCycle = elapsed % CYCLE_LENGTH_SECONDS;
    const timeRemaining = CYCLE_LENGTH_SECONDS - timeIntoCycle;

    // Update time left immediately
    setTimeLeft(timeRemaining);

    // Only update zodiac if it changed (to trigger spin)
    if (prevZodiacIndexRef.current !== null && prevZodiacIndexRef.current !== currentZodiacIndex) {
      const newZodiac = ZODIACS[currentZodiacIndex];
      setCurrentZodiac(newZodiac);
      spinToZodiac(newZodiac);
    } else if (prevZodiacIndexRef.current === null) {
      // First load: set initial zodiac without animation
      const newZodiac = ZODIACS[currentZodiacIndex];
      setCurrentZodiac(newZodiac);
      setRotationAngle(-currentZodiacIndex * 30);
    }

    prevZodiacIndexRef.current = currentZodiacIndex;
  }, [cycleEpoch, loopLength]);

  // 🌀 Spin animation to target zodiac
  const spinToZodiac = (zodiac: Zodiac) => {
    setIsSpinning(true);
    const finalAngle = -zodiac.index * 30;
    const extraRotations = 5 * 360;
    const spinAngle = finalAngle - extraRotations;

    setRotationAngle(spinAngle);

    setTimeout(() => {
      setRotationAngle(finalAngle);
      setIsSpinning(false);
    }, 1500);
  };

  // 🕒 Continuously sync with real time (every 200ms for smoothness)
  useEffect(() => {
    if (cycleEpoch === undefined || loopLength === undefined) return;

    const interval = setInterval(updateFromChainTime, 200);
    return () => clearInterval(interval);
  }, [updateFromChainTime]);


  const handleMintOcculi = async () => {
  if (!isConnected || !address) {
    alert('Please connect your wallet first');
    return;
  }

  if (hasCompleteSet !== true) {
    alert('You need a complete set of zodiac symbols to mint an orbs!');
    return;
  }

  try {
    writeOcculiContract({
      address: ASTROOCULI_CONTRACT_ADDRESS as `0x${string}`,
      abi: astrooculiAbi,
      functionName: 'mint', // 👈 or 'mintOcculi' — check your contract!
    });
  } catch (error) {
    console.error('Error minting Occuli:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    alert(`Error minting Occuli: ${errorMessage}`);
  }
};
  // 💰 Mint function (unchanged logic)
  const handleMintSigil = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      writeContract({
        address: ASTROSIGILS_CONTRACT_ADDRESS as `0x${string}`,
        abi: astrosigilsAbi,
        functionName: 'mint',
      });
    } catch (error) {
      console.error('Error minting sigil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error minting ${currentZodiac.name} Sigil: ${errorMessage}`);
    }
  };

  // 🕒 Format time as MM:SS (but max 30s, so usually SS)
  const formatTime = (seconds: number): string => {
    const secs = Math.max(0, Math.floor(seconds)).toString().padStart(2, '0');
    return `00:${secs}`;
  };

  // Show loading while fetching chain data
  if (cycleEpoch === undefined || loopLength === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading cosmic clock...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 flex flex-col items-center justify-center gap-6 md:gap-8 font-sans overflow-hidden relative" style={{ pointerEvents: 'auto' }}>
      <div className="absolute inset-0 z-0">
        <ShootingStarsAndStarsBackgroundDemo />
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-300 text-center z-10 relative" style={{ pointerEvents: 'auto' }}>
        AstroLOLogy
      </h1>
      <p className="text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-gray-400 px-2 z-10 relative" style={{ pointerEvents: 'auto' }}>
        Mint mystical zodiac symbols as the cosmic wheel turns. Each sign appears for 30 seconds in the eternal celestial dance.
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
          className="transition-transform duration-1500 ease-out"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transition: isSpinning ? 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
          }}
        >
          <Image
            src="/images/sigilwheel.png"
            alt="Zodiac Wheel"
            width={400}
            height={400}
            priority
            className="w-full h-auto max-w-full max-h-full rotate-[-13deg]"
          />
        </div>

        {/* Fixed Pointer Arrow (Top Center) */}
        <div className="absolute top-[-5] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-180 pointer-events-none z-20">
          <svg width="70" height="70" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          {isPending || isConfirming ? 'Minting...' : `Mint ${currentZodiac.name} symbol ✨`}
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">Mint the currently active zodiac symbol NFT</p>

        {writeError && <p className="text-red-500 text-sm mt-2 text-center">Error: {writeError.message}</p>}
        {isConfirming && <p className="text-yellow-400 text-sm mt-2 text-center">Waiting for confirmation...</p>}
        {isConfirmed && (
          <p className="text-green-500 text-sm mt-2 text-center">
            Successfully minted {currentZodiac.name} symbol! 🎉
          </p>
        )}
        <button
            onClick={handleMintOcculi}
            disabled={!hasCompleteSet || !isConnected || isOcculiPending || isOcculiConfirming}
            className={`w-full px-4 py-3 sm:px-6 rounded-lg font-semibold transition-all shadow-lg ${
              hasCompleteSet && isConnected
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {isOcculiPending || isOcculiConfirming ? 'Minting...' : (hasCompleteSet ? 'Mint orbs 🔮' : '🔒 Sacrifice Locked')}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">Mint at least one complete set of symbols to unlock sacrifice</p>
          {!hasCompleteSet && isConnected && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              
            </p>
          )}
          {occuliWriteError && <p className="text-red-500 text-sm mt-2 text-center">Error: {occuliWriteError.message}</p>}
          {isOcculiConfirming && <p className="text-yellow-400 text-sm mt-2 text-center">Waiting for confirmation...</p>}
          {isOcculiConfirmed && (
            <p className="text-green-500 text-sm mt-2 text-center">
              Successfully minted orbs! 🎉
            </p>
          )}
      </div>
    </div>
  );
}