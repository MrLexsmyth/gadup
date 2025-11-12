"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

export default function DualImageSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    // Only trigger hover play on larger screens
    if (window.innerWidth >= 768) {
      videoRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768 && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // restart video
    }
  };

  // Auto-play on mobile when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log("Autoplay prevented:", err);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.innerWidth < 768) {
            playVideo();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

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

      {/* Right Video (hover on desktop, auto-play on mobile) */}
      <div
        className="relative w-full h-[300px] md:h-[400px] cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src="/earpod.mp4"
          className="w-full h-full object-cover rounded-none"
          muted
          playsInline
          loop
        />
      </div>
    </section>
  );
}
