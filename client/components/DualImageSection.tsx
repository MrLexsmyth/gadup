"use client";

import { useRef } from "react";
import Image from "next/image";

export default function DualImageSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    videoRef.current!.currentTime = 0; // restart video when hover ends
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2">
      {/* Left Image */}
     <div className="relative w-full h-[300px] md:h-[400px]">
  <Image
    src="/hero61.jpg"
    alt="Left image"
    fill
    className="object-cover"
    priority
  />

  {/* Overlay text */}
 <div className="absolute inset-0 flex items-center justify-end pr-6 md:pr-16">
  <div
    className="text-black p-4 md:p-2 rounded-lg max-w-xs text-right mr-8"
    style={{ fontFamily: "'Playfair Display', serif" }}
  >
    <h1 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
      SAVE UP TO 50% OFF
    </h1>
    <p className="text-sm md:text-lg leading-relaxed mb-3 text-gray-700 font-medium">
      Style that speaks confidence — explore our latest collection now.
    </p>
    <p className="text-lg md:text-xl font-semibold text-blue-700">
      From £499.00
    </p>
  </div>
</div>


</div>


      {/* Right Video (hover to play) */}
      <div
        className="relative w-full h-[300px] md:h-[400px] cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src="/earpod.mp4" // path in public/videos/
          className="w-full h-full object-cover rounded-none"
          muted
          playsInline
        />
      </div>
    </section>
  );
}
