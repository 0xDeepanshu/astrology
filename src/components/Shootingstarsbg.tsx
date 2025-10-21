"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
import Particles from "./Particles";
export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-black flex flex-col items-center justify-center overflow-hidden" style={{ pointerEvents: 'none' }}>
      <ShootingStars />
      <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <Particles
      particleColors={['#ffffff', '#ffffff']}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover={true}
      alphaParticles={false}
      disableRotation={false}
    />
      </div>
    </div>
  );
}
