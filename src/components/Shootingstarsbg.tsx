"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="-z-10 h-full absolute bg-black rounded-md  flex flex-col items-center justify-center  w-full">
      <ShootingStars />
      <StarsBackground/>
    </div>
  );
}
